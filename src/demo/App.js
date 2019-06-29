import React, { Component } from 'react';
import '../lib/polyfills'
import Example from '../lib/form-components/select-field';

export default class App extends Component{
  constructor(props) {
    super(props)
    this.state = { value: 'yo' }
  }
  render () {
    return (
      <div>
        <Example
          onChange={(_, value) => this.setState({ value })}
          filterOptions={{indexes: ['value', 'label']}}
          value={this.state.value}
          options={[{value: 'yo', label: 'asdf'}, {value: 'momma', label: 'test'}]}
          name="test"
        />
      </div>
    )
  }

}
