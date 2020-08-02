import React from 'react';
import styled from 'styled-components';
import Form, { FormContainer, FormTitleContainer } from '../components/Form';
import {
  SINGLE_LINE_TEXT_INPUT,
  PASSWORD_INPUT,
} from '../components/FormFields';
import {
  validateEmail,
  validatePassword,
} from '../../shared/fieldValidations';
import getCopy from '../utils/getCopy';
import makeApiRequest from '../utils/makeApiRequest';
import makeFormApiRequest from '../utils/makeFormApiRequest';

const Container = styled.div`
  display: flex;
  flex-direction: column;

  ${FormContainer} {
    width: 100%;
    max-width: 300px;
  }

  ${FormTitleContainer} {
    margin-bottom: 0;
  }
`;

const ResultsContainer = styled.div`
  width: 100%;
  max-width: 400px;

  ${FormContainer} {
    margin-top: 48px;
  }
`;

const ResultFieldRow = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 16px;
`;

const ResultKey = styled.p`
  font-family: ${({ theme }) => theme.fonts.mainFamily};
  font-weight: bold;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.blue};

  margin-right: 8px;
`;

const ResultValue = styled.p`
  font-family: ${({ theme }) => theme.fonts.mainFamily};
  font-weight: bold;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.black};
`;

const SearchAgainButton = styled.button`
  display: block;
  border: none;
  background: none;
  padding: 0;
  margin-right: 24px;
  font-family: ${({ theme }) => theme.fonts.headerFamily};
  font-weight: bold;
  font-size: 12px;
  line-height: 1;
  text-transform: uppercase;
  text-decoration: underline;
  color: ${({ theme }) => theme.colors.grey};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.black};
  }
`;

const SuccessMessage = styled.p`
  font-family: ${({ theme }) => theme.fonts.mainFamily};
  font-weight: bold;
  font-size: 18px;
  text-align: center;
  width: 100%;
  padding: 8px 4px;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.green};
`;

export default function AdminFixAccount(props) {
  const [accountResult, setAccountResult] = React.useState(null);
  const [successfullySubmitted, setSuccessfullySubmitted] = React.useState(false);

  React.useEffect(() => {
    if (successfullySubmitted) {
      const timeoutId = setTimeout(() => {
        setSuccessfullySubmitted(false);
      }, 2500);

      return () => clearTimeout(timeoutId);
    }
  }, [successfullySubmitted, setSuccessfullySubmitted]);

  async function onPageSearch(formValues) {
    const { code, email } = formValues;

    if (code) {
      const { response, json, errorMessage } = await makeApiRequest(`/api/v1/admin/page/${code}`, 'get');

      if (response.status === 404) {
        return [json.error, null];
      }

      if (errorMessage) {
        return errorMessage;
      }

      setAccountResult(json.page.createdBy);
    } else if (email) {
      const { response, json, errorMessage } = await makeApiRequest(`/api/v1/admin/user/email/${email}`, 'get');

      if (response.status === 404) {
        return [json.error, null];
      }

      if (errorMessage) {
        return errorMessage;
      }

      setAccountResult(json.user);
    }
  }

  async function onAccountUpdate(formValues) {
    return await makeFormApiRequest(`/api/v1/admin/user/${accountResult.id}`, 'post', { ...formValues });
  }

  function onCompletion(formValues, setTargetStep, setFormValues) {
    setTargetStep(0);
    setFormValues({});
    setSuccessfullySubmitted(true);
    setAccountResult(null);
  }

  return (
    <Container>
      {successfullySubmitted && (
        <SuccessMessage>
          Successfully updated account!
        </SuccessMessage>
      )}
      {!accountResult && (
        <Form
          formId="admin-lookup"
          steps={[{
            title: 'Lookup Account',
            buttonCopy: getCopy('formLabels.submit'),
            onStepSubmit: onPageSearch,
            fields: [
              {
                fieldId: 'code',
                fieldType: SINGLE_LINE_TEXT_INPUT,
                label: getCopy('formLabels.shareCode'),
              },
              {
                fieldId: 'email',
                fieldType: SINGLE_LINE_TEXT_INPUT,
                label: getCopy('formLabels.email'),
              },
            ],
          }]}
        />
      )}
      {accountResult && (
        <ResultsContainer>
          <ResultFieldRow>
            <ResultKey>Name:</ResultKey>
            <ResultValue>{accountResult.firstName}</ResultValue>
          </ResultFieldRow>
          <ResultFieldRow>
            <ResultKey>Email:</ResultKey>
            <ResultValue>{accountResult.email}</ResultValue>
          </ResultFieldRow>
          <ResultFieldRow>
            <ResultKey>FriendBank ID:</ResultKey>
            <ResultValue>{accountResult.id}</ResultValue>
          </ResultFieldRow>
          <SearchAgainButton onClick={() => setAccountResult(null)}>
            Clear Results
          </SearchAgainButton>
          <Form
            formId="admin-edit-account"
            onCompletion={onCompletion}
            steps={[
              {
                title: 'Edit Account',
                buttonCopy: getCopy('formLabels.submit'),
                onStepSubmit: onAccountUpdate,
                fields: [
                  {
                    fieldId: 'email',
                    fieldType: SINGLE_LINE_TEXT_INPUT,
                    label: getCopy('formLabels.email'),
                    defaultValue: accountResult.email,
                    passthrough: { autoComplete: 'off' },
                  },
                  {
                    fieldId: 'password',
                    fieldType: PASSWORD_INPUT,
                    label: getCopy('formLabels.password'),
                    passthrough: { autoComplete: 'off' },
                  },
                ]
              },
            ]}
          />
        </ResultsContainer>
      )}
    </Container>
  );
}
