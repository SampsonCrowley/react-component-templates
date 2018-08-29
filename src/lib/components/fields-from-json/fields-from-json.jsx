import React, { Component, Fragment } from 'react'

import CardSection from '../../components/card-section'
import DisplayOrLoading from '../../components/display-or-loading'
import Gallery from '../../components/gallery'
import LazyImage from '../../components/lazy-image'
import Link from '../../components/link'
import ModalEditor from '../../components/modal-editor'

import BooleanField from '../../form-components/boolean-field'
import InlineRadioField from '../../form-components/inline-radio-field'
import PasswordField from '../../form-components/password-field'
import SelectField from '../../form-components/select-field'
import TextField from '../../form-components/text-field'

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
    TextField,
  }

  tagNames = () => this.constructor.tagNames

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
    const form = this.props.form
    return fields.map(({
      field,
      name,
      id,
      className,
      ...props
    }, key) => (
      this.renderComponent(field, name ? {
        name: `${form}${name.split('.').map((v) => `[${v}]`).join('')}`,
        key,
        id: id || `${form}_${name.split('.').join('_')}`,
        className: className === undefined ? 'form-control' : className,
        ...props
      } : {
        key,
        id,
        className,
        ...props
      })
    ))
  }

  render() {
    const { form = '', fields = [] } = this.props
    console.log(form, fields)

    return (
      <Fragment>
        {
          this.loopFields(fields)
        }
      </Fragment>
    )
  }
}
