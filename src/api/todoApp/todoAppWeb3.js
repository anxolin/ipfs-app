import web3 from '../../util/web3'
import abi from './ipfsApp.json'
const rinkebyAddress = '0xF7C8a3A93293de572CbD280F6da15ddB41f6E383'

const todoApp = new web3.eth.Contract(abi, rinkebyAddress)

window.app = window.app || {}
window.app.todoApp = todoApp

export default todoApp
