import { Landmark } from "./types";

const HAND_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4],         // Thumb
    [0, 5], [5, 6], [6, 7], [7, 8],         // Index
    [5, 9], [9, 10], [10, 11], [11, 12],     // Middle
    [9, 13], [13, 14], [14, 15], [15, 16],   // Ring
    [13, 17], [17, 18], [18, 19], [19, 20], // Pinky
    [0, 17]                                 // Palm base
];

export function drawSkeletonOverlay(
    canvas: HTMLCanvasElement | null,
    video: HTMLVideoElement | null,
    leftHand: Landmark[] | null,
    rightHand: Landmark[] | null,
    isMirrored = false // Set to false because canvas CSS component already applies `-scale-x-100`
): void {
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (canvas.width !== video.clientWidth || canvas.height !== video.clientHeight) {
        canvas.width = video.clientWidth;
        canvas.height = video.clientHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawHand = (handPoints: Landmark[], color: string) => {
        if (!handPoints || handPoints.length === 0) return;

        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.beginPath();

        HAND_CONNECTIONS.forEach(([startIdx, endIdx]) => {
            const startPt = handPoints[startIdx];
            const endPt = handPoints[endIdx];
            if (startPt && endPt) {
                const startX = isMirrored ? (1.0 - startPt.x) * canvas.width : startPt.x * canvas.width;
                const endX = isMirrored ? (1.0 - endPt.x) * canvas.width : endPt.x * canvas.width;
                ctx.moveTo(startX, startPt.y * canvas.height);
                ctx.lineTo(endX, endPt.y * canvas.height);
            }
        });
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        handPoints.forEach((pt) => {
            const x = isMirrored ? (1.0 - pt.x) * canvas.width : pt.x * canvas.width;
            ctx.beginPath();
            ctx.arc(x, pt.y * canvas.height, 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    };

    if (leftHand) drawHand(leftHand, "rgba(6, 182, 212, 0.95)");  // Cyan
    if (rightHand) drawHand(rightHand, "rgba(16, 185, 129, 0.95)"); // Emerald
}
