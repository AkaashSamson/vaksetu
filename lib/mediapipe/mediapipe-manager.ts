import { FilesetResolver, HandLandmarker, FaceLandmarker, PoseLandmarker } from "@mediapipe/tasks-vision";
import { RawFrameLandmarks, Landmark } from "./types";

// Suppress WebAssembly C++ TensorFlow Lite internal delegate info logs from triggering Next.js dev overlay
if (typeof window !== "undefined" && !(window as any).__mediapipe_console_patched) {
    (window as any).__mediapipe_console_patched = true;
    const origError = console.error;
    const origWarn = console.warn;
    const origInfo = console.info;

    const shouldIgnore = (args: any[]) => {
        const msg = args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ");
        return msg.includes("TensorFlow Lite") || msg.includes("XNNPACK delegate") || msg.includes("Created TensorFlow");
    };

    console.error = (...args: any[]) => {
        if (shouldIgnore(args)) return;
        origError.apply(console, args);
    };
    console.warn = (...args: any[]) => {
        if (shouldIgnore(args)) return;
        origWarn.apply(console, args);
    };
    console.info = (...args: any[]) => {
        if (shouldIgnore(args)) return;
        origInfo.apply(console, args);
    };
}

export class MediaPipeManager {
    private handLandmarker: HandLandmarker | null = null;
    private faceLandmarker: FaceLandmarker | null = null;
    private poseLandmarker: PoseLandmarker | null = null;
    private isInitializing = false;
    private isReady = false;
    private lastTimestamp = -1;

    public async initialize(options?: { includePose?: boolean }): Promise<void> {
        if (this.isInitializing) return;

        // If vision is already ready but we need pose and don't have it yet:
        if (this.isReady) {
            if (options?.includePose && !this.poseLandmarker) {
                this.isInitializing = true;
                try {
                    const vision = await FilesetResolver.forVisionTasks(
                        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
                    );
                    this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
                        baseOptions: {
                            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task"
                        },
                        runningMode: "VIDEO"
                    });
                    console.log("[MediaPipeManager] Dynamically loaded Pose Landmarker.");
                } catch (error) {
                    console.error("[MediaPipeManager] Failed to load Pose Landmarker:", error);
                    throw error;
                } finally {
                    this.isInitializing = false;
                }
            }
            return;
        }

        this.isInitializing = true;
        try {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
            );

            // Initialize Hand Landmarker (up to 2 hands)
            this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
                },
                runningMode: "VIDEO",
                numHands: 2
            });

            // Initialize Face Landmarker (1 face for facial relative positioning)
            this.faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
                },
                runningMode: "VIDEO",
                numFaces: 1
            });

            // Dynamically load Pose Landmarker if requested during startup
            if (options?.includePose) {
                this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task"
                    },
                    runningMode: "VIDEO"
                });
                console.log("[MediaPipeManager] Successfully initialized Hand, Face & Pose Landmarkers.");
            } else {
                console.log("[MediaPipeManager] Successfully initialized Hand & Face Landmarkers.");
            }

            this.isReady = true;
            this.lastTimestamp = -1;
        } catch (error) {
            console.error("[MediaPipeManager] Failed to initialize MediaPipe tasks:", error);
            throw error;
        } finally {
            this.isInitializing = false;
        }
    }

    public get ready(): boolean {
        return this.isReady;
    }

    /**
     * Extracts raw landmarks from an active HTMLVideoElement frame.
     */
    public processVideoFrame(video: HTMLVideoElement, timestamp: number): RawFrameLandmarks {
        if (!this.isReady || !this.handLandmarker || !this.faceLandmarker) {
            return { left_hand: null, right_hand: null, face: null, pose: null };
        }

        // Ensure video is active and has decoded frame data ready
        if (video.readyState < 2 || video.paused || video.ended || video.videoWidth === 0 || video.videoHeight === 0) {
            return { left_hand: null, right_hand: null, face: null, pose: null };
        }

        // Ensure timestamp is strictly increasing integer milliseconds for MediaPipe VIDEO mode
        const intTimestamp = Math.round(timestamp);
        const safeTimestamp = intTimestamp > this.lastTimestamp ? intTimestamp : this.lastTimestamp + 1;
        this.lastTimestamp = safeTimestamp;

        let leftHand: Landmark[] | null = null;
        let rightHand: Landmark[] | null = null;
        let faceLandmarks: Landmark[] | null = null;
        let poseLandmarks: Landmark[] | null = null;

        // 1. Process Hand Landmarks
        try {
            const handResults = this.handLandmarker.detectForVideo(video, safeTimestamp);
            if (handResults && handResults.landmarks) {
                for (let i = 0; i < handResults.landmarks.length; i++) {
                    const landmarks = handResults.landmarks[i];
                    const handedness = handResults.handednesses[i]?.[0]?.categoryName;

                    if (handedness === "Left") {
                        leftHand = landmarks;
                    } else if (handedness === "Right") {
                        rightHand = landmarks;
                    } else {
                        if (!leftHand) leftHand = landmarks;
                        else if (!rightHand) rightHand = landmarks;
                    }
                }
            }
        } catch (e) {
            // Suppress frame processing warnings silently
        }

        // 2. Process Face Landmarks
        try {
            const faceResults = this.faceLandmarker.detectForVideo(video, safeTimestamp);
            if (faceResults && faceResults.faceLandmarks && faceResults.faceLandmarks.length > 0) {
                faceLandmarks = faceResults.faceLandmarks[0];
            }
        } catch (e) {
            // Suppress face processing warnings silently
        }

        // 3. Process Pose Landmarks
        if (this.poseLandmarker) {
            try {
                const poseResults = this.poseLandmarker.detectForVideo(video, safeTimestamp);
                if (poseResults && poseResults.landmarks && poseResults.landmarks.length > 0) {
                    poseLandmarks = poseResults.landmarks[0];
                }
            } catch (e) {
                // Suppress pose processing warnings silently
            }
        }

        return {
            left_hand: leftHand,
            right_hand: rightHand,
            face: faceLandmarks,
            pose: poseLandmarks
        };
    }

    /**
     * Cleans up model memory resources.
     */
    public close(): void {
        this.handLandmarker?.close();
        this.faceLandmarker?.close();
        this.poseLandmarker?.close();
        this.handLandmarker = null;
        this.faceLandmarker = null;
        this.poseLandmarker = null;
        this.isReady = false;
        this.lastTimestamp = -1;
    }
}
