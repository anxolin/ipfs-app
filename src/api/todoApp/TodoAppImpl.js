import assert from 'assert'
/*
* TodoAppImpl: Implements the data persistance for the TodoApp using:
*   - IPFS: To save the JSON data file
*   - Ethereum Smart Contract: To save the hash
*/

export default ({
  hashRepo,
  ipfsRepo
}) => {

  function isSupportedNetwork () {
    return hashRepo.isSupportedNetwork()
  }

  async function getData ({ account }) {
    if (!hashRepo.isSupportedNetwork()) {
      return null
    }

    // Get hash and version
    const [ hash, version ] = await Promise.all([
      hashRepo.getHash(account),
      hashRepo.getVersion(account)
    ])

    // Load JSON
    const data = await _getJsonIpfs(hash)

    return {
      ...data,
      hash,
      version
    }

  }

  async function saveData ({
    account,
    data,
    version,
    onUploadedIpfs,
    onTransactionHash,
    onError
  }) {
    console.log('[api:TodoApp] Save data')

    const hash = await _saveJsonIpfs(data)
    if (onUploadedIpfs) {
      onUploadedIpfs(hash)
    }
    return hashRepo.saveHash({
      account,
      hash,
      version,
      onTransactionHash,
      onError
    })
  }


  async function _getJsonIpfs (hash) {
    assert(hash, 'hash is required')
    console.log(`[api:TodoApp] Load IPFS JSON file ${hash}...`)  
  
    const file = await ipfsRepo.cat(hash)
    const data = JSON.parse(file.toString('utf8'))
    console.log(`[api:TodoApp] Loaded IPFS JSON file:`, data)
    return data
  }
  
  async function _saveJsonIpfs (data) {
    assert(data, 'appData is required')
    console.log(`[api:TodoApp] Saving IPFS JSON file:`, data)  
    const content = Buffer.from(JSON.stringify(data))
    const addResult = await ipfsRepo.add(content)
    const [{ hash }] = addResult
  
    
    console.log(`[api:TodoApp] Saved IPFS JSON file: `, hash)
    return hash
  }
  
  
  return {
    isSupportedNetwork,
    getData,
    saveData
  }
}