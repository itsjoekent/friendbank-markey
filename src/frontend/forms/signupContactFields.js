import copy from '../../copy';
import { SINGLE_LINE_TEXT_INPUT } from '../components/FormFields';
import {
  validateName,
  validateZip,
  validatePhone,
  validateEmail,
} from '../utils/fieldValidations';

const signupContactFields = [
  {
    fieldId: 'firstName',
    fieldType: SINGLE_LINE_TEXT_INPUT,
    label: copy('formLabels.firstName'),
    isHalfWidth: true,
    validator: validateName,
  },
  {
    fieldId: 'lastName',
    fieldType: SINGLE_LINE_TEXT_INPUT,
    label: copy('formLabels.lastName'),
    isHalfWidth: true,
    validator: validateName,
  },
  {
    fieldId: 'zip',
    fieldType: SINGLE_LINE_TEXT_INPUT,
    label: copy('formLabels.zip'),
    isHalfWidth: true,
    validator: validateZip,
  },
  {
    fieldId: 'phone',
    fieldType: SINGLE_LINE_TEXT_INPUT,
    label: copy('formLabels.phone'),
    isHalfWidth: true,
    validator: validatePhone,
  },
  {
    fieldId: 'email',
    fieldType: SINGLE_LINE_TEXT_INPUT,
    label: copy('formLabels.email'),
    validator: validateEmail,
  },
];

export default signupContactFields;
