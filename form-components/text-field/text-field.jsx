import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'

import filterKeys from 'helpers/filter-keys'

export default class TextField extends Component {
  /**
   * @type {object}
   * @property {String|Element} label - Input Label
   * @property {String} id - Input Id
   * @property {String} name - Input Name
   * @property {Function} onChange - Run on input change
   * @property {String} type - Input type
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

  constructor(props) {
    if(props.validator instanceof RegExp) {
      const validator = props.validator
      props.pattern = validator
      delete props.validator
    }
    super(props)

    this._rawStr = '';
    this._caretPosition = 0;
  }

  componentDidUpdate ({ value, caretIgnore }) {
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
          this.refs.input.selectionStart = this.refs.input.selectionEnd = index;
        } catch(err) {
          console.log(err)
        }
      }
    }
  }

  onChange(ev) {
    this._rawStr = String(ev.target.value);
    this._caretPosition = Number(ev.target.selectionEnd);

    if(this.props.onChange) this.props.onChange(ev)
    if(this.props.validator) ev.target.setCustomValidity(this.props.validator(ev))
  }

  render(){
    const {label = '', name, id = name, type = 'text', feedback = '', value, ...props} = filterKeys(this.props, ['onChange', 'validator', 'caretIgnore'])
    return (
      <Fragment>
        <label key={id + '.label'} htmlFor={id}>{label}</label>
        <input
          ref="input"
          key={id + '.input'}
          name={name}
          id={id}
          type={type}
          value={value}
          onChange={(ev) => this.onChange(ev)}
          {...props}
        />
        <small key={id + '.feedback'} className="form-control-focused">
          {feedback}
        </small>
      </Fragment>
    )
  }
}
