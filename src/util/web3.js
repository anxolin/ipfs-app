import Web3 from 'web3'

let web3
if (typeof window.web3 !== 'undefined') {
  web3 = new Web3(window.web3.currentProvider);
} else {
  // Set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io"));
}

// Just convinient for quick tests
window.app = {
  ...window.app, 
  web3
}

export default web3
