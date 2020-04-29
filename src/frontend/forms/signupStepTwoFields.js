import { RADIO_FIELD } from '../components/FormFields';
import { validateRequired } from '../utils/fieldValidations';

const signupStepTwoFields = [
  {
    fieldId: 'supportLevel',
    fieldType: RADIO_FIELD,
    label: 'Will you vote for Ed Markey in the September 1 primary?',
    validator: validateRequired,
    options: [
      'Definitely',
      'Probably',
      'Undecided',
      'Probably not',
      'Definitely not',
      'Too Young/Ineligible to Vote',
    ],
  },
  {
    fieldId: 'volunteerLevel',
    fieldType: RADIO_FIELD,
    label: 'Will you volunteer with Team Markey?',
    validator: validateRequired,
    options: [
      'Yes',
      'No',
      'Maybe',
      'Later',
    ],
  },
];

export default signupStepTwoFields;
