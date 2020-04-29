import { SINGLE_LINE_TEXT_INPUT } from '../components/FormFields';
import {
  validateName,
  validateZip,
  validatePhone,
  validateEmail,
} from '../utils/fieldValidations';

const signupStepOneFields = [
  {
    fieldId: 'firstName',
    fieldType: SINGLE_LINE_TEXT_INPUT,
    label: 'First name',
    isHalfWidth: true,
    validator: validateName,
  },
  {
    fieldId: 'lastName',
    fieldType: SINGLE_LINE_TEXT_INPUT,
    label: 'Last name',
    isHalfWidth: true,
    validator: validateName,
  },
  {
    fieldId: 'zip',
    fieldType: SINGLE_LINE_TEXT_INPUT,
    label: 'Zip',
    isHalfWidth: true,
    validator: validateZip,
  },
  {
    fieldId: 'phone',
    fieldType: SINGLE_LINE_TEXT_INPUT,
    label: 'Phone',
    isHalfWidth: true,
    validator: validatePhone,
  },
  {
    fieldId: 'email',
    fieldType: SINGLE_LINE_TEXT_INPUT,
    label: 'Email',
    validator: validateEmail,
  },
];

export default signupStepOneFields;
