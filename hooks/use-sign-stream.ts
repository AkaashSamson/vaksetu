import { useState, useRef, useCallback, useEffect } from "react";
import { MediaPipeManager } from "@/lib/mediapipe/mediapipe-manager";
import { FeatureNormalizer } from "@/lib/mediapipe/feature-normalizer";
import { drawSkeletonOverlay } from "@/lib/mediapipe/skeleton-renderer";
import { TranslationState } from "@/lib/mediapipe/types";

const DEFAULT_WS_URL = process.env.NEXT_PUBLIC_SIGN_API_WS_URL || "ws://127.0.0.1:8000/ws/translate";
const DEFAULT_HTTP_URL = process.env.NEXT_PUBLIC_SIGN_API_HTTP_URL || "http://127.0.0.1:8000";

export function useSignStream() {
    const [translationState, setTranslationState] = useState<TranslationState>("IDLE");
    const [detectedGlosses, setDetectedGlosses] = useState<string[]>([]);
    const [recognizedEnglish, setRecognizedEnglish] = useState<string>("");
    const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const wsRef = useRef<WebSocket | null>(null);
    const mediaPipeRef = useRef<MediaPipeManager | null>(null);
    const normalizerRef = useRef<FeatureNormalizer | null>(null);
    const animFrameIdRef = useRef<number | null>(null);
    const lastFrameTimeRef = useRef<number>(0);
    const detectedGlossesRef = useRef<string[]>([]);

    // Keep ref in sync with state for access in callbacks
    useEffect(() => {
        detectedGlossesRef.current = detectedGlosses;
    }, [detectedGlosses]);

    // Initialize MediaPipe & Normalizer on demand
    const getMediaPipe = useCallback(() => {
        if (!mediaPipeRef.current) {
            mediaPipeRef.current = new MediaPipeManager();
        }
        return mediaPipeRef.current;
    }, []);

    const getNormalizer = useCallback(() => {
        if (!normalizerRef.current) {
            normalizerRef.current = new FeatureNormalizer();
        }
        return normalizerRef.current;
    }, []);

    // Perform health check API verification before connecting WebSocket
    const checkBackendHealth = async (): Promise<boolean> => {
        try {
            console.log(`[useSignStream] Checking backend health at ${DEFAULT_HTTP_URL}/health ...`);
            const res = await fetch(`${DEFAULT_HTTP_URL}/health`);
            if (!res.ok) {
                console.warn("[useSignStream] Health check HTTP response not OK:", res.status);
                return false;
            }
            const data = await res.json();
            console.log("[useSignStream] Backend health response:", data);
            return data.status === "healthy" && data.schema_version === "1.0" && data.feature_dimension === 506;
        } catch (e) {
            console.warn("[useSignStream] Health check request error:", e);
            return false;
        }
    };

    // Trigger feature validation call (POST /validate_features via Next.js API proxy)
    const validateFeaturesWithBackend = async (video: HTMLVideoElement) => {
        try {
            console.log("[useSignStream] Initiating feature validation sample frame...");
            const mp = getMediaPipe();
            const normalizer = getNormalizer();

            const raw = mp.processVideoFrame(video, performance.now());
            const fullFeatures = normalizer.normalizeFrame(raw);
            const payload = normalizer.formatValidationPayload(raw, fullFeatures);

            console.log("[useSignStream] Sending feature validation request payload...", payload);

            const res = await fetch("/api/sign-to-text/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            console.log("[useSignStream] Feature validation response returned:", data);
        } catch (e) {
            console.warn("[useSignStream] Feature validation call encountered error:", e);
        }
    };

    // LLM synthesis helper calling server API route
    const synthesizeSentence = async (words: string[]) => {
        console.log("[useSignStream] Triggering LLM synthesis for words:", words);
        if (!words || words.length === 0) {
            setRecognizedEnglish("");
            return;
        }

        setIsSynthesizing(true);
        try {
            const res = await fetch("/api/sign-to-text/synthesize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ words })
            });
            const data = await res.json();
            console.log("[useSignStream] LLM synthesis API response:", data);
            if (res.ok && data.sentence) {
                setRecognizedEnglish(data.sentence);
            } else {
                setRecognizedEnglish(words.join(" "));
            }
        } catch (e) {
            console.error("[useSignStream] LLM synthesis call failed:", e);
            setRecognizedEnglish(words.join(" "));
        } finally {
            setIsSynthesizing(false);
        }
    };

    // Stop active stream and synthesize
    const stopTranslation = useCallback(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            console.log("[useSignStream] Sending STOP signal over WebSocket...");
            wsRef.current.send(JSON.stringify({ type: "stop" }));
        } else {
            console.log("[useSignStream] WebSocket not open when stopping. Triggering synthesis with accumulated glosses...");
            void synthesizeSentence(detectedGlossesRef.current);
        }
    }, []);

    // Start live WebSocket stream and frame processing loop
    const startTranslation = useCallback(async (video: HTMLVideoElement | null, canvas: HTMLCanvasElement | null) => {
        if (!video) return;
        setErrorMessage(null);
        setTranslationState("CONNECTING");

        // 1. Verify health check
        const isHealthy = await checkBackendHealth();
        if (!isHealthy) {
            console.warn("[useSignStream] Backend health check warned or unverified, attempting connection regardless...");
        }

        // 2. Ensure MediaPipe is initialized
        const mp = getMediaPipe();
        if (!mp.ready) {
            try {
                console.log("[useSignStream] Initializing MediaPipe models...");
                await mp.initialize();
            } catch (err: any) {
                console.error("[useSignStream] MediaPipe initialization error:", err);
                setErrorMessage("Failed to load MediaPipe gesture recognition models.");
                setTranslationState("ERROR");
                return;
            }
        }

        const normalizer = getNormalizer();
        normalizer.reset();
        setDetectedGlosses([]);
        setRecognizedEnglish("");

        // 3. Perform Feature Validation test with Python backend
        await validateFeaturesWithBackend(video);

        // 4. Open WebSocket Connection
        console.log(`[useSignStream] Connecting to WebSocket at ${DEFAULT_WS_URL} ...`);
        const ws = new WebSocket(DEFAULT_WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("[useSignStream] WebSocket connected successfully.");
            setTranslationState("TRANSLATING");

            // Frame processing loop at ~15-20 FPS (every 50ms)
            const processLoop = (timestamp: number) => {
                if (timestamp - lastFrameTimeRef.current >= 50) {
                    lastFrameTimeRef.current = timestamp;

                    if (video && ws.readyState === WebSocket.OPEN) {
                        const now = performance.now();
                        const raw = mp.processVideoFrame(video, now);
                        drawSkeletonOverlay(canvas, video, raw.left_hand, raw.right_hand);

                        const features = normalizer.normalizeFrame(raw);
                        ws.send(JSON.stringify({
                            type: "landmarks",
                            schema_version: "1.0",
                            feature_dimension: 506,
                            sequence_length: 20,
                            features,
                            timestamp: Date.now()
                        }));
                    }
                }
                animFrameIdRef.current = requestAnimationFrame(processLoop);
            };

            animFrameIdRef.current = requestAnimationFrame(processLoop);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("[useSignStream] Received Server WS Message:", data);

                // 1. Prediction updates (real-time streaming recognized words)
                if (data.type === "prediction" || data.word || data.predicted_word || data.sentence_so_far) {
                    const newWord = data.word || data.predicted_word;
                    
                    if (data.sentence_so_far && typeof data.sentence_so_far === "string" && data.sentence_so_far.trim() !== "") {
                        const words = data.sentence_so_far.split(" ").filter((w: string) => w.trim() !== "");
                        setDetectedGlosses(words);
                    } else if (newWord && typeof newWord === "string") {
                        setDetectedGlosses((prev) => {
                            if (prev.length > 0 && prev[prev.length - 1] === newWord) return prev;
                            return [...prev, newWord];
                        });
                    }
                }

                // 2. Translation summary on session stop
                if (data.type === "translation" || (data.words && Array.isArray(data.words)) || data.text) {
                    console.log("[useSignStream] Final translation received from WS server:", data);
                    const finalWords = Array.isArray(data.words) && data.words.length > 0
                        ? data.words
                        : (data.text ? data.text.split(" ") : []);
                    
                    const wordsToSynthesize = finalWords.length > 0 ? finalWords : detectedGlossesRef.current;
                    if (finalWords.length > 0) {
                        setDetectedGlosses(finalWords);
                    }
                    void synthesizeSentence(wordsToSynthesize);
                    ws.close();
                }

                // 3. Server error handling
                if (data.type === "error" || data.error || data.message) {
                    if (data.type === "error" || data.error) {
                        console.error("[useSignStream] WebSocket server reported error:", data.message || data.error);
                        setErrorMessage(data.message || data.error);
                    }
                }
            } catch (e) {
                console.error("[useSignStream] Error parsing WS message:", e, "Raw data:", event.data);
            }
        };

        ws.onerror = (event) => {
            console.error("[useSignStream] WebSocket connection error event:", event);
            setErrorMessage("Connection to Sign Language API failed.");
            setTranslationState("ERROR");
        };

        ws.onclose = (event) => {
            console.log("[useSignStream] WebSocket closed with code:", event.code, "reason:", event.reason);
            if (animFrameIdRef.current) {
                cancelAnimationFrame(animFrameIdRef.current);
                animFrameIdRef.current = null;
            }
            if (canvas) {
                const ctx = canvas.getContext("2d");
                ctx?.clearRect(0, 0, canvas.width, canvas.height);
            }
            setTranslationState((prev) => (prev === "ERROR" ? "ERROR" : "IDLE"));
        };
    }, [getMediaPipe, getNormalizer]);

    // Clean up animation frame and sockets on unmount
    useEffect(() => {
        return () => {
            if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
            if (wsRef.current) wsRef.current.close();
            if (mediaPipeRef.current) mediaPipeRef.current.close();
        };
    }, []);

    return {
        translationState,
        detectedGlosses,
        recognizedEnglish,
        isSynthesizing,
        errorMessage,
        startTranslation,
        stopTranslation
    };
}
