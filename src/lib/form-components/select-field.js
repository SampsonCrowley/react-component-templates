import React, { Component, Fragment } from 'react';
import Select from 'react-virtualized-select';
import createFilterOptions from 'react-select-fast-filter-options';
import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'

import Objected from 'helpers/objected'

import TextField from 'form-components/text-field'

export default class SelectField extends Component {
  constructor(props) {
    super(props)

    const existed = props.value && props.options && props.options[props.value]

    this.state = {
      autoCompleteValue: existed ? existed[props.autoCompleteKey || 'label'] : '',
      clickedState: false,
      hotSwap: { length: 0 }
    }
  }

  updateOptions = () => {
    const { options = [], value } = this.props,
          mappedOptions = [],
          quickFind = {};

    for(let i = 0; i < options.length; i++){
      let option = options[i];

      if(typeof option !== 'object') option = {value: option, label: option}

      mappedOptions.push(option)

      for(let k in option) quickFind[`${option[k]}`.toUpperCase()] = i;
    }

    const baseFilterOptions = Objected.filterKeys(Objected.deepClone(this.props.filterOptions || {}), ['hotSwap']),
          hotSwap = {length: 0, ...((this.props.filterOptions || {}).hotSwap || {})},
          fullFilterOptions = createFilterOptions({
            options: mappedOptions,
            ...baseFilterOptions
          })

    let targetedFilterOptions = Objected.deepClone(baseFilterOptions),
        filterOptions

    if(hotSwap.length && hotSwap.indexes) {
      targetedFilterOptions.indexes = hotSwap.indexes
      targetedFilterOptions = createFilterOptions({
        options: mappedOptions,
        ...targetedFilterOptions
      })

      filterOptions = (`${this.state.autoCompleteValue || ''}`.length > hotSwap.length) ? fullFilterOptions : targetedFilterOptions
    } else {
      filterOptions = targetedFilterOptions = fullFilterOptions
    }

    this.findOption((Object.isPureObject(value) ? value.value : value), false, {
      hotSwap,
      filterOptions,
      fullFilterOptions,
      targetedFilterOptions,
      options: mappedOptions,
      quickFind,
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
        if(Object.isPureObject(options[i])) {
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

  findOption = (value, clearIfInvalid = false, additionalState = {}) => {
    let found = (additionalState.quickFind || this.state.quickFind)[`${value}`.toUpperCase()];
    if((found !== null) && (found !== undefined) && (found = (additionalState.options || this.state.options)[found])) {
      this.setState({
        ...additionalState,
        autoCompleteValue: found[this.props.autoCompleteKey || 'label']
      })
      this.props.onChange(false, found)
    } else if (clearIfInvalid) {
      this.setState({
        ...additionalState,
        autoCompleteValue: ''
      })
      this.props.onChange(false, {})
    } else {
      this.setState({
        ...additionalState,
        autoCompleteValue: value || this.state.autoCompleteValue || ''
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

  onInputChange = (value) => {
    if(!this.state.hotSwap.length) return value

    const {
      hotSwap = {},
      fullFilterOptions,
      targetedFilterOptions
    } = this.state

    this.setState({
      filterOptions: (`${value || ''}`.length > (hotSwap.length || 0)) ? fullFilterOptions : targetedFilterOptions
    })

    return value
  }

  render() {
    const {label = '', name, id = name, feedback = '', value, viewProps = {}, skipExtras = false, ...props} = Objected.filterKeys(this.props, ['autoCompleteKey', 'onChange', 'validator', 'caretIgnore', 'options', 'filterOptions']),
          { autoCompleteValue, clickedState, filterOptions, options, quickFind } = this.state

    const select = (
      !clickedState ? (
        <TextField
          key={`${id}.input`}
          name={name}
          id={id}
          value={autoCompleteValue}
          onKeyUp={(ev) => {if(ev.keyCode === 9) this.setState({clickedState: true})}}
          onChange={(ev) => this.setState({autoCompleteValue: ev.target.value})}
          onBlur={() => this.findOption(autoCompleteValue, true)}
          onClick={() => this.setState({clickedState: true})}
          skipExtras
          {...viewProps}
        />
      ) : (
        <Select
          autoFocus={clickedState}
          menuIsOpen
          openOnFocus
          defaultInputValue={autoCompleteValue}
          key={`${id}.input`}
          name={name}
          id={id}
          value={Object.isPureObject(value) ? value.value : (options && options[quickFind[`${autoCompleteValue}`]]) || value || ''}
          options={options}
          filterOptions={filterOptions}
          inputProps={{
            ...props,
            autoComplete: 'nope'
          }}
          className='text-dark'
          onInputChange={this.onInputChange}
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
