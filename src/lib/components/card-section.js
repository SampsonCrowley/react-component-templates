import React, { Component } from 'react'

export default class CardSection extends Component {
  render() {
    const {
            label = '', subLabel = '', className = '', children = '',
            contentProps: cProps = {}, headerProps: hProps = {},
            wrapperRef, headerRef, labelRef, bodyRef,
            ...props
          } = this.props,
          { className: headerClassName = '', ...headerProps } = hProps,
          { className: contentClassName = '', ...contentProps } = cProps

    return (
      <section ref={wrapperRef} className={`card text-default ${className}`} {...props}>
        <header ref={headerRef} className={`text-center card-header ${headerClassName}`} {...headerProps}>
          {
            (typeof label === 'string') ? (
              <h3 dangerouslySetInnerHTML={{__html: label}} ref={labelRef} />
            ) : (
              <h3 ref={labelRef}>
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
        <div ref={bodyRef} className={`card-body ${contentClassName}`} {...contentProps}>
          {children}
        </div>
      </section>
    )
  }
}
