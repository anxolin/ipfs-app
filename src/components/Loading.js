import React from 'react'
import PropTypes from 'prop-types'

class Loading extends React.Component {
  render () {
    return (
      <span className="loading">
        { this.props.message }&nbsp;
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </span>
    )
  }
}

Loading.defaultProps = {
  // message: 'Cargando'
}

Loading.propTypes = {
  message: PropTypes.string
}

export default Loading
