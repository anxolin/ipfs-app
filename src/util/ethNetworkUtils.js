import web3 from './web3'

const POOLING_TIME_MS = 500

let networkId
let poolingId
const networkChangeCallbacks = []

function getNetworkId () {
  return networkId
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

async function updateNetwork () {
  const newNetworkId = parseInt(
    await web3.eth.net.getId(),
    10
  )
  if (newNetworkId !== networkId) {
    console.log('[ethNetworkUtils] Network updated to %s (old one %s)', newNetworkId, networkId)
    networkId = newNetworkId
    networkChangeCallbacks.forEach(callback => callback(newNetworkId))
  }
}

function initPooling () {
  updateNetwork()
  poolingId = setInterval(() => {
    updateNetwork()
  }, POOLING_TIME_MS)
}


export default {
  getNetworkId,
  onNetworkChange
}