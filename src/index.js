import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button className={props.className} onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i) {

      let  currentClassName = "square";
      if(this.props.lastCell === i) {
        currentClassName += " current";
      }
      if(this.props.winner.winningLine.includes(i)) {
        currentClassName += " winnerSquare";
      }
     
      return (
        <Square
          className={currentClassName}
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
    
        function getIndex(r,c) {            
            return c + 3*(r%3);
        }
          
        return (
            <div>            
              {[...Array(3)].map((x, i) =>
                <div className="board-row" key={"row_" + i}>
                  {[...Array(3)].map((y, j) =>
                    <span 
                        key={"row_" + i + "_col_" + j}>
                        {this.renderSquare(getIndex(i,j))}
                    </span>
                  )}
                </div>
              )}
            </div>
        );     
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [
          {
            squares: Array(9).fill(null)
          }
        ],
        lastCell: null,
        movements: [],
        showAscending: true,
        stepNumber: 0,
        xIsNext: true
      };
    }
  
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const movements = this.state.movements;
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares).winner || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? "X" : "O";
      this.setState({
        history: history.concat([
          {
            squares: squares
          }
        ]),
        lastCell: i,
        movements: movements.concat([calculateMovementBySquare(i)]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      });
    }
  
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0
      });
    }
    
    toggleList() {
        const ascending  = this.state.showAscending;
        this.setState({
            showAscending: !ascending
        });      
    }

    render() {
      const lastCell = this.state.lastCell;    
      const history = this.state.history;
      const movements = this.state.movements;
      const current = history[this.state.stepNumber];
      const ascending = this.state.showAscending;    
      const winner = calculateWinner(current.squares);
  
      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move + movements[move-1] :
          'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });
  
      let status;
      if (winner.winner) {
        status = "Winner: " + winner.winner;
      } else if(this.state.stepNumber === 9) {
        status = 'Result being Draw'
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
  
      return (
        <div className="game">
          <div className="game-board">
            <Board
              lastCell={lastCell}
              squares={current.squares}
              winner={winner}
              onClick={i => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{ascending?moves:moves.reverse()}</ol>
            <button onClick={() => this.toggleList()}>Toggle List</button>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(<Game />, document.getElementById("root"));
  
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
        return {"winner": squares[a], "winningLine": [a, b, c]}
      }
    }
    return {"winner": null, "winningLine": [null, null, null]};
  }

  function calculateMovementBySquare(i) {
    switch(i) {
        case 0:
            return " (1,1)";
        case 1:
            return " (1,2)";
        case 2:
            return " (1,3)";
        case 3:
            return " (2,1)";
        case 4:
            return " (2,2)";
        case 5:
            return " (2,3)";
        case 6:
            return " (3,1)";
        case 7:
            return " (3,2)";
        case 8:
            return " (3,3)";
        default:
            return " (ND)";
    }
}
  