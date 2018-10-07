import React from 'react'
import PropTypes from 'prop-types'
import ethPooling from '../util/ethPooling'

class Loading extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      networkName: null
    }
  }

  componentDidMount () {
    ethPooling.onNetworkChange(networkId => {

      let networkName
      switch (networkId) {
        case 4:
          networkName = 'rinkeby'
          break;
        case 42:
          networkName = 'kovan'
          break;
        case 3:
          networkName = 'ropsten'
          break;

        default:
          networkName = null
          break;
      }

      this.setState({
        networkName
      })
    })
  }

  render () {
    const networkName = this.state.networkName
    if (networkName) {
      return (
        <a 
          className="details"
          target="_blank"
          rel="noopener noreferrer" 
          href={ 'https://' + networkName + '.etherscan.io/tx/' + this.props.tx }>
            { this.props.message || 'Check transaction on Etherscan' }
        </a>
      )
    } else {
      return null
    }
  }
}

Loading.defaultProps = {
  // message: 'Cargando'
}

Loading.propTypes = {
  message: PropTypes.string,
  tx: PropTypes.string
}

export default Loading