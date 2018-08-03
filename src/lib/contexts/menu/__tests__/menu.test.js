import React, {Component, createContext} from 'react';
import ReactDOM from 'react-dom';
import MenuRedux, {Menu} from '../menu'



describe('Contexts - Menu', () => {
  describe('Wrapper', () => {
    it("containes an States object with checked and unchecked values", () => {
      expect(Menu.hasOwnProperty('States')).toBe(true)
      expect(Object.keys(Menu.States)).toEqual(['checked', 'unchecked'])
      expect(Menu.States.checked).toBe(true)
      expect(Menu.States.unchecked).toBe(false)
    })

    it('constains both a provider and a consumer', () => {
      expect(Menu.Context.Provider['$$typeof']).toBe(createContext().Provider['$$typeof'])
      expect(Menu.Context.Provider['$$typeof']).toBeTruthy()
      expect(Menu.Context.Consumer['$$typeof']).toBe(createContext().Consumer['$$typeof'])
      expect(Menu.Context.Consumer['$$typeof']).toBeTruthy()
    })

    it('contains a object for default values', () => {
      expect(Menu.hasOwnProperty('DefaultValues')).toBe(true)
      expect(Object.keys(Menu.DefaultValues)).toEqual(['menuOpen'])
    })

    it('contains a High Order Consumer Component', () => {
      class WithContextClass extends Component {
        constructor(props){
          super(props)
          expect(props.hasOwnProperty('menuState')).toBe(true)
          expect(props.hasOwnProperty('menuActions')).toBe(true)
        }
        render(){
          return 'TEST'
        }
      }

      const AssertHasContext = Menu.Decorator(WithContextClass)

      class AssertHasNoContext extends Component {
        constructor(props){
          super(props)
          expect(props.hasOwnProperty('menuState')).toBe(false)
          expect(props.hasOwnProperty('menuActions')).toBe(false)
        }
        render(){
          return 'TEST'
        }
      }

      const div = document.createElement('div')
      ReactDOM.render((
        <MenuRedux>
          <AssertHasContext />
          <AssertHasNoContext />
        </MenuRedux>
      ), div);
      ReactDOM.unmountComponentAtNode(div);

    })
  })

  describe('Consumer', () => {
    it("tracks menuOpen state using Redux principles", () => {
      const div = document.createElement('div')
      ReactDOM.render((
        <Menu.Context.Consumer>
          {
            menuProps => {
              expect(Object.keys(menuProps)).toEqual(['menuState', 'menuActions'])
              expect(Object.keys(menuProps.menuState || {})).toEqual(Object.keys(Menu.DefaultValues))
              for(let k in Menu.DefaultValues){
                if(Menu.DefaultValues.hasOwnProperty(k)) {
                  expect(menuProps.menuState[k]).toBe(Menu.DefaultValues[k])
                }
              }
              return (<span></span>)
            }
          }
        </Menu.Context.Consumer>
      ), div);
      ReactDOM.unmountComponentAtNode(div);
    })
  })

  it('exports proper prop-types to use with HOC', () => {
    expect(Object.keys(Menu.PropTypes)).toEqual(['menuState', 'menuActions'])
  })
})
