import React, { Component, Fragment } from 'react';
import Select from "react-select";
import createFilterOptions from 'helpers/fast-filter'
import Objected from 'helpers/objected'
import TextField from 'form-components/text-field'
import MenuList from 'form-components/menu-list'

const invisibleStyle = { visibility: '', height: 0, width: 0, display: 'block', border: 'none', boxShadow: 0 },
      leftRightPadded = (given) => ({ ...given, padding: `0 ${parseInt(given.padding || 8) || 8}px` }),
      customStyles = {
        clearIndicator: leftRightPadded,
        dropdownIndicator: leftRightPadded,
        control: (given) => ({ ...given, minHeight: null })
      }

export default class SelectField extends Component {
  get hotSwap() {
    return {
      length: 0,
      ...(
        (this.props.filterOptions || {}).hotSwap || {}
      )
    }
  }

  get currentValue(){
    const value = this.props.value
    return (Object.isPureObject(value) ? value.value : value)
  }

  constructor(props) {
    super(props)

    const existed = props.value && props.options && props.options.find(opt => opt[props.autoCompleteKey || 'label'] === props.value || opt.value === props.value || opt.label === props.value)

    this.state = {
      autoCompleteValue: existed ? existed[props.autoCompleteKey || 'label'] : '',
      clickedState: false,
      tabSelectsValue: false
    }
  }

  updateOptions = () => {
    const { options = [] } = this.props,
          mappedOptions = [],
          quickFind = {},
          value = this.currentValue;

    for(let i = 0; i < options.length; i++){
      let option = options[i];

      if(typeof option !== 'object') option = {value: option, label: option}

      mappedOptions.push(option)

      for(let k in option) quickFind[String(option[k] || '').toUpperCase()] = i;
    }

    const baseFilterOptions = Objected.filterKeys(Objected.deepClone(this.props.filterOptions || {}), ['hotSwap']),
          hotSwap = this.hotSwap,
          fullFilterOptions = createFilterOptions({
            ...baseFilterOptions,
            options: mappedOptions,
            name: 'fullFilterOptions'
          })

    let targetedFilterOptions = Objected.deepClone(baseFilterOptions),
        filterOptions

    if(hotSwap.length && hotSwap.indexes) {
      targetedFilterOptions.indexes = hotSwap.indexes
      targetedFilterOptions = createFilterOptions({
        ...targetedFilterOptions,
        options: mappedOptions,
        name: 'targetedFilterOptions'
      })

      filterOptions = (`${this.state.autoCompleteValue || ''}`.length > hotSwap.length) ? fullFilterOptions : targetedFilterOptions
    } else {
      filterOptions = targetedFilterOptions = fullFilterOptions
    }

    this.findOption(value, false, {
      hotSwap,
      filterOptions,
      fullFilterOptions,
      targetedFilterOptions,
      options: mappedOptions,
      quickFind,
    })
  }

