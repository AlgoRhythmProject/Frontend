export type Difficulty = 0 | 1 | 2;

export const DifficultyLabel: Record<Difficulty, string> = {
    0: "Easy",
    1: "Medium",
    2: "Hard",
};

export const DifficultyColor: Record<Difficulty, string> = {
    0: "bg-success",
    1: "bg-warning",
    2: "bg-error"
};
