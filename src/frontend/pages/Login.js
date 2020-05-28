import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import getCopy from '../utils/getCopy';
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

const Layout = styled.div`
  display: flex;
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
  box-shadow: 0px 1px 4px rgba(0,0,0,25%);

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

export default function Login() {
  async function onLogin(formValues) {
    const { email, password } = formValues;

    return await makeFormApiRequest('/api/v1/login', { email, password });
  }

  function onCompletion() {
    // TODO: Import route?
    window.location.href = makeLocaleLink(`/friendbank/dashboard`);
  }

  React.useEffect(() => {
    if (isAuthenticated()) {
      window.location.href = makeLocaleLink(`/friendbank/dashboard`);
    }
  }, []);

  return (
    <Layout>
      <Container>
        <Form
          formId="login"
          steps={[{
            title: 'Login',
            onStepSubmit: onLogin,
            buttonCopy: 'Submit',
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
          <Link href={makeLocaleLink('/friendbank/signup')}>Create new account</Link>
          <Link href={makeLocaleLink('/friendbank/forgot-password')}>Forgot my password</Link>
        </LinkRow>
      </Container>
    </Layout>
  );
}
