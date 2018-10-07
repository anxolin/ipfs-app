import web3 from '../../util/web3'
import ethNetworkUtils from '../../util/ethNetworkUtils'

import multihash from '../../util/multihash'
import abi from './ipfsAppABI.json'

const DEPLOYED_CONTRACT_ADDRESSES = {
  4: '0xF7C8a3A93293de572CbD280F6da15ddB41f6E383'
}
const GAS_UPDATE_IPFS_HASH = 120000

// state
const contractCache = {}
let networkId = null
let contract

function isSupportedNetwork () {
  return !!networkId && !!DEPLOYED_CONTRACT_ADDRESSES[networkId]
}

function setNetworkId (id) {
  // console.log('[HashRepoWeb3] Set network to %s', id)
  if (networkId !== id) {
    networkId = id
    // Check if we have the contract cached
    contract = contractCache[networkId]

    if (!contract) {
      // Instanciate contract for the current network
      contract = _createContract(networkId)
      if (contract) {
        // Add contract to cache
        contractCache[networkId] = contract
      }
    }
  }
}

async function getHash (account) {
  if (!contract) {
    return null
  }

  console.log('[todoAppWeb3:getHash] Get hash for account', account)
  const multihashResult = await contract
    .methods
    .ipfsHashes(account)
    .call()
  
  console.log('[todoAppWeb3:getHash] Multihash returned from smart contract', multihashResult)
  if (multihashResult.size === '0') {
    console.log('[todoAppWeb3:getHash] No hash stored for the address')
    return null
  } else {          
    const ipfsHash = multihash.getMultihashFromBytes32(multihashResult)
    console.log('[todoAppWeb3:getHash] Hash ipfsHash', ipfsHash)

    return ipfsHash
  }
}

async function getVersion (account) {
  if (!contract) {
    return null
  }

  // console.log('[todoAppWeb3:getVersion] Get version for user ', account)
  const version = await contract
    .methods
    .versions(account)
    .call()

  console.log('[todoAppWeb3:getVersion] Version returned from smart contract: %s', version)
  return parseInt(version, 10)
}

async function saveHash ({ hash, version, onTransactionHash, onError, account }) {
  console.log('[todoAppWeb3:saveHash] Updating hash to %s', hash)
  const {
    hashFunction,
    size,
    hash : newHash
  } = multihash.getBytes32FromMultiash(hash)

  const params = [ hashFunction, size, newHash, version ]
  console.log('[todoAppWeb3:saveHash] updateIpfsHash (%s)', params.join(', '))
  const saveTxPromise = contract
    .methods
    .updateIpfsHash(...params)
    .send({
      from: account,
      gas: GAS_UPDATE_IPFS_HASH
    })

  if (onTransactionHash) {
    saveTxPromise.on('transactionHash', onTransactionHash)
  }

  if (onError) {
    saveTxPromise.on('error', onError)
  }

  const saveTx = await saveTxPromise
  console.log('[saveHashEthereum] The transaction %s has been mined', saveTx.transactionHash, saveTx)
  return {
    tx: saveTx,
    version: version + 1
  }
}


function _createContract (networkId) {
  const address = DEPLOYED_CONTRACT_ADDRESSES[networkId]
  if (address) {
    return new web3.eth.Contract(abi, address)
  } else {
    return null
  }
}

ethNetworkUtils.onNetworkChange(setNetworkId)

export default () => ({
  isSupportedNetwork,
  getHash,
  getVersion,
  saveHash
})
