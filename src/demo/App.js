import React, { Component } from 'react';
import '../lib/polyfills'
import Example from '../lib/form-components/select-field';

export default class App extends Component{
  constructor(props) {
    super(props)
    this.state = { value: 1, value_2: 2 }
  }

  testRef = (el) => this.testEl = el

  componentDidMount() {
    this.testEl.focus()
  }

  render () {
    return (
      <div>
        <input type="text" name="street" autoComplete="shipping address-line1"/>
        <input type="text" name="city" autoComplete="shipping address-level2"/>
        <Example
          ref={this.testRef}
          onChange={(_, value) => this.setState({ value: value.value })}
          filterOptions={{
            indexes: ['stuff', 'label'],
            hotSwap: {
              indexes: ['stuff'],
              length: 1
            }
          }}
          value={this.state.value}
          valueKey="value"
          options={[{value: 1, stuff: 'yo', label: 'bbbbbb'}, {value: 2, stuff: 'mo', label: 'aaaaaa'}, {value: 3, stuff: 'tr', label: 'ffffffff'}]}
          name="stuff"
          autoComplete="off"
          viewProps={{
            autoComplete: "off"
          }}
          keepFiltered
        />
        <Example
          onChange={(_, value) => this.setState({ value_2: value.value })}
          filterOptions={{
            indexes: ['abbr', 'label'],
            hotSwap: {
              indexes: ['abbr'],
              length: 1
            }
          }}
          value={this.state.value_2}
          valueKey="value"
          options={[{value: 1, abbr: 'yo', label: 'asdf'}, {value: 2, abbr: 'mo', label: 'test'}, {value: 3, abbr: 'UT', label: 'Utah'}, {value: 4, abbr: 'MT', label: 'Montana'}]}
          name="state"
          autoComplete="shipping address-level1"
          viewProps={{
            autoComplete: "shipping address-level1"
          }}
          tabSelectsValue
        />
        <Example
          onChange={(_, value) => this.setState({ value_2: value.value })}
          filterOptions={{
            indexes: ['abbr', 'label'],
            hotSwap: {
              indexes: ['abbr'],
              length: 1
            }
          }}
          value={this.state.value_2}
          valueKey="value"
          options={[{value: 1, abbr: 'yo', label: 'asdf'}, {value: 2, abbr: 'mo', label: 'test'}, {value: 3, abbr: 'UT', label: 'Utah'}, {value: 4, abbr: 'MT', label: 'Montana'}]}
          name="state"
          viewProps={{
            autoComplete: "shipping address-level1"
          }}
          tabSelectsValue
        />

      </div>
    )
  }

}
