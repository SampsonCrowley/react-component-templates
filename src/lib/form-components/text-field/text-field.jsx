import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'

import filterKeys from '../../helpers/filter-keys'

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

export default class TextField extends Component {
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
    onChange: PropTypes.func,
    type: PropTypes.string,
    useEmailFormat: PropTypes.bool,
    usePhoneFormat: PropTypes.bool,
    badFormatMessage: PropTypes.string,
    feedback: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node
    ]),
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
      PropTypes.number,
    ]),
    validator: PropTypes.oneOfType([
      PropTypes.instanceOf(RegExp),
      PropTypes.func
    ])
  }

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

    this._rawStr = '';
    this._caretPosition = 0;
  }

  componentDidUpdate ({ value, caretIgnore, usePhoneFormat, useEmailFormat }) {
    if(usePhoneFormat) caretIgnore = caretIgnore || '-'

    if (this._caretPosition && (this.props.value !== value)) {
      let str, index, caretStr = caretIgnore ? `[${caretIgnore}]` : false

      str = this._rawStr.substr(0, this._caretPosition);

      if(caretStr) {
        let regex = new RegExp(caretStr, 'g'),
            splitReg = new RegExp(str.replace(regex, '').split('').join(`(${caretStr})?`)),
            matches = str.match(regex) || [],
            effectiveString = String((String(this.props.value).match(splitReg) || [])[0]),
            effectiveMatches = (effectiveString.match(regex) || []).length

        index = String(this.props.value).indexOf(effectiveString) + this._caretPosition + (effectiveMatches - matches.length);
      } else {
        index = String(this.props.value).indexOf(str) + this._caretPosition;
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

  onChange(ev) {
    this._caretPosition = Number(ev.target.selectionEnd);
    if(this.props.useEmailFormat) {
      const newVal = String(ev.target.value || '').toLowerCase()
            // oldVal = String(this.props.value || '').toLowerCase()
      // if(newVal && oldVal) {
      //   if(Math.abs(newVal.length - oldVal.length) === 1) {
      //     for(let i = 0; i < Math.max(newVal.length, oldVal.length); i++){
      //       if(newVal[i] !== oldVal[i]) {
      //         if(i + 1 < newVal.length) {
      //           this._caretPosition = newVal[i] === oldVal[i+1] ? i : i + 1
      //         } else {
      //           this._caretPosition = newVal.length
      //         }
      //         break
      //       }
      //     }
      //   }
      // }
      ev.target.value = newVal
    }

    this._rawStr = String(ev.target.value);

    if(this.props.usePhoneFormat) ev.target.value = phoneFormat(ev.target.value)

    if(this.props.onChange) this.props.onChange(ev)
    if(this.state.validator) ev.target.setCustomValidity(this.state.validator(ev))
  }

  render(){
    const {label = '', name, id = name, type = 'text', feedback = '', value, ...props} = filterKeys(this.props, ['onChange', 'validator', 'caretIgnore', 'useEmailFormat', 'usePhoneFormat', 'badFormatMessage', 'pattern'])

    if(this.state.pattern) props.pattern = this.state.pattern

    return (
      <Fragment>
        <label key={`${id}.label`} htmlFor={id}>{label}</label>
        <input
          ref="input"
          key={`${id}.input`}
          name={name}
          id={id}
          type={type}
          value={value}
          onChange={(ev) => this.onChange(ev)}
          {...props}
        />
        <small key={`${id}.feedback`} className="form-control-focused">
          {feedback}
        </small>
      </Fragment>
    )
  }
}
