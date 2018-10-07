import Web3 from 'web3'
const web3 = new Web3(window.web3.currentProvider)

// Just convinient for quick tests
window.app = {
  ...window.app, 
  web3
}

export default web3
