import React, { Component } from 'react'

export default class CardSection extends Component {
  render() {
    const {
            label = '', subLabel = '', className = '', children = '',
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
          { subLabel ? (
            (typeof subLabel === 'string') ? (
              <h5 dangerouslySetInnerHTML={{__html: subLabel}} />
            ) : (
              <h5>
                <i>
                  {subLabel}
                </i>
              </h5>
            )
          ) : '' }
        </header>
        <main className={`card-body ${contentClassName}`} {...contentProps}>
          {children}
        </main>
      </section>
    )
  }
}
