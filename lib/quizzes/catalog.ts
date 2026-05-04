export type Quiz = {
    id: string;
    title: string;
    description: string;
    difficulty?: "Beginner" | "Intermediate" | "Advanced";
};

export const quizCatalog: Quiz[] = [
    {
        id: "quiz-numbers",
        title: "Numbers Basics",
        description: "Recognize and practice signing numbers.",
        difficulty: "Beginner",
    },
    {
        id: "quiz-greetings",
        title: "Greetings",
        description: "Common greetings and introductions.",
        difficulty: "Beginner",
    },
    {
        id: "quiz-common-words",
        title: "Common Words",
        description: "Everyday vocabulary recognition drill.",
        difficulty: "Intermediate",
    },
];