function networkNameById (networkId) {
  switch (networkId) {
    case 1:
      return 'mainnet'

    case 4:
      return 'rinkeby'

    case 42:
      return 'kovan'

    case 3:
      return 'ropsten'

    default:
      return null
  }
}
export default networkNameById