import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

let styleGrabber = window.getComputedStyle(document.documentElement);
let cssStyles = {
  'bgd-main': styleGrabber.getPropertyValue('--bgd-main'),
  'bgd-square': styleGrabber.getPropertyValue('--bgd-square'),
  'txt-square': styleGrabber.getPropertyValue('--txt-square'),
  'bgd-square-win': styleGrabber.getPropertyValue('--bgd-square-win'),
  'txt-square-win': styleGrabber.getPropertyValue('--txt-square-win'),
  'bgd-btn-clicked': styleGrabber.getPropertyValue('--bgd-btn-clicked'),
  'bgd-btn': styleGrabber.getPropertyValue('--bgd-btn'),
}

function DirectionToggle(props){
  return (
    <button
      className="direction-toggle"
      onClick={props.onClick}
      style={props.style}
    >
      {props.sortAsc? "Ascending Order" : "Descending Order"} 
    </button>
  )
}

function HistoryToggle(props){
  return (
    <button
      className="history-toggle"
      onClick={props.onClick}
      style={props.show ? {backgroundColor: cssStyles["bgd-btn-clicked"],} : {}}
    >
      {props.show ? "Hide Moves" : "Show Moves"}
    </button>
  )
}

function RestartToggle(props){
  return (
    <button
      className="restart-toggle"
      onClick={props.onClick}
    >
      New Game
    </button>
  )
}

function Square(props) {
  let row = 1+Math.floor(props.position/3), col=1+(props.position%3);
  return (
    <button 
      className={`square row${row} col${col}`}
      onClick={props.onClick}
      style={{
        backgroundColor: props.bgdCol,
        color: props.txtCol,
      }}
    >
      {props.value}
    </button>
  )
}

class Board extends React.Component {

  renderSquare(idx, bgdCol) {
    return (
      <Square
        value={this.props.squares[idx]}
        onClick={() => this.props.onClick(idx)}
        bgdCol={this.props.bgdCol[idx]}
        txtCol={this.props.txtCol[idx]}
        position = {idx}
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
      showHistory: false,
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

  handleHistoryClick(){
    const showHistory = !this.state.showHistory
    this.setState({
      showHistory: showHistory,
    })
  }

  handleSortClick(){
    const sortAsc = !this.state.sortAsc
    this.setState({
      sortAsc: sortAsc,
    })
  }

  handleRestartClick(){
    this.setState({
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
      // Don't want to edit these.
      // sortAsc: true,
      // showHistory: true,
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
      `${move%2 ? 'X' : 'O'} at (${1+Math.floor(moveIdx/3)},${1+(moveIdx%3)})` 
      : 
      `Game Start.`
      return (
        <li 
          key={desc.toLocaleLowerCase().replace(/[^A-Z0-9]/ig, "_")}  
        >
          <button 
            onClick={() => this.jumpTo(move)}
            style={(move===this.state.stepNumber) ? {color: cssStyles["bgd-btn"]}: {}}
          >
            {desc}
          </button>
        </li>
      )
    });

    let status;
    let squareBgdColours = Array(9).fill(cssStyles["bgd-square"]);
    let squareTxtColours = Array(9).fill(cssStyles["txt-square"]);
    if (winner) {
      status = `${winner[0]} Wins!`;
      squareBgdColours = squareBgdColours.map((val, idx)=>{
        if(winner.includes(idx)){return cssStyles["bgd-square-win"]}
        else {return cssStyles["bgd-square"]}});
      squareTxtColours = squareTxtColours.map((val, idx)=>{
        if(winner.includes(idx)){return cssStyles["txt-square-win"]}
        else {return cssStyles["txt-square"]}});
    } else if (gameOver) {
      status = 'Draw!';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="centering-wrapper">
          <div className="game-board centering-target">
            <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              bgdCol={squareBgdColours}
              txtCol={squareTxtColours}
            />
          </div>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div className="centering-wrapper">
            <div className="centering-target">
              <div className="spacing-wrapper">
                <div className="spacing-target">
                  <RestartToggle
                    onClick={() => this.handleRestartClick()}
                  />
                </div>
                <div className="spacing-target">
                  <HistoryToggle
                    onClick={() => this.handleHistoryClick()}
                    show = {this.state.showHistory}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="history-container">
            <ol style={{display: this.state.showHistory ? "inline-block" : "none",}}>{this.state.sortAsc ? moves.slice(0).reverse() : moves}</ol>
            <div>
              <DirectionToggle
                onClick={() => this.handleSortClick()}
                style={{display: this.state.showHistory ? "inline-block" : "none",}}
                sortAsc={this.state.sortAsc}
              />
            </div>
          </div>
        </div>
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