import React, {createContext, Component} from 'react'
import {bool, func, shape} from 'prop-types'

export const Menu = {}

Menu.States = {
  checked: true,
  unchecked: false,
}

Menu.DefaultValues = {
  menuOpen: Menu.States.unchecked,
}

Menu.Context = createContext({
  menuState: {...Menu.DefaultValues},
  menuActions: {
    toggleMenu(){},
    closeMenu(){},
    openMenu(){}
  }
})

Menu.Decorator = function withMenuContext(Component) {
  return (props) => (
    <Menu.Context.Consumer>
      {menuProps => <Component {...props} {...menuProps} />}
    </Menu.Context.Consumer>
  )
}

Menu.PropTypes = {
  menuState: shape({
    menuOpen: bool,
  }),
  menuActions: shape({
    toggleMenu: func,
    closeMenu: func,
    openMenu: func
  }).isRequired
}

export default class ReduxMenuProvider extends Component {
  state = {...Menu.DefaultValues}

  render() {
    return (
      <Menu.Context.Provider
        value={{
          menuState: this.state,
          menuActions:{
            /**
             * @returns {void} toggles menu state
             **/
            toggleMenu: () => {
              console.log('TOGGLE MENU')
              this.setState(state => ({
                menuOpen: state.menuOpen === Menu.States.checked
                  ? Menu.States.unchecked
                  : Menu.States.checked
              }))
            },
            /**
             * @returns {void} guarantee closed menu
             **/
            closeMenu: () => {
              console.log('CLOSE MENU')
              this.setState({menuOpen: Menu.States.unchecked})
            },
            /**
             * @returns {void} guarantee open menu
             **/
            openMenu: () => {
              console.log('OPEN MENU')
              this.setState({menuOpen: Menu.States.checked})
            }
          }
        }}
      >
        {this.props.children}
      </Menu.Context.Provider>
    )
  }
}
