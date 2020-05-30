import React from 'react';
import styled from 'styled-components';
import { DASHBOARD_ROUTE } from './Dashboard';
import getCopy from '../utils/getCopy';
import StandardHelmet from '../components/StandardHelmet';
import Form, { FormTitleContainer } from '../components/Form';
import makeFormApiRequest from '../utils/makeFormApiRequest';
import makeLocaleLink from '../utils/makeLocaleLink';
import { isAuthenticated } from '../utils/auth';
import {
  SINGLE_LINE_TEXT_INPUT,
  PASSWORD_INPUT,
} from '../components/FormFields';
import {
  validateEmail,
  validatePassword,
} from '../../shared/fieldValidations';

export const LOGIN_ROUTE = '/friendbank/login';

export const NOT_AUTHORIZED_QUERY = 'not_authorized=1';

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 80vh;
  margin-bottom: 48px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadow};

  ${FormTitleContainer} {
    margin-bottom: 0;
  }
`;

const LinkRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 48px;
`;

const Link = styled.a`
  font-family: ${({ theme }) => theme.fonts.mainFamily};
  font-weight: normal;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.blue};
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

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
    <Layout>
      <StandardHelmet />
      {isNotAuthorizedFlag && (
        <NotAuthorizedBanner>
          {getCopy('authPage.notAuthorizedFlag')}
        </NotAuthorizedBanner>
      )}
      <Container>
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
        <LinkRow>
          <Link href={makeLocaleLink('/friendbank/signup')}>
            {getCopy('authPage.newAccount')}
          </Link>
          <Link href={makeLocaleLink('/friendbank/forgot-password')}>
            {getCopy('authPage.forgotPassword')}
          </Link>
        </LinkRow>
      </Container>
    </Layout>
  );
}
