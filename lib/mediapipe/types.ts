export type Landmark = {
    x: number;
    y: number;
    z: number;
    visibility?: number;
};

export type RawFrameLandmarks = {
    left_hand: Landmark[] | null;
    right_hand: Landmark[] | null;
    face: Landmark[] | null;
    pose?: Landmark[] | null;
};

// WebSocket Payload Types (Client -> Server)
export type LandmarksPayload = {
    type: "landmarks";
    schema_version: "1.0";
    feature_dimension: 506;
    sequence_length: 20;
    features: number[]; // 506 floats
    timestamp: number;
};

export type StopPayload = {
    type: "stop";
};

export type ClearPayload = {
    type: "clear";
};

export type ClientWSPayload = LandmarksPayload | StopPayload | ClearPayload;

// WebSocket Response Types (Server -> Client)
export type PredictionResponse = {
    type: "prediction";
    word: string | null;
    confidence: number;
    sentence_so_far: string;
};

export type TranslationResponse = {
    type: "translation";
    text: string;
    words: string[];
};

export type ClearedResponse = {
    type: "cleared";
};

export type ErrorResponse = {
    type: "error";
    message: string;
};

export type ServerWSResponse = PredictionResponse | TranslationResponse | ClearedResponse | ErrorResponse;

export type TranslationState = "IDLE" | "CONNECTING" | "TRANSLATING" | "ERROR";
