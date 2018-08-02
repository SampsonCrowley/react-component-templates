import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Atom from 'load-awesome-react-components/dist/ball/atom'
import 'load-awesome-react-components/dist/ball/atom.css'

export default class DisplayOrLoading extends Component {
  static propTypes = {
    children: PropTypes.node,
    display: PropTypes.bool.isRequired,
    childClassName: PropTypes.string,
    childStyle: PropTypes.object,
    message: PropTypes.string,
    loadingElement: PropTypes.node
  }

  /**
   * Render Display Loading SVG unless complete
   *
   * @returns {ReactElement} markup
   */
  render() {
    const {children: Children, display, childStyle, childClassName, message = 'SUBMITTING...', loadingElement = false} = this.props
    return display ? (
      <Fragment>
        { (childClassName || childStyle) ? <Children className={childClassName} style={childStyle} /> : Children }
      </Fragment>
    ) : (
      <div style={{display: (display ? 'none' : 'block'), width: '100%'}}>
        <h1 className='text-center'>
          {message}
        </h1>
        {
          loadingElement ||
          <Atom
            className='la-vw-sm'
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              color: '#00F',
              zIndex:0
            }}
          />
        }
      </div>
    )
  }
}
