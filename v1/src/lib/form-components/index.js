import BooleanField from './boolean-field'
import InlineRadioField from './inline-radio-field'
import PasswordField from './password-field'
import SelectField from './select-field'
import TextAreaField from './text-area-field'
import TextField, {
  emailPattern,
  emailRegex,
  phonePattern,
  phoneRegex,
  phoneFormat,
  currencyPattern,
  currencyRegex,
  currencyFormat
} from './text-field'

export {
  currencyPattern,
  currencyRegex,
  currencyFormat,
  emailPattern,
  emailRegex,
  phonePattern,
  phoneRegex,
  phoneFormat,
  BooleanField,
  InlineRadioField,
  PasswordField,
  SelectField,
  TextAreaField,
  TextField,
}

export default {
  BooleanField,
  InlineRadioField,
  PasswordField,
  SelectField,
  TextField,
}
