import * as React from 'react';
import { observer } from 'mobx-react';
import { deepObserve } from 'mobx-utils';
import { range } from 'lodash';

import { Cell } from './Cell/Cell';
import { GameStatus } from '../../models';
import { MAX_CELLS_COUNT, MIN_STEPS_TO_TRACK_RESULTS } from '../../consts';

import GameStore from '../../stores';
// @ts-ignore
import classes from './App.css';


export interface AppProps {}

@observer
export class App extends React.Component<AppProps> {


    componentDidUpdate(): void {
        if (GameStore.step >= MIN_STEPS_TO_TRACK_RESULTS) {
            deepObserve(
                GameStore.cells,
                () => GameStore.isAnyPlayerWins()
            );
        }
    }

    render() {
        return (
            <div className={classes.app}>
                <div className={classes.board}>
                    {range(0, MAX_CELLS_COUNT).map(cellId => (
                        <Cell
                            key={cellId}
                            cells={GameStore.cells}
                            cellId={cellId}
                            gameStep={GameStore.step}
                            gameStatus={GameStore.status}
                            handleGameStatus={() => GameStore.handleStatus()}
                            setCellSelected={(square, step) => GameStore.setCellSelected(square, step)}
                            setStep={(step) => GameStore.setStep(step)}
                        />
                    ))}
                </div>
                <button
                    className={classes.reset}
                    onClick={() => {
                        if (GameStore.status !== GameStatus.Start || GameStore.step) {
                            GameStore.resetProgress();
                        }
                    }}
                >
                    Начать заново
                </button>
                <p className={classes.message}>
                    {this.endMessage}
                </p>
            </div>
        );
    }

    private get endMessage(): string {
        switch (GameStore.status) {
            case GameStatus.FirstPlayerWin:
                return 'Первый игрок приготовиться! Вы победили!';
            case GameStatus.SecondPlayerWin:
                return 'Второй игрок выиграл! Давид победил Голиафа!';
            case GameStatus.Draw:
                return 'Ничья! Всё.';
            default:
                return '';
        }
    }
}
