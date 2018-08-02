import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'

import filterKeys from 'helpers/filter-keys'

export default class PasswordField extends Component {
  /**
   * @type {object}
   * @property {String|Element} label - Input Label
   * @property {String} id - Input Id
   * @property {String} name - Input Name
   * @property {Function} onChange - Run on input change
   * @property {Boolean} hasConfirmation - whether password needs to be confirmed
   */
  static propTypes = {
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node
    ]),
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    hasConfirmation: PropTypes.bool,
    confirmationValue: PropTypes.string,
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
    this.focusedEl = 'password'
    this.state = {
      mainVisible: false,
      confirmationVisible: false
    }
  }

  componentDidUpdate (props) {
    const valToCheck = this.focusedEl === 'confirmation' ? 'confirmationValue' : 'value'
    if (this.props[valToCheck] !== props[valToCheck]) {
      const str = this._rawStr.substr(0, this._caretPosition),
            index = String(this.props[valToCheck]).indexOf(str) + this._caretPosition;

      if (index !== -1) {
        this.refs[this.focusedEl].selectionStart = this.refs[this.focusedEl].selectionEnd = index;
      }
    }
  }

  onChange(ev, confirmed) {
    this._rawStr = String(ev.target.value);
    this._caretPosition = Number(ev.target.selectionEnd);

    if(confirmed){
      this.focusedEl = 'confirmation';
      if(this.props.onConfirmationChange) this.props.onConfirmationChange(this.refs.confirmation.value)
    } else {
      this.focusedEl = 'password';
      if(this.props.onChange) {
        this.props.onChange(this.refs.password.value)
      }
    }

    if(this.props.hasConfirmation) {
      this.refs.confirmation
      .setCustomValidity(
        this.refs.confirmation.value === this.refs.password.value ?
        '' :
        'Passwords must have one number, an uppercase letter, a lowercase number and a special character'
      )
    }
  }

  render(){
    const {
            label = '',
            name,
            id = name,
            hasConfirmation = false,
            value = '',
            confirmationValue = '',
            ...props
          } = filterKeys(this.props, ['onChange', 'onConfirmationChange']),
          confirmationName = name.replace('password', 'password_confirmation'),
          confirmationId = id.replace('password', 'password_confirmation')


    // TO REQUIRE SPECIAL CHARACTER: pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}'
    
    return (
      <Fragment>
        <label key={id + '.label'} htmlFor={id}>{label}</label>
        <div key={id + '.input'} className='input-group form-group'>
          <input
            key={id + '.input'}
            name={name}
            id={id}
            type={this.state.mainVisible ? 'text' : 'password'}
            value={value}
            onChange={(ev) => this.onChange(ev)}
            onBlur={() => this.setState({})}
            pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}'
            ref='password'
            {...props}
            autoComplete={hasConfirmation ? 'new-password' : 'current-password'}
          />
          <div
            key={id + '.feedback'}
            className="input-group-append clickable"
            onClick={() => this.setState({mainVisible: !this.state.mainVisible})}
          >
            <span className="input-group-text">
              <i className="material-icons">
                {
                  this.state.mainVisible ? 'visibility_off' : 'visibility'
                }
              </i>
            </span>
          </div>
        </div>
        {
          hasConfirmation && (
            <Fragment>
              <label key={confirmationId + '.label'} htmlFor={id}>{label} Confirmation</label>
              <div key={confirmationId + '.input'} className='input-group form-group'>
                <input
                  key={confirmationId + '.input'}
                  name={confirmationName}
                  id={confirmationId}
                  type={this.state.confirmationVisible ? 'text' : 'password'}
                  value={confirmationValue}
                  onChange={(ev) => this.onChange(ev, true)}
                  ref='confirmation'
                  {...props}
                  autoComplete='new-password'
                />
                <div
                  key={confirmationId + '.feedback'}
                  className="input-group-append clickable"
                  onClick={() => this.setState({confirmationVisible: !this.state.confirmationVisible})}
                >
                  <span className="input-group-text">
                    <i className="material-icons">
                      {
                        this.state.confirmationVisible ? 'visibility_off' : 'visibility'
                      }
                    </i>
                  </span>
                </div>
              </div>
              <small key={confirmationId + '.focused-feedback'} className="form-control-focused">
                <ul>
                  <li className={/.{8}/.test(value) ? 'text-success' : 'text-danger'}>
                    8 or more characters
                  </li>
                  <li className={/\d/.test(value) ? 'text-success' : 'text-danger'}>
                    1 or more numbers (0-9)
                  </li>
                  <li className={/[A-Z]/.test(value) ? 'text-success' : 'text-danger'}>
                    1 or more uppercase letters (A-Z)
                  </li>
                  <li className={/[a-z]/.test(value) ? 'text-success' : 'text-danger'}>
                    1 or more lowercase letters (a-z)
                  </li>
                  <li className={/[^A-Za-z0-9]/.test(value) ? 'text-success' : 'text-danger'}>
                    Special characters (not a letter or number) are recommended, but not required.
                  </li>
                  <li className={(value === confirmationValue) ? 'text-success' : 'text-danger'}>
                    Password and Password Confirmation must match
                  </li>
                </ul>
              </small>
            </Fragment>
          )
        }
      </Fragment>
    )
  }
}
