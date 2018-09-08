import React, { Component, Fragment } from 'react';
import Select from 'react-virtualized-select';
import createFilterOptions from 'react-select-fast-filter-options';
import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'

import filterKeys from 'helpers/filter-keys'

import TextField from 'form-components/text-field'

export default class SelectField extends Component {
  constructor(props) {
    super(props)

    this.state = {
      autoCompleteValue: '',
      clickedState: false
    }
  }

  updateOptions = () => {
    const { options = [] } = this.props,
          mappedOptions = [],
          quickFind = {};

    for(let i = 0; i < options.length; i++){
      let option = options[i];

      if(typeof option !== 'object') option = {value: option, label: option}

      mappedOptions.push(option)

      for(let k in option) quickFind[`${option[k]}`.toUpperCase()] = i;
    }

    const filterOptions = createFilterOptions({
      options: mappedOptions,
      ...this.props.filterOptions
    })
    this.setState({
      filterOptions: filterOptions,
      options: mappedOptions,
      quickFind: quickFind,
    })
  }

  componentDidMount(){
    this.updateOptions()
  }

  componentDidUpdate({ options: oldOptions = [] }){
    const options = this.props.options || [],
          longestLength = (options.length > oldOptions.length ? options.length : oldOptions.length);

    let changed = options.length !== oldOptions.length;
    if(!changed) {
      for(let i = 0; i < longestLength; i++) {
        if(options[i] && typeof options[i] === 'object') {
          if((options[i].value !== oldOptions[i].value) || (options[i].label !== oldOptions[i].label)) {
            changed = true;
          }
        } else {
          if(options[i] !== oldOptions[i]) changed = true
        }

        if(changed) break;
      }
    }

    if(changed) this.updateOptions()
  }

  findOption = (value, clearIfInvalid = false) => {
    let found = this.state.quickFind[`${value}`.toUpperCase()];
    if((found !== null) && (found !== undefined) && (found = this.state.options[found])) {
      this.setState({
        autoCompleteValue: found[this.props.autoCompleteKey || 'label']
      })
      this.props.onChange(false, found)
    } else if (clearIfInvalid) {
      this.setState({
        autoCompleteValue: ''
      })
      this.props.onChange(false, {})
    } else {
      this.setState({
        autoCompleteValue: value || ''
      })
    }
  }

  onChange = (value) => {
    value = value || {}
    this.setState({
      autoCompleteValue: value[this.props.autoCompleteKey || 'label'] || ''
    })
    this.props.onChange(false, value)
  }

  render() {
    const {label = '', name, id = name, feedback = '', value, viewProps = {}, skipExtras = false, ...props} = filterKeys(this.props, ['autoCompleteKey', 'onChange', 'validator', 'caretIgnore', 'options', 'filterOptions'])

    const select = (
      !this.state.clickedState ? (
        <TextField
          key={`${id}.input`}
          name={name}
          id={id}
          value={this.state.autoCompleteValue}
          onKeyUp={(ev) => {if(ev.keyCode === 9) this.setState({clickedState: true})}}
          onChange={(ev) => this.setState({autoCompleteValue: ev.target.value})}
          onBlur={() => this.findOption(this.state.autoCompleteValue, true)}
          onClick={() => this.setState({clickedState: true})}
          skipExtras
          {...viewProps}
        />
      ) : (
        <Select
          autoFocus={this.state.clickedState}
          menuIsOpen
          openOnFocus
          defaultInputValue={this.state.autoCompleteValue}
          key={`${id}.input`}
          name={name}
          id={id}
          value={typeof value === 'object' ? value.value : value}
          options={this.state.options}
          filterOptions={this.state.filterOptions}
          inputProps={{
            ...props,
            autoComplete: 'nope'
          }}
          onChange={this.onChange}
          onBlur={() => this.setState({clickedState: false})}
        />
      )
    )

    return skipExtras ? select : (
      <Fragment>
        <label key={`${id}.label`} htmlFor={id}>{label}</label>
        {
          select
        }
        <small key={`${id}.feedback`} className="form-control-focused">
          {feedback}
        </small>
      </Fragment>
    )
  }
}