  componentDidMount(){
    this._isMounted = true
    this.updateOptions()
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  componentDidUpdate({ options: oldOptions = [], value: oldValue }){
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
    else if(oldValue !== this.props.value) this.findOption(this.props.value, false)
  }

  findOption = (value, clearIfInvalid = false, additionalState = {}) => {
    let autoCompleteValue,
        runChange = false,
        found     = (additionalState.quickFind || this.state.quickFind)[String(value || '').toUpperCase()];

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
    if(action === 'select-option') this.selectField && this.selectField.blur()
    this.setState(
      {
        autoCompleteValue: '',
        clickedState: action !== 'select-option',
        filterOptions: this.state.fullFilterOptions,
        tabSelectsValue: this.state.tabSelectsValue && (action !== 'select-option')
      },
      () =>
        this.setState({
          autoCompleteValue: value[this.props.autoCompleteKey || 'label'] || ''
        }, this.afterValueChange)
    )
    this.props.onChange(false, value)
  }

  onInputChange = (value, { action }) => {
    const hotSwap = this.hotSwap
    if(!hotSwap.length || !(/input-change|synthetic/.test(action))) return value

    const {
      fullFilterOptions,
      targetedFilterOptions
    } = this.state

    this.setState({
      filterOptions: (`${value || ''}`.length > (hotSwap.length || 0)) ? fullFilterOptions : targetedFilterOptions,
      tabSelectsValue: value !== this.state.autoCompleteValue
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

  _onTextKeyDown = (ev) => this.wasTab = ev.key === "Tab" || ev.which === 9
  _onTextKeyUp  = (ev) => this.wasTab ? this.wasTab = false : ((ev.key === "Tab" || ev.which === 9) && this._onTextClick())
  _onTextChange = (ev) => {
    const value = ev.target.value
    this.setState({autoCompleteValue: ''}, () => this.findOption(value, true))
  }
  _onTextBlur   = () => {
    setTimeout(() => this._isMounted && this.findOption(this.state.autoCompleteValue, true, { tabSelectsValue: false }))
  }
  _onTextClick  = () => this.setState({ clickedState: true }, this.updateOptions)
  _onSelectBlur = () => {
    const fromBS = this._backspaceCalled
    this._backspaceCalled = false
    setTimeout(() => {
      if(this._isMounted) {
        const value = this.getOptionFromValue(this.props.value) || {},
              newState = {
                autoCompleteValue: value && value[this.props.autoCompleteKey || 'label']
              }
        if(!fromBS) {
          newState.clickedState = false
          newState.tabSelectsValue = false
        }
        else this.selectField.focus()
        this.setState(newState)
      }
    })
  }
  _onSelectFocus = () => this.setState({ clickedState: true }, this.updateOptions)
  _onSelectKeyDown = (ev) => {
    if(this._backspaceCalled) {
      clearTimeout(this._backspaceCalled)
      this._backspaceCalled = false
    }
    if(ev.key === "Backspace") this._backspaceCalled = setTimeout(() => this._backspaceCalled = false)
    if(ev.key === "Tab" || ev.which === 9) {
      this.setState({ clickedState: false })
      // const input = ev.currentTarget
      const shiftKey = ev.shiftKey
      // if(this.selectField){
        // const value = this.selectField.select.inputRef.value || (this.props.value && this.props.value[this.props.autoCompleteKey || 'label'])
        // value && this.findOption(value, true)
      // }
      if(!shiftKey) this.runFocusAfter()
    } else if(ev.key === "Escape" || ev.which === 27) {
      this.setState({ tabSelectsValue: false }, () => {
        this._onSelectBlur()
        setTimeout(this.runFocusAfter)
      })

    } else if(ev.key === "Enter" || ev.which === 13) {
      this.setState({ autoCompleteValue: this.selectField.select.inputRef.value })
      setTimeout(this.runFocusAfter)
    } else {
      const newState = { autoCompleteValue: this.selectField.select.inputRef.value }
      if(/Arrow(Down|Up)|Backspace|^[a-zA-Z]$/.test(ev.key) || [8, 38, 40].includes(ev.which)) newState.tabSelectsValue = true
      this.setState(newState)
    }
  }

  focus = () => this.selectField && this.selectField.focus()
  runFocusAfter = () => this.focusAfter && this.focusAfter.focus()

  inputFieldRef = (el) => this.inputField = el
  selectFieldRef = (el) => this.selectField = el
  focusAfterRef = (el) => this.focusAfter = el

  render() {
    const {label = '', name, id = name, feedback = '', value, viewProps = {}, skipExtras = false, tabSelectsValue: tabSelectsValueProp, keepFiltered = false, ...props} = Objected.filterKeys(this.props, ['autoCompleteKey', 'onChange', 'validator', 'caretIgnore', 'options', 'filterOptions']),
          { autoCompleteValue, clickedState, filterOptions, options } = this.state,
          tabSelectsValue = !!((typeof tabSelectsValueProp === "undefined") ? this.state.tabSelectsValue : tabSelectsValueProp)

    const select = <Fragment>
      <style>{`input[id^="react-select-"] { opacity: 1 !important; }`}</style>
      <TextField
        ref={this.inputFieldRef}
        key={`${id}.input`}
        name={name}
        id={id}
        value={autoCompleteValue || ''}
        onKeyUp={this._onTextKeyUp}
        onChange={this._onTextChange}
        onBlur={this._onTextBlur}
        // onFocus={this._onTextClick}
        onClick={this._onTextClick}
        skipExtras
        style={invisibleStyle}
        autoComplete={viewProps.autoComplete || 'off'}
        tabIndex={-1}
      />
      <Select
        ref={this.selectFieldRef}
        // menuIsOpen
        menuIsOpen={!!clickedState}
        onClose={this._onSelectClose}
        // {...(
        //   clickedState
        //   ? { defaultInputValue: autoCompleteValue}
        //   : { inputValue: autoCompleteValue }
        // )}
        tabSelectsValue={tabSelectsValue}
        defaultInputValue={(keepFiltered && autoCompleteValue) || undefined}
        key={`${id}.select`}
        id={`${id}.select`}
        value={this.getOptionFromValue(value)}
        options={options}
        selectProps={{
          ...props,
          autoComplete: viewProps.autoComplete || 'nope'
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
        blurInputOnSelect
        onKeyDown={this._onSelectKeyDown}
        styles={customStyles}
      />
    </Fragment>

    return skipExtras ? select : (
      <Fragment>
        <label key={`${id}.label`} htmlFor={id}>{label}</label>
        {
          select
        }
        <small key={`${id}.feedback`} className="form-control-focused">
          {feedback}
        </small>
        <span ref={this.focusAfterRef} tabIndex="0"></span>
      </Fragment>
    )
  }
}
