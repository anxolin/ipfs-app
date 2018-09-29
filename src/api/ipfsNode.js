import IPFS from 'ipfs'
import promisify from 'js-promisify'

const stringToUse = 'hello world from webpacked IPFS'
let node

async function init () {
  // Check if it's already initialized
  if (node) {
    return node
  }

  // Return promise that will resolve when the node is ready
  let resolved
  return new Promise((resolve, reject) => {
    // Create IPFS node
    node = new IPFS({
      repo: String(Math.random() + Date.now())
    })

    node.once('ready', () => {
      console.log('IPFS node is ready')
      resolved = true
      resolve()
    })
    node.once('error', error => {
      if (!resolved) {
        resolved = true
        reject(error)
      }
    })

    node.on('error', error => {
      if (resolved) {
        console.error('[ipfs] Error: ', error.message)
        console.error(error)
      }
    })
  })
}

export default {
  init,
  getId: () => promisify(node.id, [])
}
