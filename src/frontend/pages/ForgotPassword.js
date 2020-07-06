import React from 'react';
import styled from 'styled-components';
import getCopy from '../utils/getCopy';
import Form from '../components/Form';
import Gateway from '../components/Gateway';
import { SINGLE_LINE_TEXT_INPUT } from '../components/FormFields';
import makeFormApiRequest from '../utils/makeFormApiRequest';
import makeLocaleLink from '../utils/makeLocaleLink';
import { isAuthenticated } from '../utils/auth';
import {
  DASHBOARD_ROUTE,
  LOGIN_ROUTE,
  CREATE_ACCOUNT_ROUTE,
} from '../routes';
import {
  validateEmail,
} from '../../shared/fieldValidations';

const Banner = styled.p`
  display: block;
  font-family: ${({ theme }) => theme.fonts.mainFamily};
  font-weight: bold;
  font-size: 18px;
  text-align: center;
  width: 100%;
  max-width: 400px;
  color: ${({ theme }) => theme.colors.darkBlue};
`;

export default function ForgotPassword() {
  const [hasSentEmail, setHasSentEmail] = React.useState(false);

  async function onRequestForgotPassword(formValues) {
    const { email } = formValues;

    return await makeFormApiRequest('/api/v1/forgot-password', 'post', { email });
  }

  function onCompletion() {
    setHasSentEmail(true);
  }

  React.useEffect(() => {
    if (isAuthenticated()) {
      window.location.href = makeLocaleLink(DASHBOARD_ROUTE);
    }
  }, []);

  if (hasSentEmail) {
    return (
      <Gateway>
        <Banner>
          {getCopy('authPage.forgotPasswordSent')}
        </Banner>
      </Gateway>
    );
  }

  return (
    <Gateway
      leftLink={{
        path: CREATE_ACCOUNT_ROUTE,
        copy: getCopy('authPage.newAccount'),
      }}
      rightLink={{
        path: LOGIN_ROUTE,
        copy: getCopy('authPage.login'),
      }}
    >
      <Form
        formId="login"
        steps={[{
          title: getCopy('authPage.forgotPassword'),
          onStepSubmit: onRequestForgotPassword,
          buttonCopy: getCopy('formLabels.submit'),
          fields: [
            {
              fieldId: 'email',
              fieldType: SINGLE_LINE_TEXT_INPUT,
              label: getCopy('formLabels.email'),
              validator: validateEmail,
            },
          ],
        }]}
        onCompletion={onCompletion}
      />
    </Gateway>
  );
}
