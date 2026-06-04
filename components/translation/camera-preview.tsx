"use client"

import * as React from "react"

// Hand landmark connection indices for drawing the skeleton
const HAND_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4],         // Thumb
    [0, 5], [5, 6], [6, 7], [7, 8],         // Index
    [5, 9], [9, 10], [10, 11], [11, 12],     // Middle
    [9, 13], [13, 14], [14, 15], [15, 16],   // Ring
    [13, 17], [17, 18], [18, 19], [19, 20], // Pinky
    [0, 17]                                 // Palm base
]

type CameraPreviewProps = {
    className?: string
    facingMode?: "user" | "environment"
    isActive?: boolean
    onLandmarksReceived?: (landmarks: any) => void
    onWordDetected?: (word: string, confidence: number) => void
    onTranslationStateChange?: (state: "CONNECTING" | "TRANSLATING" | "ERROR" | "IDLE") => void
    onFinalTranslation?: (sentence: string) => void
}

export function CameraPreview({
    className,
    facingMode = "user",
    isActive = false,
    onLandmarksReceived,
    onWordDetected,
    onTranslationStateChange,
    onFinalTranslation
}: CameraPreviewProps) {
    const videoRef = React.useRef<HTMLVideoElement | null>(null)
    const streamRef = React.useRef<MediaStream | null>(null)
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
    const wsRef = React.useRef<WebSocket | null>(null)
    const [cameraError, setCameraError] = React.useState<string | null>(null)

    // Store callbacks in a mutable ref to prevent the connection hook from restarting
    // whenever parent component re-renders and changes inline function references.
    const callbacksRef = React.useRef({
        onLandmarksReceived,
        onWordDetected,
        onTranslationStateChange,
        onFinalTranslation
    })

    React.useEffect(() => {
        callbacksRef.current = {
            onLandmarksReceived,
            onWordDetected,
            onTranslationStateChange,
            onFinalTranslation
        }
    })

    const startCamera = React.useCallback(async () => {
        setCameraError(null)

        try {
            // Stop any existing stream first
            streamRef.current?.getTracks().forEach((t) => t.stop())
            streamRef.current = null

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode },
                audio: false,
            })

            streamRef.current = stream

            if (videoRef.current) {
                videoRef.current.srcObject = stream
                await videoRef.current.play()
            }
        } catch (e) {
            setCameraError(
                e instanceof Error ? e.message : "Failed to access the camera."
            )
        }
    }, [facingMode])

    React.useEffect(() => {
        void startCamera()

        return () => {
            streamRef.current?.getTracks().forEach((t) => t.stop())
            streamRef.current = null
        }
    }, [startCamera])

    // Draw hand skeleton on the overlay canvas
    const drawSkeleton = React.useCallback((landmarks: any) => {
        const canvas = canvasRef.current
        const video = videoRef.current
        if (!canvas || !video) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Sync canvas size to video layout size dynamically
        if (canvas.width !== video.clientWidth || canvas.height !== video.clientHeight) {
            canvas.width = video.clientWidth
            canvas.height = video.clientHeight
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        if (!landmarks) return

        const drawHand = (handPoints: any[], color: string) => {
            if (!handPoints || handPoints.length === 0) return

            // 1. Draw connecting bones
            ctx.strokeStyle = color
            ctx.lineWidth = 4
            ctx.lineCap = "round"
            ctx.beginPath()

            HAND_CONNECTIONS.forEach(([startIdx, endIdx]) => {
                const startPt = handPoints[startIdx]
                const endPt = handPoints[endIdx]
                if (startPt && endPt) {
                    ctx.moveTo((1.0 - startPt.x) * canvas.width, startPt.y * canvas.height)
                    ctx.lineTo((1.0 - endPt.x) * canvas.width, endPt.y * canvas.height)
                }
            })
            ctx.stroke()

            // 2. Draw joint knuckles
            ctx.fillStyle = "#ffffff"
            handPoints.forEach((pt) => {
                ctx.beginPath()
                ctx.arc((1.0 - pt.x) * canvas.width, pt.y * canvas.height, 5, 0, 2 * Math.PI)
                ctx.fill()
                ctx.strokeStyle = color
                ctx.lineWidth = 2
                ctx.stroke()
            })
        }

        // Draw Left Hand (cyan-500)
        if (landmarks.left_hand) {
            drawHand(landmarks.left_hand, "rgba(6, 182, 212, 0.95)")
        }

        // Draw Right Hand (emerald-500)
        if (landmarks.right_hand) {
            drawHand(landmarks.right_hand, "rgba(16, 185, 129, 0.95)")
        }
    }, [])

    // Clean up WebSocket on component unmount
    React.useEffect(() => {
        return () => {
            if (wsRef.current) {
                console.log("[CameraPreview] Unmounting: Closing WebSocket connection...")
                wsRef.current.close()
                wsRef.current = null
            }
        }
    }, [])

    // Manage WebSocket Connection and Video Frame Streaming Loop
    React.useEffect(() => {
        if (!isActive) {
            // If turning off translation, signal stop request to retrieve the LLM sentence output
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                console.log("[CameraPreview] Sending STOP payload to retrieve final translation...")
                wsRef.current.send(JSON.stringify({ type: "stop" }))
            }
            return
        }

        console.log("[CameraPreview] Connecting to Sign Language Recognition WebSocket backend...")
        callbacksRef.current.onTranslationStateChange?.("CONNECTING")

        const ws = new WebSocket("ws://127.0.0.1:8000/ws/translate")
        wsRef.current = ws

        let frameIntervalId: NodeJS.Timeout | null = null

        ws.onopen = () => {
            console.log("[CameraPreview] WebSocket connected cleanly.")
            callbacksRef.current.onTranslationStateChange?.("TRANSLATING")

            // Start sending frames at 150ms intervals (~7 FPS, matching model inputs)
            frameIntervalId = setInterval(() => {
                const video = videoRef.current
                if (video && ws.readyState === WebSocket.OPEN) {
                    if (video.videoWidth === 0 || video.videoHeight === 0) return

                    // Draw to offscreen low-res canvas to save bandwidth/latency
                    const captureCanvas = document.createElement("canvas")
                    captureCanvas.width = 320
                    captureCanvas.height = 240
                    const captureCtx = captureCanvas.getContext("2d")
                    if (captureCtx) {
                        captureCtx.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height)
                        const jpegDataUrl = captureCanvas.toDataURL("image/jpeg", 0.6)
                        
                        ws.send(JSON.stringify({
                            type: "frame",
                            data: jpegDataUrl
                        }))
                    }
                }
            }, 150)
        }

        ws.onmessage = (event) => {
            try {
                const result = JSON.parse(event.data)

                if (result.error || result.message) {
                    console.warn("[CameraPreview] Server message:", result.error || result.message)
                    return
                }

                // If landmarks received, draw the skeleton overlay
                if (result.landmarks) {
                    drawSkeleton(result.landmarks)
                    callbacksRef.current.onLandmarksReceived?.(result.landmarks)
                }

                // If word is recognized, pass it to the parent state
                if (result.predicted_word) {
                    callbacksRef.current.onWordDetected?.(result.predicted_word, result.confidence ?? 1.0)
                }

                // If final translation sentence returned, save and close
                if (result.text) {
                    console.log("[CameraPreview] Received final translation:", result.text)
                    callbacksRef.current.onFinalTranslation?.(result.text)
                    ws.close()
                }
            } catch (err) {
                console.error("[CameraPreview] Error parsing WebSocket message:", err)
            }
        }

        ws.onerror = (err) => {
            console.error("[CameraPreview] WebSocket error:", err)
            callbacksRef.current.onTranslationStateChange?.("ERROR")
        }

        ws.onclose = () => {
            console.log("[CameraPreview] WebSocket closed.")
            
            // Clear any overlays
            const canvas = canvasRef.current
            if (canvas) {
                const ctx = canvas.getContext("2d")
                ctx?.clearRect(0, 0, canvas.width, canvas.height)
            }

            callbacksRef.current.onTranslationStateChange?.("IDLE")
        }

        return () => {
            if (frameIntervalId) clearInterval(frameIntervalId)
            // Note: we do NOT close the WS here if transitioning to inactive,
            // because we want to send the "stop" message and wait for final translation.
            // The WS will be closed in onmessage or on unmount.
        }
    }, [isActive, drawSkeleton])

    return (
        <div className={className}>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted shadow-inner">
                {/* Live Video Preview */}
                <video
                    ref={videoRef}
                    className={[
                        "h-full w-full object-cover",
                        facingMode === "user" ? "-scale-x-100" : "",
                    ].join(" ")}
                    muted
                    playsInline
                    autoPlay
                />

                {/* Hand Skeleton Overlay Canvas */}
                <canvas
                    ref={canvasRef}
                    className={[
                        "absolute inset-0 h-full w-full pointer-events-none object-cover",
                        facingMode === "user" ? "-scale-x-100" : "",
                    ].join(" ")}
                />

                {/* Camera Error Message */}
                {cameraError ? (
                    <div className="absolute inset-0 grid place-items-center p-4 text-center text-sm text-muted-foreground bg-background/80">
                        <div>
                            <div className="font-semibold text-foreground text-base">Camera Access Error</div>
                            <div className="mt-1 max-w-xs mx-auto text-xs">{cameraError}</div>
                            <button
                                type="button"
                                onClick={() => void startCamera()}
                                className="mt-4 rounded-md border bg-background hover:bg-muted px-4 py-2 text-sm font-medium transition"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}