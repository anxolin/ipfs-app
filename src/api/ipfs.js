import ipfsAPI from 'ipfs-api'

import promisify from 'js-promisify'
const ipfs = ipfsAPI({
  host: 'ipfs.infura.io',
  protocol: 'https'
})

export default {
  getId: () => promisify(ipfs.id, []),
  add: (data, options) => promisify(ipfs.add, [ data, options ]),
  cat: (ipfsHash, options) => promisify(ipfs.cat, [ ipfsHash, options || {} ])
}
