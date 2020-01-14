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
      hotSwap: { length: 0 },
      tabSelectsValue: false,
    }
    this.tabFixId = `${Math.random()}.${+(new Date())}.tabfix`
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
            ...baseFilterOptions,
            name: 'fullFilterOptions',
          })

    let targetedFilterOptions = Objected.deepClone(baseFilterOptions),
        filterOptions

    if(hotSwap.length && hotSwap.indexes) {
      targetedFilterOptions.indexes = hotSwap.indexes
      targetedFilterOptions = createFilterOptions({
        options: mappedOptions,
        ...targetedFilterOptions,
        name: 'targetedFilterOptions',
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

  componentDidUpdate({ options: oldOptions = [], value: oldValue }, { clickedState }){
    const options = this.props.options || [],
          longestLength = (options.length > oldOptions.length ? options.length : oldOptions.length);

    let changed = (options.length !== oldOptions.length);
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
    if(oldValue !== this.props.value) this.findOption(this.props.value)
    // else {
    //   if(this.state.clickedState && !clickedState) {
    //     try {
    //       const val = this.refs.selectField.state.inputValue
    //       this.onInputChange(val || '', { action: 'synthetic' })
    //     } catch(_) {}
    //   }
    // }
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
    console.log(action, this.refs.selectField, this.state.tabSelectsValue)
    if(action === 'select-option') this.refs.selectField && this.refs.selectField.blur()
    this.setState({
      autoCompleteValue: value[this.props.autoCompleteKey || 'label'] || '',
      clickedState: action !== 'select-option',
      filterOptions: this.state.fullFilterOptions,
      tabSelectsValue: this.state.tabSelectsValue && (action !== 'select-option')
    }, () => {
      this.setState({
        clickedState: action !== 'select-option',
        tabSelectsValue: this.state.tabSelectsValue && (action !== 'select-option')
      }, this.afterValueChange)
    })
    this.props.onChange(false, value)
  }

  onInputChange = (value, { action }) => {
    // console.log(value, action)
    if(!this.state.hotSwap.length || /input-change|synthetic/.test(action)) return value

    const isSynthetic = action === 'synthetic'

    const {
      hotSwap = {},
      fullFilterOptions,
      targetedFilterOptions
    } = this.state

    // if(isSynthetic) {
    //   fullFilterOptions.resetFilter()
    //   targetedFilterOptions.resetFilter()
    // }

    this.setState({
      filterOptions: (`${value || ''}`.length > (hotSwap.length || 0)) ? fullFilterOptions : targetedFilterOptions,
      tabSelectsValue: isSynthetic ? !!this.state.tabSelectsValue : (value !== this.state.autoCompleteValue)
    })

    return value
  }

  afterValueChange = () => {
    const value = this.getOptionFromValue(this.state.value) || {}
    const autoCompleteValue = this.state.autoCompleteValue || value[this.props.autoCompleteKey || 'label'] || ''

    this.onInputChange(autoCompleteValue, { action: 'synthetic' })
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
  _onTextBlur   = () => this.findOption(this.state.autoCompleteValue, true, { tabSelectsValue: false })
  _onTextClick  = () => this.setState({ clickedState: true }, this.updateOptions)
  _onSelectBlur = () => this.setState({ clickedState: false, tabSelectsValue: false })
  _onSelectKeyDown = (ev) => {
    if(ev.key === "Tab" || ev.which === 9) {
      console.log(this.tabFixId)
      if(!ev.shiftKey) document.getElementById(this.tabFixId).focus()
    } else if(/Arrow(Down|Up)|Backspace|^[a-zA-Z]$/.test(ev.key) || [38, 40].includes(ev.which)) {
      console.log(ev.key)
      this.setState({ tabSelectsValue: true })
    } else {
      console.log(/Arrow(Down|Up)|^[a-zA-Z]$/.test(ev.key), ev.key, ev.which)
    }
  }

  focus = () => this._onTextClick()

  render() {
    const {label = '', name, id = name, feedback = '', value, viewProps = {}, skipExtras = false, tabSelectsValue: tabSelectsValueProp, keepFiltered = false, ...props} = Objected.filterKeys(this.props, ['autoCompleteKey', 'onChange', 'validator', 'caretIgnore', 'options', 'filterOptions']),
          { autoCompleteValue, clickedState, filterOptions, options } = this.state

    const tabSelectsValue = (typeof tabSelectsValueProp === "undefined") ? this.state.tabSelectsValue : tabSelectsValueProp

    const select = (
      !clickedState ? (
        <TextField
          ref="inputField"
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
          defaultInputValue={(keepFiltered && autoCompleteValue) || undefined}
          tabSelectsValue={!!tabSelectsValue}
          key={`${id}.input.${(filterOptions || {}).filterName || 'default'}`}
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
        <span id={this.tabFixId} tabIndex="0"></span>
      </Fragment>
    )
  }
}
