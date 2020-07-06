import React from 'react';
import styled from 'styled-components';
import getCopy from '../utils/getCopy';
import Form from '../components/Form';
import Gateway from '../components/Gateway';
import makeFormApiRequest from '../utils/makeFormApiRequest';
import makeLocaleLink from '../utils/makeLocaleLink';
import { isAuthenticated } from '../utils/auth';
import {
  SINGLE_LINE_TEXT_INPUT,
  PASSWORD_INPUT,
} from '../components/FormFields';
import {
  NOT_AUTHORIZED_QUERY,
  DASHBOARD_ROUTE,
  CREATE_ACCOUNT_ROUTE,
  FORGOT_PASSWORD_ROUTE,
} from '../routes';
import {
  validateEmail,
  validatePassword,
} from '../../shared/fieldValidations';

const NotAuthorizedBanner = styled.p`
  display: block;
  font-family: ${({ theme }) => theme.fonts.mainFamily};
  font-weight: bold;
  font-size: 18px;
  text-align: center;
  width: 100%;
  max-width: 400px;
  padding: 4px;
  background-color: ${({ theme }) => theme.colors.red};
  color: ${({ theme }) => theme.colors.white};
`;

export default function Login() {
  const [isNotAuthorizedFlag, setIsNotAuthorizedFlag] = React.useState(false);

  async function onLogin(formValues) {
    const { email, password } = formValues;
    setIsNotAuthorizedFlag(false);

    return await makeFormApiRequest('/api/v1/login', 'post', { email, password }, null, false);
  }

  function onCompletion() {
    window.location.href = makeLocaleLink(DASHBOARD_ROUTE);
  }

  React.useEffect(() => {
    if (isAuthenticated()) {
      window.location.href = makeLocaleLink(DASHBOARD_ROUTE);
    }
  }, []);

  React.useEffect(() => {
    if (location.search.includes(NOT_AUTHORIZED_QUERY)) {
      setIsNotAuthorizedFlag(true);
      window.history.replaceState(null, '', location.pathname)
    }
  }, []);

  return (
    <Gateway
      preContainerChildren={isNotAuthorizedFlag && (
        <NotAuthorizedBanner>
          {getCopy('authPage.notAuthorizedFlag')}
        </NotAuthorizedBanner>
      )}
      leftLink={{
        path: CREATE_ACCOUNT_ROUTE,
        copy: getCopy('authPage.newAccount'),
      }}
      rightLink={{
        path: FORGOT_PASSWORD_ROUTE,
        copy: getCopy('authPage.forgotPassword'),
      }}
    >
      <Form
        formId="login"
        steps={[{
          title: getCopy('authPage.login'),
          onStepSubmit: onLogin,
          buttonCopy: getCopy('formLabels.submit'),
          fields: [
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
