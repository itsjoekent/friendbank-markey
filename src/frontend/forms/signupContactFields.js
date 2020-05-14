import getCopy from '../utils/getCopy';
import { SINGLE_LINE_TEXT_INPUT } from '../components/FormFields';
import {
  validateName,
  validateZip,
  validatePhone,
  validateEmail,
} from '../../shared/fieldValidations';

export default function signupContactFields() {
  return [
    {
      fieldId: 'firstName',
      fieldType: SINGLE_LINE_TEXT_INPUT,
      label: getCopy('formLabels.firstName'),
      isHalfWidth: true,
      validator: validateName,
    },
    {
      fieldId: 'lastName',
      fieldType: SINGLE_LINE_TEXT_INPUT,
      label: getCopy('formLabels.lastName'),
      isHalfWidth: true,
      validator: validateName,
    },
    {
      fieldId: 'zip',
      fieldType: SINGLE_LINE_TEXT_INPUT,
      label: getCopy('formLabels.zip'),
      isHalfWidth: true,
      validator: validateZip,
    },
    {
      fieldId: 'phone',
      fieldType: SINGLE_LINE_TEXT_INPUT,
      label: getCopy('formLabels.phone'),
      isHalfWidth: true,
      validator: validatePhone,
    },
    {
      fieldId: 'email',
      fieldType: SINGLE_LINE_TEXT_INPUT,
      label: getCopy('formLabels.email'),
      validator: validateEmail,
    },
  ]
}
