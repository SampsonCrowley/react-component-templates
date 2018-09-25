import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'

import Objected from 'helpers/objected'
/**
 * textarea tag with built in helper functions and easier validation
 */
export default class TextField extends Component {
  /**
   * @type {Array}
   */
  static specialKeys = Object.freeze(["badFormatMessage", "caretIgnore", "onChange", "pattern", "validator"])

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
    badFormatMessage: PropTypes.string,
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
    if(props.validator instanceof RegExp) {
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
  }

  /**
   * call onChange for props
   * @type {Function}
   * @param {event} ev - synthetic change event
   */
  onChange(ev) {
    if(this.props.onChange) this.props.onChange(ev)
    if(this.state.validator) ev.target.setCustomValidity(this.state.validator(ev))
  }

  render(){
    const {label = '', name, id = name, feedback = '', value, skipExtras = false, ...props} = Objected.filterKeys(this.props, this._specialKeys)

    if(this.state.pattern) props.pattern = this.state.pattern

    const textArea = (
      <textarea
        key={`${id}.textArea`}
        name={name}
        id={id}
        value={value}
        onChange={(ev) => this.onChange(ev)}
        {...props}
      />
    )

    return skipExtras ? textArea : (
      <Fragment>
        <label key={`${id}.label`} htmlFor={id}>{label}</label>
        { textArea }
        <small key={`${id}.feedback`} className="form-control-focused">
          {feedback}
        </small>
      </Fragment>
    )
  }
}
