import React, { Component, Fragment, Children } from 'react';
import Select from "react-select";
import createFilterOptions from 'helpers/fast-filter'
import { FixedSizeList as List } from "react-window";
import Objected from 'helpers/objected'
import TextField from 'form-components/text-field'

const height = 35;

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

    const existed = props.value && props.options && props.options.find(opt => opt[props.autoCompleteKey || 'label'] === props.value || opt.value === props.value || opt.label === props.value)

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
    else {
      if(this.state.clickedState) {
        // console.log(this.refs.selectField.focus())
      }
    }
  }

  findOption = (value, clearIfInvalid = false, additionalState = {}) => {
    let autoCompleteValue,
        runChange = false,
        found     = (additionalState.quickFind || this.state.quickFind)[`${value}`.toUpperCase()];

    if((found !== null) && (found !== undefined) && (found = (additionalState.options || this.state.options)[found])) {
      autoCompleteValue = found[this.props.autoCompleteKey || 'label']
      runChange = true
    } else if (clearIfInvalid) {
      autoCompleteValue = ''
      runChange = true
      found = {}
    } else {
      autoCompleteValue = value || this.state.autoCompleteValue || ''
    }

    this.setState({
      ...additionalState,
      autoCompleteValue,
    }, this.afterValueChange)
    if(runChange) this.props.onChange(false, found)
  }

  onChange = (value, { action, ...meta }) => {
    value = value || {}
    console.log(action, this.refs.selectField)
    this.refs.selectField && this.refs.selectField.blur()
    this.setState({
      autoCompleteValue: value[this.props.autoCompleteKey || 'label'] || '',
      clickedState: action !== 'select-option',
      filterOptions: this.state.fullFilterOptions,
    }, () => {
      this.setState({
        clickedState: action !== 'select-option',
      }, this.afterValueChange)
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

  afterValueChange = () => {
    const value = this.getOptionFromValue(this.state.value) || {}
    const autoCompleteValue = this.state.autoCompleteValue || value[this.props.autoCompleteKey || 'label'] || ''

    this.onInputChange(autoCompleteValue)
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

  _onTextKeyUp  = (ev) => (ev.keyCode === 9) && this._onTextClick()
  _onTextChange = (ev) => this.setState({ autoCompleteValue: ev.target.value })
  _onTextBlur   = () => this.findOption(this.state.autoCompleteValue, true)
  _onTextClick  = () => this.setState({ clickedState: true }, this.updateOptions)
  _onSelectBlur = () => this.setState({clickedState: false})
  _onSelectKeyDown = (ev) => {
    if(ev.key === "Tab" || ev.which === 9) {
      const direction = ev.shiftKey ? 'previousElementSibling' : 'nextElementSibling'
      const nextSibling = ev.currentTarget[direction] || ev.currentTarget.parentElement[direction],
            ogTabIndex = nextSibling.tabIndex
      if(nextSibling) {
        nextSibling.tabIndex = 0
        nextSibling.focus()
        nextSibling.tabIndex = ogTabIndex
      }
    }
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
          onKeyUp={this._onTextKeyUp}
          onChange={this._onTextChange}
          onBlur={this._onTextBlur}
          onClick={this._onTextClick}
          skipExtras
          {...viewProps}
        />
      ) : (
        <Select
          ref="selectField"
          autoFocus
          menuIsOpen
          onClose={this._onSelectClose}
          // defaultInputValue={autoCompleteValue}
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
          onBlur={this._onSelectBlur}
          onFocus={this._onSelectFocus}
          components={{ MenuList }}
          clearable
          isClearable
          isSearchable
          onKeyDown={this._onSelectKeyDown}
        />
      )
    )

    // const select = (
    //   !clickedState ? (
    //     <TextField
    //       key={`${id}.input`}
    //       name={name}
    //       id={id}
    //       value={autoCompleteValue}
    //       onKeyUp={this._onTextKeyUp}
    //       onChange={this._onTextChange}
    //       onBlur={this._onTextBlur}
    //       onClick={this._onTextClick}
    //       skipExtras
    //       {...viewProps}
    //     />
    //   ) : (
    //     <Select
    //       autoFocus
    //       menuIsOpen
    //       openOnFocus
    //       defaultInputValue={autoCompleteValue}
    //       key={`${id}.input`}
    //       name={name}
    //       id={id}
    //       value={this.getOptionFromValue(value)}
    //       options={options}
    //       selectProps={{
    //         ...props,
    //         autoComplete: 'nope'
    //       }}
    //       filterOption={filterOptions}
    //       className='text-dark'
    //       onInputChange={this.onInputChange}
    //       onChange={this.onChange}
    //       onBlur={this._onSelectBlur}
    //       components={{ MenuList }}
    //       clearable
    //       isClearable
    //       isSearchable
    //     />
    //   )
    // )

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
