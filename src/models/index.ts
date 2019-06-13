export interface CellData {
    id: number;
    pressedBy: Player;
    isPressed: boolean;
}

export enum GameStatus {
    Start = 0,
    FirstPlayerWin = 1,
    SecondPlayerWin = 2,
    Draw = 3
}

export enum Player {
    Nobody = 0,
    First = 1,
    Second = 2
}
