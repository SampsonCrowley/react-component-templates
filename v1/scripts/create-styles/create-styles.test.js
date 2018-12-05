"use strict";
var test = require('tape-catch');

import AppointmentForm from './appointment-form'

const renderAppointmentForm = () => {
  return ReactTestUtils.createRenderer().render(<AppointmentForm />)
}

test('Render <AppointmentForm />', t => {
  const component = renderAppointmentForm()
  t.ok(component, "<AppointmentForm /> component should exist")

  t.end()
})
