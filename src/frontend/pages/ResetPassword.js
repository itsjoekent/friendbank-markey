import React from 'react';
import styled from 'styled-components';
import getCopy from '../utils/getCopy';
import Form from '../components/Form';
import Gateway from '../components/Gateway';
import { PASSWORD_INPUT } from '../components/FormFields';
import makeFormApiRequest from '../utils/makeFormApiRequest';
import makeLocaleLink from '../utils/makeLocaleLink';
import { isAuthenticated, setAuthToken } from '../utils/auth';
import { DASHBOARD_ROUTE } from '../routes';
import {
  validatePassword,
} from '../../shared/fieldValidations';

export const RESET_PASSWORD_ROUTE = '/friendbank/reset-password';

export default function ResetPassword() {
  async function onResetPassword(formValues) {
    const { password, passwordConfirmation } = formValues;

    if (password !== passwordConfirmation) {
      return [getCopy('validations.passwordMismatch'), null];
    }

    return await makeFormApiRequest('/api/v1/user', 'put', { password });
  }

  function onCompletion() {
    window.location.href = makeLocaleLink(DASHBOARD_ROUTE);
  }

  React.useEffect(() => {
    if (location.search.indexOf('token=') > -1) {
      const token = location.search.split('token=').pop();
      setAuthToken(token);
    }
  }, []);

  return (
    <Gateway>
      <Form
        formId="reset-password"
        steps={[{
          title: getCopy('authPage.resetPassword'),
          onStepSubmit: onResetPassword,
          buttonCopy: getCopy('formLabels.submit'),
          fields: [
            {
              fieldId: 'password',
              fieldType: PASSWORD_INPUT,
              label: getCopy('formLabels.password'),
              validator: validatePassword,
            },
            {
              fieldId: 'passwordConfirmation',
              fieldType: PASSWORD_INPUT,
              label: getCopy('formLabels.passwordConfirmation'),
              validator: validatePassword,
            },
          ],
        }]}
        onCompletion={onCompletion}
      />
    </Gateway>
  );
}
