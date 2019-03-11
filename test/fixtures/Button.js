import React from 'react'
import PropTypes from 'prop-types'

const Button = ({ className }) => <button className="btn">.btn</button>

Button.displayName = 'Button'
Button.propTypes = {
  className: PropTypes.string,
}
Button.defaultProps = {
  className: undefined,
}

export default Button
