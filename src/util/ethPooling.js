import web3 from './web3'

const POOLING_TIME_MS = 500

let networkId
let account
let poolingId
const networkChangeCallbacks = []
const accountChangeCallbacks = []

function getNetworkId () {
  return networkId
}

function getAccount () {
  return account
}

async function onNetworkChange (callback) {
  networkChangeCallbacks.push(callback)

  if (!poolingId) {
    initPooling()
  } else {
    if (networkId) {
      callback(networkId)
    }
  }  
}

async function onAccountChange (callback) {
  accountChangeCallbacks.push(callback)

  if (!poolingId) {
    initPooling()
  } else {
    if (account) {
      callback(account)
    }
  }  
}

async function updateNetwork () {
  const newNetworkId = parseInt(
    await web3.eth.net.getId(),
    10
  )
  if (newNetworkId !== networkId) {
    console.log('[ethPooling] Network updated to %s (old one %s)', newNetworkId, networkId)
    networkId = newNetworkId
    networkChangeCallbacks.forEach(callback => callback(newNetworkId))
  }
}

async function updateAccount () {
  const [ newAccount ] = await web3.eth.getAccounts()

  if (newAccount !== account) {
    console.log('[ethPooling] Account changed to %s (old one %s)', newAccount, account)
    account = newAccount
    accountChangeCallbacks.forEach(callback => callback(account))
  }
}

function initPooling () {
  updateNetwork()
  updateAccount()
  poolingId = setInterval(() => {
    updateNetwork()
    updateAccount()
  }, POOLING_TIME_MS)
}


export default {
  getNetworkId,
  getAccount,
  onNetworkChange,
  onAccountChange
}