import React, { Component, Fragment, Children } from 'react';
import Select from "react-select";
import createFilterOptions from 'helpers/fast-filter'
import { FixedSizeList as List } from "react-window";
import Objected from 'helpers/objected'
import TextField from 'form-components/text-field'

const height = 35;

class ClearIndicator extends Component {
  render() {
    console.log(this.props)

    return (
      <div></div>
    );
  }
}

class MenuList extends Component {
  render() {
    const { options, children, maxHeight, getValue } = this.props;
    const [value] = getValue();
    const initialOffset = options.indexOf(value) * height;
    const childArray = Children.toArray(children)

    return (
      <List
        height={Math.min((childArray.length || 1) * height, maxHeight)}
        itemCount={childArray.length}
        itemSize={height}
        initialScrollOffset={initialOffset}
      >
        {
          ({ index, style }) => <div style={style}>{childArray[index]}</div>
        }
      </List>
    );
  }
}

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

    console.log({
      hotSwap,
      filterOptions,
      fullFilterOptions,
      targetedFilterOptions,
      options: mappedOptions,
      quickFind,
    })

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

  onChange = (value, meta) => {
    console.log(meta)
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

  get valueKey() {
    return (this.props.filterOptions || {}).valueKey || 'value'
  }

  getOptionFromValue(value) {
    if(!this.state.options) return null

    const { autoCompleteValue, options, quickFind } = this.state

    return Object.isPureObject(value)
      ? options[quickFind[`${value[this.valueKey]}`.toUpperCase()]]
      : options[quickFind[`${autoCompleteValue}`.toUpperCase()]] || options[quickFind[`${value}`.toUpperCase()]] || null
  }

  render() {
    const {label = '', name, id = name, feedback = '', value, viewProps = {}, skipExtras = false, ...props} = Objected.filterKeys(this.props, ['autoCompleteKey', 'onChange', 'validator', 'caretIgnore', 'options', 'filterOptions']),
          { autoCompleteValue, clickedState, filterOptions, options } = this.state

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
          value={this.getOptionFromValue(value)}
          options={options}
          selectProps={{
            ...props,
            autoComplete: 'nope'
          }}
          filterOption={filterOptions}
          className='text-dark'
          onInputChange={this.onInputChange}
          onChange={this.onChange}
          onBlur={() => this.setState({clickedState: false})}
          components={{ MenuList }}
          clearable
          isClearable
          isSearchable
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
