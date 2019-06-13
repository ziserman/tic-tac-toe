import * as React from 'react';
import classNames from 'classnames';

import { GameStatus, Player, CellData } from '../../../models';
import { MIN_STEPS_TO_TRACK_RESULTS } from '../../../consts';

// @ts-ignore
import classes from './Cell.css';


export interface CellProps {
    cells: Array<CellData>;
    cellId: number;
    gameStep: number;
    gameStatus: GameStatus;
    handleGameStatus: () => void;
    setCellSelected: (squareId: number, step: number) => void;
    setStep: (step: number) => void;
}

export class Cell extends React.Component<CellProps> {
    render() {
        return (
            <button
                className={classNames(classes.cell, {
                    [`${classes.isPressed}`]: this.props.cells[this.props.cellId].isPressed,
                    [`${classes.isDisabled}`]: [
                        GameStatus.FirstPlayerWin, GameStatus.SecondPlayerWin, GameStatus.Draw
                    ].indexOf(this.props.gameStatus) > -1
                })}
                onClick={() => {
                    this.props.setStep(this.props.gameStep + 1);
                    this.props.setCellSelected(this.props.cellId, this.props.gameStep);
                    if (this.props.gameStep >= MIN_STEPS_TO_TRACK_RESULTS) {
                        this.props.handleGameStatus();
                    }
                }}
            >
                {this.isPressedByFirstPlayer && <>&#x274C;</>}
                {this.isPressedBySecondPlayer && <>&#x2B55;</>}
            </button>
        );
    }

    private get isPressedByFirstPlayer(): boolean {
        const { isPressed, pressedBy } = this.props.cells[this.props.cellId];
        return isPressed && pressedBy === Player.First;
    }

    private get isPressedBySecondPlayer(): boolean {
        const { isPressed, pressedBy } = this.props.cells[this.props.cellId];
        return isPressed && pressedBy === Player.Second;
    }

}
