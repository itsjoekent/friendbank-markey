import copy from '../../copy';
import { RADIO_FIELD } from '../components/FormFields';
import { validateRequired } from '../utils/fieldValidations';

const signupIdFields = [
  {
    fieldId: 'supportLevel',
    fieldType: RADIO_FIELD,
    label: copy('idQuestions.support.label'),
    validator: validateRequired,
    options: copy('idQuestions.support.options'),
  },
  {
    fieldId: 'volunteerLevel',
    fieldType: RADIO_FIELD,
    label: copy('idQuestions.volunteer.label'),
    validator: validateRequired,
    options: copy('idQuestions.volunteer.options'),
  },
];

export default signupIdFields;
