import 'polyfills'
import React from 'react'
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom';

import Link from '../link'

describe('Components - Link', () => {
  const div = document.createElement('div');

  const createLink = ({...props}) => {
    ReactDOM.render((
      <Router>
        <Link {...props} />
      </Router>
    ), div);
    return div.querySelector('a')
  }

  it('renders an anchor tag', () => {
    const rendered = createLink({
      to: '/',
      children: 'Test'
    })
    expect(rendered).toBeTruthy()
    expect(rendered.tagName).toBe("A")
    ReactDOM.unmountComponentAtNode(div);
  })

  it('requires a "to" prop', () => {
    const cons = global.console
    global.console = {error: jest.fn()}

    createLink({children: 'Test' })
    expect(console.error).toBeCalled()

    ReactDOM.unmountComponentAtNode(div);
    global.console = cons
  })

  it('sets the "href" prop to "to"', () => {
    expect(createLink({
      to: '/test',
      children: 'Test'
    }).href).toMatch(/http:\/{2}[A-Za-z09\.]+\/test$/)
    ReactDOM.unmountComponentAtNode(div);
  })

  it('accepts mailto links', () => {
    expect(createLink({
      to: 'mailto:mail@mail.com',
      children: 'Test'
    }).href).toMatch(/^mailto/)
    ReactDOM.unmountComponentAtNode(div);
  })

  it('accepts tel links', () => {
    expect(createLink({
      to: 'tel:+17777777777',
      children: 'Test'
    }).href).toMatch(/^tel/)
    ReactDOM.unmountComponentAtNode(div);
  })

  it('accepts global links', () => {
    expect(createLink({
      to: '//test.com',
      children: 'Test'
    }).href).toMatch(/^(https?:)?\/\/test.com/)
    expect(createLink({
      to: 'https://test.com',
      children: 'Test'
    }).href).toMatch(/^https:\/\/test.com/)
    ReactDOM.unmountComponentAtNode(div);
  })

  it('requires children', () => {
    const cons = global.console
    global.console = {error: jest.fn()}

    createLink({to: '/'})
    expect(console.error).toBeCalled()

    ReactDOM.unmountComponentAtNode(div);
    global.console = cons;
  })

  it('renders children', () => {
    expect(createLink({
      to: '/',
      children: 'Test'
    }).innerHTML).toMatch(/^Test$/)
    ReactDOM.unmountComponentAtNode(div);
  })

  it('is snapshotable', () => {
    const tree = renderer
      .create(
        <Router>
          <Link to='/'>Test</Link>
        </Router>
      )
      .toJSON();
    expect(tree).toMatchSnapshot()
  })
})
