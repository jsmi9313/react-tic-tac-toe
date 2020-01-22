import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function DirectionToggle(props){
  return (
    <button
      className="direction-toggle"
      onClick={props.onClick}
    >
      Switch Order
    </button>
  )
}

function Square(props) {
  return (
    <button 
      className="square"
      onClick={props.onClick}
      style={{backgroundColor: props.bgCol,}}
    >
      {props.value}
    </button>
  )
}

class Board extends React.Component {

  renderSquare(i, bgCol) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        bgCol={this.props.bgCol[i]}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
      sortAsc: true,
    };
  }
  
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const winner = calculateWinner(current.squares);
    // const winner = results[0];
    const gameOver = calculateGameOver(current.squares);

    if (gameOver || winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  handleSortClick(){
    const sortAsc = !this.state.sortAsc
    this.setState({
      sortAsc: sortAsc,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: !(step%2),
    });
  }

  render() {
    let history = this.state.history;
    const current = history[this.state.stepNumber];
    
    const winner = calculateWinner(current.squares);
    // const winner = results[0];
    const gameOver = calculateGameOver(current.squares);

    const moves = history.map((step, move) => {
      let changeLog, moveIdx;
      // Get the index position of the new move
      if (move){ //Make sure not game start
        changeLog = history[move].squares.map((_var, idx) => {return (_var!==history[move-1].squares[idx])})
        moveIdx = changeLog.indexOf(true);
      }
      
      const desc = move ? 
      `Move #${move}: ${move%2 ? 'X' : 'O'} at (${1+Math.floor(moveIdx/3)},${1+(moveIdx%3)})` 
      : 
      `Game Start.`
      return (
        <li 
          key={desc.toLocaleLowerCase().replace(/[^A-Z0-9]/ig, "_")}  
        >
          <button 
            onClick={() => this.jumpTo(move)}
            style={(move==this.state.stepNumber) ? {color: "#FF0000"}: {}}
          >
            {desc}
          </button>
        </li>
      )
    });

    let status;
    let squareColours = Array(9).fill("#FFF");
    if (winner) {
      status = 'Winner: ' + winner[0];
      squareColours = squareColours.map((val, idx)=>{
        if(winner.includes(idx)){return "#ffe873"}
        else {return "#FFF"}});
    } else if (gameOver) {
      status = 'No Winner, Game Over.';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            bgCol={squareColours}
          />

        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.sortAsc ? moves.slice(0).reverse() : moves}</ol>
        </div>
        <DirectionToggle
          onClick={() => this.handleSortClick()}
        />
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
      return [squares[a], ...lines[i]];
    }
  }
  return null;
}

function calculateGameOver(squares) {
  let isFull = squares.every(x=>x!==null);
  return isFull;
}