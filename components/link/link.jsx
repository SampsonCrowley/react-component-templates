import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { Menu } from 'contexts/menu'

class CloserLink extends Component {
  static propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    ...Menu.PropTypes
  }

  render() {
    const {to, children, menuState: _menuState, menuActions: { closeMenu }, ...props} = this.props;
    if(/^(\w+:)?\/\/.*/.test(to)) return <a href={to} {...props}>{children}</a>
    return <Link onClick={closeMenu} to={to} {...props}>{children}</Link>
  }
}

export default Menu.Decorator(CloserLink)
