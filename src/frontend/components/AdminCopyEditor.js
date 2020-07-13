import React from 'react';
import styled from 'styled-components';
import Form, { FormTitleContainer } from './Form';
import LoadingSpinner from './LoadingSpinner';
import { SINGLE_LINE_TEXT_INPUT } from '../components/FormFields';
import getCopy from '../utils/getCopy';
import makeApiRequest from '../utils/makeApiRequest';
import makeFormApiRequest from '../utils/makeFormApiRequest';
import { ENGLISH, SPANISH } from '../../shared/lang';

const COPY_FIELDS = {
  'forms': {
    name: 'Forms',
    fields: [
      {
        name: 'ID Question Label',
        key: 'idQuestions.support.label',
      },
      {
        name: 'ID Question Options',
        key: 'idQuestions.support.options',
        help: 'Comma separated values',
        splitOn: ',',
      },
      {
        name: 'Volunteer Question Label',
        key: 'idQuestions.volunteer.label',
      },
      {
        name: 'Volunteer Question Options',
        key: 'idQuestions.volunteer.options',
        help: 'Comma separated values',
        splitOn: ',',
      },
      {
        name: 'SMS Disclaimer',
        key: 'smsDisclaimer',
      },
      {
        name: 'Ballot Question Label',
        key: 'idQuestions.vote.label'
      },
      {
        name: 'Ballot Question Subtitle',
        key: 'idQuestions.vote.subtitle',
      },
      {
        name: 'Ballot Question Options',
        key: 'idQuestions.vote.options',
        help: 'Double-Comma separated values',
        splitOn: ',,',
      },
    ],
  },
  'signupFlow': {
    name: 'Signup Flow',
    fields: [
      {
        name: 'Homepage Title',
        key: 'homepage.formTitle',
      },
      {
        name: 'Homepage Subtitle',
        key: 'homepage.formSubtitle',
      },
      {
        name: 'Customize Form Title',
        key: 'homepage.customizeTitle',
      },
      {
        name: 'Customize Form Subtitle',
        key: 'homepage.customizeSubtitle',
      },
      {
        name: 'Next Button',
        key: 'homepage.formButtonLabel',
      },
      {
        name: 'Create Page Button',
        key: 'homepage.createButtonLabel',
      },
      {
        name: 'Pre-fill Title',
        help: 'Able to use the {{FIRST_NAME}} template variable',
        key: 'homepage.defaultTitle',
      },
      {
        name: 'Pre-fill subtitle',
        key: 'homepage.defaultSubtitle',
      },
      {
        name: 'Post-Signup Subtitle',
        help: 'Able to use the {{FIRST_NAME}} template variable',
        key: 'signupPage.postSignupSubtitle',
      },
      {
        name: 'Post-Signup Create Page Title',
        key: 'signupPage.postSignupCreateTitle',
      },
      {
        name: 'Post-Signup Create Page Subtitle',
        key: 'signupPage.postSignupCreateSubtitle',
      },
      {
        name: 'Post-Signup Create Page Button',
        key: 'signupPage.postSignupCreateButtonLabel',
      },
      {
        name: 'Created Page Modal Title',
        key: 'signupPage.modalTitle',
      },
      {
        name: 'Created Page Modal Copy',
        help: 'Uses Markdown syntax, new lines with \\n',
        key: 'signupPage.modalCopy',
        splitOn: '\n',
      },
      {
        name: 'Created Page Modal Close Button',
        key: 'signupPage.modalCloseLabel',
      },
    ],
  },
  'nav': {
    name: 'Navigation',
    fields: [
      {
        name: 'Logo Alt',
        key: 'nav.logoAlt',
      },
      {
        name: 'Return To Site',
        key: 'nav.return',
      },
      {
        name: 'Return To Site Link',
        key: 'nav.returnLink',
      },
      {
        name: 'Donate Form',
        key: 'nav.donateForm',
      },
    ],
  },
  'contactPage': {
    name: 'Contact Page',
    fields: [
      {
        name: 'Title',
        key: 'phonebankPage.title',
      },
      {
        name: 'Subtitle',
        key: 'phonebankPage.subtitle',
      },
      {
        name: 'Submission Confirmation',
        key: 'phonebankPage.successfullySubmitted'
      },
    ],
  },
  'global': {
    name: 'Global',
    fields: [
      {
        name: 'Privacy Policy Label',
        key: 'privacyPolicy.label',
      },
      {
        name: 'Privacy Policy Link',
        key: 'privacyPolicy.link',
      },
      {
        name: 'Political Disclaimer',
        key: 'politicalDiclaimer',
      },
      {
        name: 'Generic Error Message',
        key: 'genericError',
      },
    ],
  },
};

