import web3 from "../web3";
import lottery from "../lottery";
import React, { Component } from "react";

class HelloWorld extends Component {
  constructor(props) {
    super(props);

    this.state = {
      manager: "",
      players: [],
      balance: "",
      value: "",
      message: "",
    };
    this.state.manager = "shaharin";
  }
  // state = {
  //   manager: "",
  // };
  //alternative way without using constructor

  handleValueChange = (event) => {
    event.preventDefault();
    this.setState(
      {
        value: event.target.value,
      },
      () => {
        console.log(event.target.value);
      }
    );
  };

  onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });

    this.setState({ message: "You have been entered!" });
  };

  pickWinner = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    this.setState({ message: "A winner has been picked!" });
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    //we don't need to provide from property inside call as metamask
    //takes care of it but we need to provide it for for send

    const players = await lottery.methods.getPlayers().call();

    const balance = await web3.eth.getBalance(lottery.options.address);
    //here balance is not a number its actually an object
    //it is a number that is wrapped in a library called big number js

    this.setState({ manager: manager, players: players, balance: balance });
  }

  render() {
    return (
      <div>
        <h1>Lottery Contract</h1>
        <p>
          This contract is managed by {this.state.manager}.<br></br> There are
          currently {this.state.players.length} people entered, competing to win{" "}
          {web3.utils.fromWei(this.state.balance, "ether")} ether!
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h2>Want to try your luck?</h2>
          <div>
            <label>Amount of ether to enter: </label>
            <input
              value={this.state.value}
              onChange={this.handleValueChange}
            ></input>
          </div>
          <button>Enter</button>
        </form>
        <hr />
        <h2>Ready to pick a winner?</h2>
        <button onClick={this.pickWinner}>Pick a Winner!</button>
        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default HelloWorld;
