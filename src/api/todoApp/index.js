// API
import TodoAppImpl from './TodoAppImpl'

// Repositories
import hashRepo from '../../repositories/hashRepo'
import ipfsRepo from '../../repositories/ipfsRepo'

const todoApp = TodoAppImpl({
  hashRepo,
  ipfsRepo
})

// Just convinient for quick tests
window.app = {
  ...window.app,
  
  // repos
  hashRepo,
  ipfsRepo,

  // api
  todoApp
}

export default todoApp