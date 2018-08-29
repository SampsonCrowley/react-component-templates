import React, { Component } from 'react'

export default class CardSection extends Component {
  render() {
    const {
            label = '', className = '', children = '',
            contentProps: cProps = {}, headerProps: hProps = {},
            ...props
          } = this.props,
          { className: headerClassName = '', ...headerProps } = hProps,
          { className: contentClassName = '', ...contentProps } = cProps

    return (
      <section className={`card text-default ${className}`} {...props}>
        <header className={`text-center card-header ${headerClassName}`} {...headerProps}>
          {
            (typeof label === 'string') ? (
              <h3 dangerouslySetInnerHTML={{__html: label}} />
            ) : (
              <h3>
                {label}
              </h3>
            )
          }
        </header>
        <main className={`card-body ${contentClassName}`} {...contentProps}>
          {children}
        </main>
      </section>
    )
  }
}
