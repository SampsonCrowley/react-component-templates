import React, { Component, Fragment } from 'react'

import CardSection from 'components/card-section'
import DisplayOrLoading from 'components/display-or-loading'
import Gallery from 'components/gallery'
import LazyImage from 'components/lazy-image'
import Link from 'components/link'
import ModalEditor from 'components/modal-editor'

import BooleanField from 'form-components/boolean-field'
import InlineRadioField from 'form-components/inline-radio-field'
import PasswordField from 'form-components/password-field'
import SelectField from 'form-components/select-field'
import TextField from 'form-components/text-field'

export default class FieldsFromJson extends Component {

  static tagNames = {
    BooleanField,
    CardSection,
    DisplayOrLoading,
    Gallery,
    InlineRadioField,
    FieldsFromJson,
    LazyImage,
    Link,
    ModalEditor,
    PasswordField,
    SelectField,
    TextField,
  }

  constructor(props) {
    super(props)
    this.tagNames = this.constructor.tagNames
  }

  renderComponent = (name, { fields, wrapperClass: className, ...props}) => {
    const TagName = this.tagNames[name] || name || 'div'

    const children = [
      fields ? (
        <TagName {...props}>
          {this.loopFields(fields)}
        </TagName>
      ) : <TagName {...props} />
    ]

    return className ? this.renderComponent('div', {
      key: props.key,
      className,
      children
    }) : children[0]
  }

  loopFields = (fields) => {
    const form = this.props.form,
          changeFunction = this.props.onChange,
          confirmationChangeFunction = this.props.onConfirmationChange || changeFunction,
          blurFunction = this.props.onBlur,
          keyUpFunction = this.props.onKeyUp,
          keyDownFunction = this.props.onKeyDown

    return fields.map(({
      field,
      name,
      id,
      className,
      onChange = false,
      onConfirmationChange = false,
      onBlur = false,
      onKeyUp = false,
      onKeyDown = false,
      toggle = false,
      delegatedChange = false,
      formatter = false,
      valueKey = false,
      ...props
    }, key) => {
      const functionalProps = {}
      if(name) {
        if(onBlur) functionalProps['onBlur'] = (ev) => ((blurFunction || onBlur)(ev, name, formatter))
        if(onChange) functionalProps['onChange'] = (ev, value) => {
          if(!ev && value) return ((changeFunction || onChange)(ev, name, valueKey ? value[valueKey] : value))
          if(!(typeof ev === 'object')) return ((changeFunction || onChange)(false, name, ev))
          return ((changeFunction || onChange)(ev, name, formatter))
        }
        if(onConfirmationChange) functionalProps['onConfirmationChange'] = (ev) => ((confirmationChangeFunction || onConfirmationChange)(ev, name.replace('password', 'password_confirmation'), formatter))
        if(onKeyUp) functionalProps['onKeyUp'] = (ev) => ((keyUpFunction || onKeyUp)(ev, name, formatter))
        if(onKeyDown) functionalProps['onKeyDown'] = (ev) => ((keyDownFunction || onKeyDown)(ev, name, formatter))
        if(delegatedChange) functionalProps['onChange'] = changeFunction || onChange
        if(toggle) functionalProps['toggle'] = (ev) => onChange(false, name, !props.value)
      }


      return (
        this.renderComponent(field, name ? {
          name: `${form}${name.split('.').map((v) => `[${v}]`).join('')}`,
          key,
          id: id || `${form}_${name.split('.').join('_')}`,
          className: className === undefined ? 'form-control' : className,
          ...functionalProps,
          ...props
        } : {
          key,
          id,
          className,
          ...props
        })
      )
    })
  }

  render() {
    const { fields = [] } = this.props

    return (
      <Fragment>
        {
          this.loopFields(fields)
        }
      </Fragment>
    )
  }
}
