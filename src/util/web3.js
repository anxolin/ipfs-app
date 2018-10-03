import Web3 from 'web3'
const web3 = new Web3(window.web3.currentProvider)

window.app = window.app || {}
window.app.web3 = web3

export default web3
