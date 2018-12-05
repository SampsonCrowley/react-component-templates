import React, {createContext, Component} from 'react'
import {shape, string, number} from 'prop-types'

export const ConnectionSpeed = {}

ConnectionSpeed.DefaultValues = {
  downlink: 10,
  downlinkMax: 10,
  effectiveType: '4g',
  rtt: 100,
  type: 'unknown',
}

ConnectionSpeed.Context = createContext({
  connectionSpeedState: {...ConnectionSpeed.DefaultValues},
})

ConnectionSpeed.Decorator = function withConnectionSpeedContext(Component) {
  return (props) => (
    <ConnectionSpeed.Context.Consumer>
      {connectionSpeedProps => <Component {...props} {...connectionSpeedProps} />}
    </ConnectionSpeed.Context.Consumer>
  )
}

ConnectionSpeed.PropTypes = {
  connectionSpeedState: shape({
    downlink: number,
    downlinkMax: number,
    effectiveType: string,
    rtt: number,
    type: string,
  }),
}

var connectionSpeedStateChangeTimeout;

export default class ReduxConnectionSpeedProvider extends Component {
  state = { ...ConnectionSpeed.DefaultValues }

  updateConnection = () => {
    clearTimeout(connectionSpeedStateChangeTimeout);
    connectionSpeedStateChangeTimeout = setTimeout(() => {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

      this.setState({
        type: connection.type || 'unknown',
        effectiveType: connection.effectiveType || '4g',
        downlink: +(connection.downlink || 10),
        downlinkMax: +(connection.downlinkMax || connection.downlink || 10),
        rtt: +(connection.rtt || 100)
      })
    }, 500)
  }

  componentDidMount(){
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if(connection){
      this.updateConnection();
      connection.addEventListener('change', this.updateConnection)
    }
  }

  componentWillUnmount(){
    clearTimeout(connectionSpeedStateChangeTimeout);
  }

  render() {
    return (
      <ConnectionSpeed.Context.Provider
        value={{
          connectionSpeedState: this.state,
        }}
      >
        {this.props.children}
      </ConnectionSpeed.Context.Provider>
    )
  }
}
