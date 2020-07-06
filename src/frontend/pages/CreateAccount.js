import React from 'react';
import Form from '../components/Form';
import Gateway from '../components/Gateway';
import {
  SINGLE_LINE_TEXT_INPUT,
  PASSWORD_INPUT,
} from '../components/FormFields';
import getCopy from '../utils/getCopy';
import makeFormApiRequest from '../utils/makeFormApiRequest';
import makeLocaleLink from '../utils/makeLocaleLink';
import { isAuthenticated } from '../utils/auth';
import {
  DASHBOARD_ROUTE,
  LOGIN_ROUTE,
  FORGOT_PASSWORD_ROUTE,
} from '../routes';
import {
  validateEmail,
  validatePassword,
  validateName,
  validateZip,
} from '../../shared/fieldValidations';
import { TRANSACTIONAL_EMAIL } from '../../shared/emailFrequency';

export const CREATE_ACCOUNT_ROUTE = '/friendbank/create-account';

export default function CreateAccount() {
  async function onCreateAccount(formValues) {
    const { email, password, firstName, zip } = formValues;

    const payload = {
      email,
      password,
      firstName,
      zip,
      emailFrequency: TRANSACTIONAL_EMAIL,
    };

    return await makeFormApiRequest('/api/v1/user', 'post', payload);
  }

  function onCompletion() {
    window.location.href = makeLocaleLink(DASHBOARD_ROUTE);
  }

  React.useEffect(() => {
    if (isAuthenticated()) {
      window.location.href = makeLocaleLink(DASHBOARD_ROUTE);
    }
  }, []);

  return (
    <Gateway
      leftLink={{
        path: LOGIN_ROUTE,
        copy: getCopy('authPage.login'),
      }}
      rightLink={{
        path: FORGOT_PASSWORD_ROUTE,
        copy: getCopy('authPage.forgotPassword'),
      }}
    >
      <Form
        formId="create-account"
        steps={[{
          title: getCopy('authPage.newAccount'),
          onStepSubmit: onCreateAccount,
          buttonCopy: getCopy('formLabels.submit'),
          fields: [
            {
              fieldId: 'firstName',
              fieldType: SINGLE_LINE_TEXT_INPUT,
              isHalfWidth: true,
              label: getCopy('formLabels.firstName'),
              validator: validateName,
            },
            {
              fieldId: 'zip',
              fieldType: SINGLE_LINE_TEXT_INPUT,
              isHalfWidth: true,
              label: getCopy('formLabels.zip'),
              validator: validateZip,
            },
            {
              fieldId: 'email',
              fieldType: SINGLE_LINE_TEXT_INPUT,
              label: getCopy('formLabels.email'),
              validator: validateEmail,
            },
            {
              fieldId: 'password',
              fieldType: PASSWORD_INPUT,
              label: getCopy('formLabels.password'),
              validator: validatePassword,
            },
          ],
        }]}
        onCompletion={onCompletion}
      />
    </Gateway>
  );
}
