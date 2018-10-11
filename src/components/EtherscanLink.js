import React from 'react'
import PropTypes from 'prop-types'
import ethPooling from '../util/ethPooling'
import networkNameById from '../util/networkNameById'

class Loading extends React.Component {
  state = {
    baseUrl: null
  }

  componentDidMount () {
    ethPooling.onNetworkChange(networkId => {
      const networkName = networkNameById(networkId)
      let baseUrl
      if (networkName === 'mainnet') {
        baseUrl = 'https://etherscan.io/tx/'
      } else if (networkName) {
        baseUrl = 'https://' + networkName + '.etherscan.io/tx/'
      } else {
        baseUrl = null
      }

      this.setState({
        baseUrl
      })
    })
  }

  render () {
    const baseUrl = this.state.baseUrl
    if (baseUrl) {
      return (
        <a 
          className="details"
          target="_blank"
          rel="noopener noreferrer" 
          href={ this.state.baseUrl + this.props.tx }>
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