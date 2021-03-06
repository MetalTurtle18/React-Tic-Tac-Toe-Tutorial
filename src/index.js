import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className={"square" + (props.isWinner ? " winner" : "")} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square key={i} value={this.props.squares[i]}
                       isWinner={this.props.winners && this.props.winners.includes(i)}
                       onClick={() => this.props.onClick(i)}/>;
    }

    render() {
        let board = [];
        for (let i = 0; i < 3; i++) {
            let row = [];
            for (let j = 0; j < 3; j++)
                row.push(this.renderSquare(i * 3 + j));
            board.push(<div key={i} className="board-row">{row}</div>);
        }
        return <div>{board}</div>;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                coords: null,
            }],
            stepNumber: 0,
            xIsNext: true,
            historyReversed: false,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                coords: [i % 3, Math.floor(i / 3)],
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    reverseHistory() {
        this.setState({
            historyReversed: !this.state.historyReversed,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winningSquares = calculateWinner(current.squares);
        const winner = winningSquares ? current.squares[winningSquares[0]] : null;

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + " - (" + step.coords + ")" :
                'Go to game start';
            return (
                <li key={move}>
                    <button className={this.state.stepNumber === move ? "current" : ""}
                            onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if (this.state.stepNumber === 9) {
            status = 'Draw';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} winners={winningSquares} onClick={(i) => this.handleClick(i)}/>
                    <button onClick={() => this.reverseHistory()}>
                        {this.state.historyReversed ? "Show normal" : "Show reversed"}
                    </button>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol reversed={this.state.historyReversed}>{this.state.historyReversed ? moves.reverse() : moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return lines[i];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);