const Toolbar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: 24px;
`;

const ToolbarButton = styled.button`
  display: block;
  font-family: ${({ theme }) => theme.fonts.headerFamily};
  font-weight: bold;
  font-size: 14px;
  line-height: 1.1;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.blue};
  cursor: pointer;
  padding: 0;
  width: fit-content;
  background: none;
  border: none;
  text-decoration: none;
  margin-bottom: 16px;

  &:hover {
    text-decoration: underline;
  }
`;

const FormWrapper = styled.div`
  margin-bottom: 48px;

  ${FormTitleContainer} {
    margin-bottom: 0;
  }
`;

export default function AdminCopyEditor(props) {
  const [campaignCopy, setCampaignCopy] = React.useState(null);

  React.useEffect(() => {
    let cancel = false;

    async function fetchCampaign() {
      const { json } = await makeApiRequest('/api/v1/campaign', 'get');

      if (!cancel) {
        setCampaignCopy(JSON.parse(json.campaign.copy));
      }
    }

    if (!campaignCopy) {
      fetchCampaign();
    }

    return () => cancel = true;
  }, [campaignCopy, setCampaignCopy]);

  function onStepSubmitGenerator(groupId) {
    async function onStepSubmit(formValues) {
      const update = Object.keys(formValues).reduce((acc, key) => {
        const trueKey = key.replace(`-${SPANISH}`, '');
        const field = COPY_FIELDS[groupId].fields.find((compare) => compare.key === trueKey) || {};

        const value = field.splitOn
          ? (formValues[key] || '').split(field.splitOn)
          : formValues[key];

        const lang = key.endsWith(`-${SPANISH}`) ? SPANISH : ENGLISH;

        return {
          ...acc,
          [trueKey]: {
            ...(acc[trueKey] || {}),
            [lang]: value,
          },
        };
      }, {});

      return await makeFormApiRequest('/api/v1/campaign', 'post', { copy: JSON.stringify(update) });
    }

    return onStepSubmit;
  }

  function onCompletionGenerator(groupId) {
    function onCompletion(formValues, setTargetStep, setFormValues) {
      setCampaignCopy(null);
    }

    return onCompletion;
  }

  function getDefaultValue(field, language) {
    if (!campaignCopy) {
      return '';
    }

    const container = campaignCopy[field.key];

    if (!container) {
      return '';
    }

    const value = container[language];

    if (field.splitOn) {
      return (value || ['']).join(field.splitOn);
    }

    return value;
  }

  function mapGroupFields(groupId, fields) {
    return fields.reduce((acc, field) => {
      const data = {
        fieldId: field.key,
        fieldType: SINGLE_LINE_TEXT_INPUT,
        label: field.name,
        help: field.help,
        defaultValue: getDefaultValue(field, ENGLISH),
      };

      return [
        ...acc,
        data,
        {
          ...data,
          fieldId: `${field.key}-${SPANISH}`,
          label: `(Spanish) ${data.label}`,
          defaultValue: getDefaultValue(field, SPANISH),
        },
      ];
    }, []);
  }

  return (
    <LoadingSpinner hasCompletedLoading={!!campaignCopy}>
      <React.Fragment>
        {Object.keys(COPY_FIELDS).map((groupId) => (
          <FormWrapper key={groupId}>
            <Form
              formId={`admin-copy-${groupId}`}
              steps={[{
                title: COPY_FIELDS[groupId].name,
                onStepSubmit: onStepSubmitGenerator(groupId),
                buttonCopy: getCopy('formLabels.submit'),
                fields: mapGroupFields(groupId, COPY_FIELDS[groupId].fields),
              }]}
              onCompletion={onCompletionGenerator(groupId)}
            />
          </FormWrapper>
        ))}
      </React.Fragment>
    </LoadingSpinner>
  );
}
