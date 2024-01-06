import React, { useState } from 'react';
import './App.css'; // Make sure to import your CSS file with styling

class RouletteBetting extends React.Component {
  constructor() {
    super();
    this.state = {
      houseBalance: 0,
      bets: [],
      playerWinningsLosses: 0,
      players: {},
      winningNumber: '',
      errorMessage: '',
    };
  }

  setHouseBalance = () => {
    const houseBalance = parseInt(document.getElementById('houseBalanceInput').value);
    this.setState({ houseBalance });
    this.updateDisplays();
  };

  placeBet = (name, option, betAmount) => {
    let numbers;

    switch (option) {
      case 'red':
        numbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
        break;
      // ... (Include other cases for different options)
      default:
        // Assuming direct number input
        numbers = option.split(',').map(num => parseInt(num, 10));
        break;
    }

    betAmount = parseInt(betAmount, 10);
    const newBets = [...this.state.bets, { name, numbers, betAmount }];
    this.setState({ bets: newBets });

    if (!this.state.players[name]) {
      this.setState({ players: { ...this.state.players, [name]: { balance: 0 } } });
    }

    const updatedPlayers = { ...this.state.players };
    updatedPlayers[name].balance -= betAmount; // Deduct from player's balance
    this.setState({ players: updatedPlayers });
  };

  calculateWinnings = () => {
    const winningNum = parseInt(this.state.winningNumber, 10);

    if (isNaN(winningNum) || winningNum < 0 || winningNum > 36) {
      this.setState({ errorMessage: 'Invalid winning number. Please enter a number between 0 and 36.' });
      return;
    }

    this.setState({ errorMessage: '' });

    let totalPayout = 0;
    const winners = [];

    this.state.bets.forEach(bet => {
      const { name, numbers, betAmount } = bet;
      if (numbers.includes(winningNum)) {
        const payoutRatio = this.getPayoutRatio(numbers.length);
        const winnings = betAmount * payoutRatio + betAmount;
        winners.push({ name, winnings });
        totalPayout += winnings;
      }
    });

    const updatedPlayers = { ...this.state.players };
    winners.forEach(winner => {
      updatedPlayers[winner.name].balance += winner.winnings;
    });
    this.setState({ players: updatedPlayers });

    this.setState({
      playerWinningsLosses: this.state.playerWinningsLosses + totalPayout - this.totalBetAmount(),
      houseBalance: this.state.houseBalance + this.totalBetAmount() - totalPayout,
      bets: [],
    });
  };

  totalBetAmount = () => {
    return this.state.bets.reduce((acc, bet) => acc + bet.betAmount, 0);
  };

  getPayoutRatio = numNumbers => {
    switch (numNumbers) {
      case 1:
        return 35;
      case 2:
        return 17;
      case 3:
        return 11;
      case 4:
        return 8;
      default:
        return 0;
    }
  };

  resetTable = () => {
    this.setState({
      houseBalance: 0,
      bets: [],
      playerWinningsLosses: 0,
      players: {},
      errorMessage: '',
    });
  };

  updateDisplays = () => {
    // ... (Existing updates)
  };

  render() {
    return (
      <div className="container">
        <h1>Roulette Betting Game</h1>
        <div className="instructions">
          <p> Enter starting <strong>House Balance</strong></p>
          <p>Enter bets in the format: <strong>player_name bet_option bet_amount</strong>.</p>
          <p>Bet options: red, black, green, 1st, 2nd, 3rd, odd, even, or direct numbers separated by commas.</p>
        </div>
        <label htmlFor="houseBalanceInput">Set House Balance:</label>
        <input type="text" id="houseBalanceInput" placeholder="Enter house balance" />
        <button onClick={this.setHouseBalance}>Set Balance</button>

        <h2>Betting Controls</h2>
        <input type="text" id="betInput" placeholder="Enter bet e.g., lang odd 300" />
        <button onClick={this.placeBet}>Place Bet</button>
        <button onClick={this.clearBets}>Clear Bets</button>
        <h2>Players</h2>
        <div id="playerBalances" className="display-area">
          {Object.entries(this.state.players).map(([playerName, { balance }]) => (
            <div key={playerName}>
              {playerName}: ${balance}
            </div>
          ))}
        </div>

        <h2>House Balance</h2>
        <div id="houseBalanceDisplay" className="display-area">
          {this.state.houseBalance}
        </div>

        <h2>Winning Controls</h2>
        <input type="text" id="winInput" placeholder="Enter winning number e.g., 10" />
        <button onClick={this.calculateWinnings}>Declare Winner</button>

        <h2>Current Bets</h2>
        <div id="currentBets" className="display-area">
          {this.state.bets.map(bet => (
            <div key={bet.name}>
              {bet.name}: {bet.numbers.join(', ')} - ${bet.betAmount}
            </div>
          ))}
        </div>

        <h2>Winning Bets</h2>
        <div id="winningBets" className="display-area">
          {this.state.bets.map(bet => (
            <div key={bet.name}>
              {bet.name} wins ${bet.betAmount}
            </div>
          ))}
        </div>

        <h2>House Profit</h2>
        <div id="houseProfit" className="display-area">
          {this.state.houseProfit}
        </div>

        <button onClick={this.resetTable}>Reset Table</button>
        {this.state.errorMessage && <p style={{ color: 'red' }}>{this.state.errorMessage}</p>}
      </div>
    );
  }
}

export default RouletteBetting;
