export interface QuizOption {
    id: number;
    name: string;
    image_url?: string;
}

export interface BaseQuestion {
    q_no: number;
    type: "image_mcq" | "sign_mcq" | string;
    correct_id: number;
    options: QuizOption[];
}

export interface ImageMCQQuestion extends BaseQuestion {
    type: "image_mcq";
    q_text: string;
}

export interface SignMCQQuestion extends BaseQuestion {
    type: "sign_mcq";
    question_image: string;
}

export type QuizQuestion = ImageMCQQuestion | SignMCQQuestion;
