import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'

import Objected from 'helpers/objected'

const emailPattern = '(^$|^[^@\\s;.\\/\\[\\]\\\\]+(\\.[^@\\s;.\\/\\[\\]\\\\]+)*@[^@\\s;.\\/\\[\\]\\\\]+(\\.[^@\\s;.\\/\\[\\]\\\\]+)*\\.[^@\\s;.\\/\\[\\]\\\\]+$)',
      emailRegex = new RegExp(emailPattern),
      phonePattern = '(^$|^04[0-9]{2}\\s*[0-9]{3}\\s*[0-9]{3}|^[2-9][0-9]{2}-?[0-9]{3}-?[0-9]{4}|\\+.{11,})',
      phoneRegex = new RegExp(phonePattern),
      phoneFormat = (val, ctx) => {

        if(/^\+([^1]|$)/.test(val)) {
          val = val.replace(/[^+0-9]/g, '')
        } else {
          val = val.replace(/^\+?1|[^0-9]/g, '')
        }


        if(val.length) {
          switch (true) {
            case /^\+6/.test(val):

              if(val.length > 3) {
                if(ctx && /^\+61\s*0/.test(val) && (ctx._caretPosition || 0 > 3)) ctx._caretPosition = (ctx._caretPosition || 0) - 1

                val = val.slice(0, 3)
                  + ' '
                  + (
                    /^\+61/.test(val)
                      ? phoneFormat(('0' + val.slice(3)).replace(/^0+/, '0')).replace(/^0/, '')
                      : val.slice(3)
                  )
              }
              break;
            case /^\+/.test(val):
              break;
            case /^04/.test(val):
              if(val.length > 7) val = val.slice(0, 7) + ' ' + val.slice(7)
              if(val.length > 4) val = val.slice(0, 4) + ' ' + val.slice(4)
              break;
            case /^0/.test(val):
              if(val.length > 6) val = val.slice(0, 6) + ' ' + val.slice(6)
              if(val.length > 2) val = val.slice(0, 2) + ' ' + val.slice(2)
              break;
            default:
              if(val.length > 6) val = val.slice(0, 6) + '-' + val.slice(6)
              if(val.length > 3) val = val.slice(0, 3) + '-' + val.slice(3)
          }
        }
        return val
      },
      currencyPattern = '^[0-9]+((\\.[0-9]{2})$|$)',
      currencyRegex = new RegExp(currencyPattern),
      currencyFormat = (val) => {
        val = `${val}`.replace(/[^0-9.]/g, '')
        if(/\./.test(val)) {
          val = val.split('.')
          val[1] = `${val[1]}00`.slice(0, 2)
          val = `${val[0] || '0'}.${val[1]}`
        } else {
          val = (val || '0') + '.00'
        }
        return val
      }

function allowedBlank(props, value) {
  return !!(!props.required && (String(value) === ''))
}

export {
  emailPattern,
  emailRegex,
  phonePattern,
  phoneRegex,
  phoneFormat,
  currencyPattern,
  currencyRegex,
  currencyFormat,
}
/**
 * input tag with built in helper functions and easier validation
 */
export default class TextField extends Component {
  /**
   * @type {Array}
   */
  static specialKeys = Object.freeze(["badFormatMessage", "caretIgnore", "onChange", "pattern", "looseCasing", "useEmailFormat", "usePhoneFormat", "usePhoneFormatOnBlur", "useCurrencyFormat", "validator"])

