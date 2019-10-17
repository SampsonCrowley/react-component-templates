import React, { Component } from 'react';
import '../lib/polyfills'
import Example from '../lib/form-components/select-field';

export default class App extends Component{
  constructor(props) {
    super(props)
    this.state = { value: 1, value_2: 2 }
  }
  render () {
    return (
      <div>
        <Example
          onChange={(_, value) => this.setState({ value: value.value })}
          filterOptions={{indexes: ['abbr', 'label'],hotSwap: {
            indexes: ['abbr'],
            length: 1
          }}}
          value={this.state.value}
          valueKey="value"
          options={[{value: 1, abbr: 'yo', label: 'asdf'}, {value: 2, abbr: 'mo', label: 'test'}, {value: 3, abbr: 'UT', label: 'Utah'}]}
          name="state"
          autoComplete="shipping address-level1"
          viewProps={{
            autoComplete: "shipping address-level1"
          }}
        />
        <Example
          onChange={(_, value) => this.setState({ value: value.value })}
          filterOptions={{indexes: ['abbr', 'label'],hotSwap: {
            indexes: ['abbr'],
            length: 1
          }}}
          value={this.state.value}
          valueKey="value"
          options={[{value: 1, abbr: 'yo', label: 'asdf'}, {value: 2, abbr: 'mo', label: 'test'}, {value: 3, abbr: 'UT', label: 'Utah'}]}
          name="state"
          autoComplete="shipping address-level1"
          viewProps={{
            autoComplete: "shipping address-level1"
          }}
        />
        <input type="text" name="street" autoComplete="shipping address-line1"/>
      </div>
    )
  }

}
