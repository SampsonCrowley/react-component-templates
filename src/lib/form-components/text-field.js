import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'

import filterKeys from '../helpers/filter-keys'

const emailPattern = '^[^@\\s;.\\/\\[\\]\\\\]+(\\.[^@\\s;.\\/\\[\\]\\\\]+)*@[^@\\s;.\\/\\[\\]\\\\]+(\\.[^@\\s;.\\/\\[\\]\\\\]+)*\\.[^@\\s;.\\/\\[\\]\\\\]+$',
      emailRegex = new RegExp(emailPattern),
      phonePattern = '^[2-9][0-9]{2}-?[0-9]{3}-?[0-9]{4}',
      phoneRegex = new RegExp(phonePattern),
      phoneFormat = (val) => {
        val = `${val}`.replace(/[^0-9]/g, '')
        if(val.length) {
          if(val.length > 6) val = val.slice(0, 6) + '-' + val.slice(6)
          if(val.length > 3) val = val.slice(0, 3) + '-' + val.slice(3)
        }
        return val
      }

export {
  emailPattern,
  emailRegex,
  phonePattern,
  phoneRegex,
  phoneFormat,
}
/**
 * input tag with built in helper functions and easier validation
 */
export default class TextField extends Component {
  /**
   * @type {Array}
   */
  static specialKeys = Object.freeze(["badFormatMessage", "caretIgnore", "onChange", "pattern", "looseCasing", "useEmailFormat", "usePhoneFormat", "validator"])

  /**
   * @type {object}
   * @property {String|Element} label - Input Label
   * @property {String} id - Input Id
   * @property {String} name - Input Name
   * @property {Function} onChange - Run on input change
   * @property {String} type - Input type
   * @property {Boolean} useEmailFormat - Strict Pattern parse email
   * @property {Boolean} usePhoneFormat - Automagically formats phone number and adds pattern checking
   * @property {String} badFormatMessage - Message to add to tooltip on bad format
   * @property {String|Element} feedback - Feedback to show on Input focus
   * @property {String|Boolean|Number} value - Input value
   * @property {(RegExp|Function)} validator - Validate input aginst regex or function
   */
  static propTypes = {
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node
    ]),
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    type: PropTypes.string,
    useEmailFormat: PropTypes.bool,
    usePhoneFormat: PropTypes.bool,
    badFormatMessage: PropTypes.string,
    looseCasing: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
    feedback: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
      PropTypes.number,
    ]),
    validator: PropTypes.oneOfType([
      PropTypes.instanceOf(RegExp),
      PropTypes.func,
    ])
  }

  /**
   * Get correct pattern and validator on prop change
   * @type {Function}
   * @param {object} props - next props
   * @param {object} prevState - previous state
   */
  static getDerivedStateFromProps(props, prevState) {
    if(props.useEmailFormat || props.usePhoneFormat) {
      const regexToUse = props.useEmailFormat ? emailRegex : phoneRegex,
            badMessage = props.badFormatMessage || `Invalid ${props.useEmailFormat ? 'Email' : 'Phone'} Format`

      return {
        pattern: (props.useEmailFormat ? emailPattern : phonePattern),
        validator: (ev) => regexToUse.test(ev.target.value) ? '' : badMessage
      }
    } else if(props.validator instanceof RegExp) {
      return {
        validator: void(0),
        pattern: props.validator
      }
    } else {
      return {
        validator: props.validator,
        pattern: props.pattern
      }
    }

  }

  constructor(props) {
    super(props)

    this.state = {}

    this._specialKeys = this.constructor.specialKeys
    this._rawStr = '';
    this._caretPosition = 0;
  }

  /**
   * Make sure Caret Position is correct on modified input values
   * @type {Function}
   * @param {object} prevProps - used to check for ignored characters
   */
  componentDidUpdate ({ value, caretIgnore, usePhoneFormat, looseCasing }) {
    if(usePhoneFormat) caretIgnore = '-'

    if (this._caretPosition && (this.props.value !== value)) {
      let str, val, index, caretStr = caretIgnore ? `[${caretIgnore}]` : false

      str = this._rawStr.substr(0, this._caretPosition);
      val = String(this.props.value)

      if(looseCasing) {
        if(typeof looseCasing === 'string') {
          val = val[looseCasing]()
          str = str[looseCasing]()
        } else {
          val = val.toLowerCase()
          str = str.toLowerCase()
        }
      }

      if(caretStr) {
        let regex = new RegExp(caretStr, 'g'),
            splitReg = new RegExp(str.replace(regex, '').split('').join(`(${caretStr})?`)),
            matches = str.match(regex) || [],
            effectiveString = String((val.match(splitReg) || [])[0]),
            effectiveMatches = (effectiveString.match(regex) || []).length

        index = val.indexOf(effectiveString) + this._caretPosition + (effectiveMatches - matches.length);
      } else {
        index = val.indexOf(str) + this._caretPosition;
      }

      if (index !== -1) {
        try {
          const ogType = this.refs.input.type || 'text',
                needsChange = !(/text|search|password|tel|url/.test(ogType))
          if(needsChange) this.refs.input.type = 'text'
          this.refs.input.selectionStart = this.refs.input.selectionEnd = index;
          if(needsChange) this.refs.input.type = ogType
        } catch(err) {
          console.log(err)
        }
      }
    }
  }

  /**
   * Set Caret Position where applicable, format phone numbers and call onChange
   * for props
   * @type {Function}
   * @param {event} ev - synthetic change event
   */
  onChange(ev) {
    this._caretPosition = Number(ev.target.selectionEnd);

    this._rawStr = String(ev.target.value);

    if(this.props.usePhoneFormat) ev.target.value = phoneFormat(ev.target.value)

    if(this.props.onChange) this.props.onChange(ev)
    if(this.state.validator) ev.target.setCustomValidity(this.state.validator(ev))
  }

  /**
   * format emails on blur since selectionRange is not applicable
   * call props.onBlur if set
   * @type {Function}
   * @param {event} ev - synthetic change event
   */
  onBlur(ev) {
    if(this.props.useEmailFormat) {
      ev.target.value = String(ev.target.value || '').toLowerCase()
      this.onChange(ev)
    }
    if(this.props.onBlur) this.props.onBlur(ev)
  }

  render(){
    const {label = '', name, id = name, type = 'text', feedback = '', value, skipExtras = false, ...props} = filterKeys(this.props, this._specialKeys)

    if(this.state.pattern) props.pattern = this.state.pattern
    if(this.props.useEmailFormat) props.onBlur = (ev) => this.onBlur(ev)

    const input = (
      <input
        key={`${id}.input`}
        ref="input"
        name={name}
        id={id}
        type={type}
        value={value}
        onChange={(ev) => this.onChange(ev)}
        {...props}
      />
    )

    return skipExtras ? input : (
      <Fragment>
        <label key={`${id}.label`} htmlFor={id}>{label}</label>
        { input }
        <small key={`${id}.feedback`} className="form-control-focused">
          {feedback}
        </small>
      </Fragment>
    )
  }
}