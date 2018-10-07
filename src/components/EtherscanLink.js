import React from 'react'
import PropTypes from 'prop-types'
import ethPooling from '../util/ethPooling'
import networkNameById from '../util/networkNameById'

class Loading extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      baseUrl: null
    }
  }

  componentDidMount () {
    ethPooling.onNetworkChange(networkId => {
      const networkName = networkNameById(networkId)
      let baseUrl
      if (networkName === 'mainnet') {
        baseUrl = 'https://etherscan.io/tx/'
      } else {
        baseUrl = 'https://' + networkName + '.etherscan.io/tx/'
      }

      this.setState({
        baseUrl
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