  /**
   * @type {object}
   * @property {String|Element} label - Input Label
   * @property {String} id - Input Id
   * @property {String} name - Input Name
   * @property {Function} onChange - Run on input change
   * @property {String} type - Input type
   * @property {Boolean} uncontrolled - use an uncontrolled input
   * @property {Boolean} useCurrencyFormat - Automagically format money numbers and add pattern checking
   * @property {Boolean} useEmailFormat - Strict Pattern parse email
   * @property {Boolean} usePhoneFormat - Automagically formats phone number and adds pattern checking
   * @property {Boolean} usePhoneFormatOnBlur - Automagically formats phone number and adds pattern checking onBlur
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
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    type: PropTypes.string,
    uncontrolled: PropTypes.bool,
    useCurrencyFormat: PropTypes.bool,
    useEmailFormat: PropTypes.bool,
    usePhoneFormat: PropTypes.bool,
    usePhoneFormatOnBlur: PropTypes.bool,
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
    if(props.useEmailFormat || props.usePhoneFormat || props.useCurrencyFormat) {
      const regexToUse = props.useEmailFormat ? emailRegex : (props.usePhoneFormat ? phoneRegex : currencyRegex),
            badMessage = props.badFormatMessage || (props.useCurrencyFormat ? 'Invalid Amount' : `Invalid ${props.useEmailFormat ? 'Email' : 'Phone'} Format`)

      return {
        pattern: (props.useEmailFormat ? emailPattern : (props.usePhoneFormat ? phonePattern : currencyPattern)),
        validator: (ev) => (allowedBlank(props, ev.target.value) || regexToUse.test(ev.target.value)) ? '' : badMessage
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
  componentDidUpdate ({ value, caretIgnore, usePhoneFormat, useCurrencyFormat, looseCasing }) {
    if(this.refs.input && (this.refs.input.type === 'email')) return;
    if(usePhoneFormat) caretIgnore = String(caretIgnore || '') + (/^\+/.test(String(this.props.value || '')) ? '\\s' : (/^0/.test(String(this.props.value || '')) ? '+\\s' : '+-'))
    if(useCurrencyFormat) caretIgnore = '^0-9.'

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

      try {
        if(str && caretStr) {
          console.log(caretStr)
          let regex = new RegExp(caretStr, 'g'),
              splitReg = new RegExp(str.replace(regex, '').split('').map((v) => v.replace(/\+/, '\\+')).join(`(${caretStr})?`)),
              matches = str.match(regex) || [],
              effectiveString = String((val.match(splitReg) || [])[0]),
              effectiveMatches = (effectiveString.match(regex) || []).length

          index = val.indexOf(effectiveString) + this._caretPosition + (effectiveMatches - matches.length);
        } else {
          index = val.indexOf(str) + this._caretPosition;
        }
      } catch(err) {
        console.log(err)
        index = val.indexOf(str) + this._caretPosition;
      }

      if (index !== -1) {
        this.setSelection(this.refs.input, () => {
          this.refs.input.selectionStart = this.refs.input.selectionEnd = index;
        })
      }
    }
  }

  setSelection(el, func) {
    if(/date|email/.test(String(el.type || ''))) return;

    try {
      const ogType = el.type || 'text',
            needsChange = !(/text|search|password|tel|url/.test(ogType))

      if(needsChange) el.type = 'text'
      func(el)
      if(needsChange) el.type = ogType
    } catch(err) {
      console.log(err)

      el.type = this.props.type || 'text'
    }
  }

  /**
   * Set Caret Position where applicable, format phone numbers and call onChange
   * for props
   * @type {Function}
   * @param {event} ev - synthetic change event
   */
  onChange(ev) {

    this.setSelection(ev.target, (el) => {
      this._caretPosition = Number(el.selectionEnd);
    })

    this._rawStr = String(ev.target.value);

    if(this.props.usePhoneFormat) ev.target.value = phoneFormat(ev.target.value, this)

    if(this.props.onChange) this.props.onChange(ev)
    if(this.state.validator) ev.target.setCustomValidity(this.state.validator(ev))
  }

  /**
   * format emails and money on blur since selectionRange is not applicable
   * call props.onBlur if set
   * @type {Function}
   * @param {event} ev - synthetic change event
   */
  onBlur(ev) {
    const value = ev.target.value
    if(this.props.useEmailFormat) {
      ev.target.value = String(value || '').toLowerCase()
      this.onChange(ev)
    } else if(this.props.useCurrencyFormat) {
      ev.target.value = allowedBlank(this.props, value) ? value : currencyFormat(String(value || '0'))
      this.onChange(ev)
    } else if (this.props.usePhoneFormatOnBlur) {
      ev.target.value = phoneFormat(ev.target.value, this)
    }
    //  else if(this.props.usePhoneFormat) {
    //   ev.target.value = phoneFormat(ev.target.value)
    //   this.onChange(ev)
    // }
    if(this.props.onBlur) this.props.onBlur(ev)
  }

  focus = () => this.refs.input && this.refs.input.focus()

  render(){
    const {
      label = '',
      name,
      id = name,
      type = 'text',
      feedback = '',
      value,
      skipExtras = false,
      uncontrolled = false,
      ...props
    } = Objected.filterKeys(this.props, this._specialKeys)

    if(this.state.pattern) props.pattern = this.state.pattern
    if(this.props.useEmailFormat || this.props.useCurrencyFormat || this.props.usePhoneFormatOnBlur) props.onBlur = (ev) => this.onBlur(ev)

    const input = (
      <input
        key={`${id}.input`}
        ref="input"
        name={name}
        id={id}
        type={type}
        onChange={(ev) => this.onChange(ev)}
        {...(uncontrolled ? {} : {value})}
        {...props}
      />
    )

    return skipExtras ? input : (
      <Fragment>
        <label key={`${id}.label`} ref="label" htmlFor={id}>{label}</label>
        { input }
        <small key={`${id}.feedback`} ref="feedback" className="form-control-focused">
          {feedback}
        </small>
      </Fragment>
    )
  }
}
