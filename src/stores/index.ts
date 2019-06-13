import { action, observable, toJS } from 'mobx';
import { chunk, range } from 'lodash';

import { CellData, GameStatus, Player } from '../models';
import { MAX_CELLS_COUNT } from '../consts';


class GameStore {

    @observable
    status: GameStatus = GameStatus.Start;

    @observable
    step: number = 0;

    @observable
    cells: Array<CellData> = this.cellsInitData;


    private maxStepsCount = MAX_CELLS_COUNT;


    @action
    setStep(step: number): void {
        this.step = step;
    }

    @action
    setCellSelected(cellId: number, step: number): void {
        this.cells[cellId].isPressed = true;

        Boolean((step + 1) % 2)
            ? this.cells[cellId].pressedBy = Player.First
            : this.cells[cellId].pressedBy = Player.Second;
    }

    @action
    setDefaultCellsData(): void {
        this.cells = this.cellsInitData;
    }

    @action
    setStatus(status: GameStatus): void {
        this.status = status;
    }

    @action
    handleStatus(): void {
        const winner = this.isAnyPlayerWins();

        if (winner === Player.First) {
            this.setStatus(GameStatus.FirstPlayerWin);
        }

        if (winner === Player.Second) {
            this.setStatus(GameStatus.SecondPlayerWin);
        }

        if (this.step >= this.maxStepsCount) {
            this.setStatus(GameStatus.Draw);
        }
    }

    @action
    resetProgress(): void {
        this.setStatus(GameStatus.Start);
        this.setDefaultCellsData();
        this.setStep(0);
    }

    @action
    isAnyPlayerWins(): Player {
        const cellsToJsArray = toJS(this.cells);
        const playersStats = chunk(
            Object
                .keys(cellsToJsArray)
                .map(key => cellsToJsArray[key].pressedBy),
            3);

        const player = Boolean(this.step % 2)
            ? Player.First
            : Player.Second;

        const checkRows = playersStats
            .map(row => row.every(i => i === player))
            .some(Boolean);
        const checkCols = playersStats
            .map((col, idx) => (
                playersStats.map(row => row[idx]).every(i => i === player)
            ))
            .some(Boolean);

        const checkTopLeftDiagonal = playersStats
            .reduce((acc, val, idx) => acc.concat((val[idx])), [])
            .every(i => i === player);
        const checkTopRightDiagonal = playersStats
            .slice()
            .reverse()
            .reduce((acc, val, idx) => acc.concat((val[idx])), [])
            .every(i => i === player);

        if (checkRows || checkCols || checkTopLeftDiagonal || checkTopRightDiagonal) {
            return player;
        }
        return Player.Nobody;
    }


    private get cellsInitData(): Array<CellData> {
        return range(0, MAX_CELLS_COUNT).map(cellId => ({
            id: cellId,
            pressedBy: Player.Nobody,
            isPressed: false
        }));
    }
}


export default new GameStore();
