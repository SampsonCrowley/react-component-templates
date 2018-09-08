import React, {Component, createContext} from 'react';
import ReactDOM from 'react-dom';
import ConnectionSpeedRedux, {ConnectionSpeed} from '../connection-speed'



describe('Contexts - ConnectionSpeed', () => {
  describe('Wrapper', () => {
    it('constains both a provider and a consumer', () => {
      expect(ConnectionSpeed.Context.Provider['$$typeof']).toBe(createContext().Provider['$$typeof'])
      expect(ConnectionSpeed.Context.Provider['$$typeof']).toBeTruthy()
      expect(ConnectionSpeed.Context.Consumer['$$typeof']).toBe(createContext().Consumer['$$typeof'])
      expect(ConnectionSpeed.Context.Consumer['$$typeof']).toBeTruthy()
    })

    it('contains a object for default values', () => {
      expect(ConnectionSpeed.hasOwnProperty('DefaultValues')).toBe(true)
      expect(Object.keys(ConnectionSpeed.DefaultValues)).toEqual(['downlink', 'downlinkMax', 'effectiveType', 'rtt', 'type'])
    })

    it('contains a High Order Consumer Component', () => {
      class WithContextClass extends Component {
        constructor(props){
          super(props)
          expect(props.hasOwnProperty('connectionSpeedState')).toBe(true)
        }
        render(){
          return 'TEST'
        }
      }

      const AssertHasContext = ConnectionSpeed.Decorator(WithContextClass)

      class AssertHasNoContext extends Component {
        constructor(props){
          super(props)
          expect(props.hasOwnProperty('connectionSpeedState')).toBe(false)
        }
        render(){
          return 'TEST'
        }
      }

      const div = document.createElement('div')
      ReactDOM.render((
        <ConnectionSpeedRedux>
          <AssertHasContext />
          <AssertHasNoContext />
        </ConnectionSpeedRedux>
      ), div);
      ReactDOM.unmountComponentAtNode(div);

    })
  })

  describe('Consumer', () => {
    it("tracks connectionSpeedOpen state using Redux principles", () => {
      const div = document.createElement('div')
      ReactDOM.render((
        <ConnectionSpeed.Context.Consumer>
          {
            connectionSpeedProps => {
              expect(Object.keys(connectionSpeedProps)).toEqual(['connectionSpeedState'])
              expect(Object.keys(connectionSpeedProps.connectionSpeedState || {})).toEqual(Object.keys(ConnectionSpeed.DefaultValues))
              for(let k in ConnectionSpeed.DefaultValues){
                if(ConnectionSpeed.DefaultValues.hasOwnProperty(k)) {
                  expect(connectionSpeedProps.connectionSpeedState[k]).toBe(ConnectionSpeed.DefaultValues[k])
                }
              }
              return (<span></span>)
            }
          }
        </ConnectionSpeed.Context.Consumer>
      ), div);
      ReactDOM.unmountComponentAtNode(div);
    })
  })

  it('exports proper prop-types to use with HOC', () => {
    expect(Object.keys(ConnectionSpeed.PropTypes)).toEqual(['connectionSpeedState'])
  })
})
