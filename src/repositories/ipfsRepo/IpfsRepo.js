import ipfsAPI from 'ipfs-api'
import promisify from 'js-promisify'

export default ({
  host = 'ipfs.infura.io',
  protocol = 'https'
} = {}) => {

  const ipfs = ipfsAPI({
    host: 'ipfs.infura.io',
    protocol: 'https'
  })

  // Just convinient for quick tests
  window.app = {
    ...window.app, 
    _ipfs: ipfs
  }

  return {
    getId: () => promisify(ipfs.id, []),
    add: (data, options) => promisify(ipfs.add, [ data, options ]),
    cat: (ipfsHash, options) => promisify(ipfs.cat, [ ipfsHash, options || {} ])
  }
}
