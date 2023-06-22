import { useState } from "react";
import {ethers} from 'ethers';
import Token from "./contracts/TestToken.json";

import './App.css';

const tokenAddress = "0x96273AAc53dED55e0cE26E7dd4d834662F163516";

function App() {
  const [userAccount, setUserAccount] = useState('');
  const [amount, setAmount] = useState(ethers.BigNumber.from(0));
  const [balance, setBalance] = useState(0);
  const [currentUser, setCurrentUser] = useState('yourAddress');
  const [transferred, setTransferred] = useState(false);
  const [balanceCall, setBalanceCall] = useState(false);


  async function requestAccount() {
    await window.ethereum.request({method: 'eth_requestAccounts'});
  }

  async function getBalance() {
    if(typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({method: 'eth_requestAccounts'});
      setCurrentUser(account);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
      const balance = await contract.balanceOf(account);
      setBalance((parseInt(balance))/1e18);
      setBalanceCall(true);
      console.log("Balance: ", (parseInt(balance))/1e18);
    }
  }

  async function sendCoins() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      let stringAmount = amount.toString();
      stringAmount = stringAmount + "000000000000000000";
      console.log(stringAmount);
      const transaction = await contract.transfer(userAccount, ethers.BigNumber.from(stringAmount));
      await transaction.wait();
      getBalance();
      setTransferred(true);
      console.log(`${amount} GTT coins successfully sent to ${userAccount}`);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <input onChange = {e => setUserAccount(e.target.value)} placeholder = "Account to transfer to" />
        <input onChange = {e => setAmount(e.target.value)} placeholder = "Enter Amount"/>
        <span>
        <button onClick = {getBalance}>Get Balance</button>
        <button onClick = {sendCoins}>Send Coins</button>
        </span>
        <br/>
        <> 
          {
            balanceCall ? <h2>Balance of {currentUser}: {balance}</h2> : null
          }
        </>
        <>
          {
            transferred ? <h2>Transfer Successful</h2> : null
          } 
        </>
      </header>
    </div>
  );
}

export default App;
