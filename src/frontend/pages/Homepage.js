import React from 'react';
import styled from 'styled-components';
import { useApplicationContext } from '../ApplicationContext';
import StandardHelmet from '../components/StandardHelmet';
import SplitScreen from '../components/SplitScreen';
import Form from '../components/Form';
import useRole from '../hooks/useRole';
import signupIdFields from '../forms/signupIdFields';
import makeLocaleLink from '../utils/makeLocaleLink';
import makeFormApiRequest from '../utils/makeFormApiRequest';
import getCopy from '../utils/getCopy';
import getConfig from '../utils/getConfig';
import { isAuthenticated } from '../utils/auth';
import {
  SINGLE_LINE_TEXT_INPUT,
  PASSWORD_INPUT,
  MULTI_LINE_TEXT_INPUT,
  CODE_INPUT_FIELD,
  GALLERY_PICKER,
  MEDIA_UPLOAD,
} from '../components/FormFields';
import { TRANSACTIONAL_EMAIL } from '../../shared/emailFrequency';
import { STAFF_ROLE } from '../../shared/roles';
import {
  validateName,
  validateZip,
  validateEmail,
  validatePhone,
  validatePassword,
  validateCode,
  validateTitle,
  validateSubtitle,
  validateBackground,
} from '../../shared/fieldValidations';

export default function Homepage(props) {
  const { campaignMedia } = useApplicationContext();
  const role = useRole();

  const [normalizedCode, setNormalizedCode] = React.useState(null);

  async function onUserSubmit(formValues) {
    const {
      email,
      password,
      firstName,
      zip,
    } = formValues;

    const payload = {
      email,
      password,
      firstName,
      zip,
      emailFrequency: TRANSACTIONAL_EMAIL,
    };

    return await makeFormApiRequest('/api/v1/user', 'post', payload);
  }

  async function onPageSubmit(formValues) {
    const {
      code,
      title,
      subtitle,
      background,
    } = formValues;

    const payload = {
      title,
      subtitle,
      background,
    };

    async function afterPageSubmit(data) {
      setNormalizedCode(data.page.code);
    }

    return await makeFormApiRequest(`/api/v1/page/${code}`, 'post', payload, afterPageSubmit);
  }

  async function onSignup(formValues) {
    const {
      code,
      firstName,
      lastName,
      email,
      phone,
      zip,
      supportLevel,
      volunteerLevel,
    } = formValues;

    const payload = {
      code,
      firstName,
      lastName,
      email,
      phone,
      zip,
      supportLevel,
      volunteerLevel,
    };

    return await makeFormApiRequest('/api/v1/signup', 'post', payload);
  }

  function onCompletion(formValues) {
    const linkCode = encodeURIComponent((formValues.code || '').trim().toLowerCase());

    sessionStorage.setItem(`${linkCode}-new`, true);
    window.location.href = makeLocaleLink(`/${linkCode}`);
  }

  const steps = [
    {
      title: getCopy('homepage.formTitle'),
      subtitle: getCopy('homepage.formSubtitle'),
      buttonCopy: getCopy('homepage.formButtonLabel'),
      onStepSubmit: onUserSubmit,
      showSmsDisclaimer: true,
      fields: [
        {
          fieldId: 'email',
          fieldType: SINGLE_LINE_TEXT_INPUT,
          isHalfWidth: true,
          label: getCopy('formLabels.email'),
          validator: validateEmail,
        },
        {
          fieldId: 'password',
          fieldType: PASSWORD_INPUT,
          isHalfWidth: true,
          label: getCopy('formLabels.password'),
          validator: validatePassword,
        },
        {
          fieldId: 'firstName',
          fieldType: SINGLE_LINE_TEXT_INPUT,
          isHalfWidth: true,
          label: getCopy('formLabels.firstName'),
          validator: validateName,
        },
        {
          fieldId: 'lastName',
          fieldType: SINGLE_LINE_TEXT_INPUT,
          isHalfWidth: true,
          label: getCopy('formLabels.lastName'),
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
          fieldId: 'phone',
          fieldType: SINGLE_LINE_TEXT_INPUT,
          isHalfWidth: true,
          label: getCopy('formLabels.phone'),
          validator: validatePhone,
        },
      ],
    },
    {
      title: getCopy('homepage.customizeTitle'),
      subtitle: getCopy('homepage.customizeSubtitle'),
      buttonCopy: getCopy('homepage.formButtonLabel'),
      onStepSubmit: onPageSubmit,
      fields: [
        {
          fieldId: 'code',
          fieldType: CODE_INPUT_FIELD,
          label: getCopy('formLabels.shareCode'),
          help: getCopy('formLabels.shareCodeHelp'),
          validator: validateCode,
        },
        {
          fieldId: 'title',
          fieldType: SINGLE_LINE_TEXT_INPUT,
          label: getCopy('formLabels.title'),
          validator: validateTitle,
        },
        {
          fieldId: 'subtitle',
          fieldType: MULTI_LINE_TEXT_INPUT,
          label: getCopy('formLabels.subtitle'),
          defaultValue: getCopy('homepage.defaultSubtitle'),
          validator: validateSubtitle,
        },
        {
          fieldId: 'background',
          fieldType: GALLERY_PICKER,
          label: getCopy('formLabels.background'),
          validator: validateBackground,
          options: campaignMedia.map((media) => ({
            name: media._id,
            src: media.source,
            alt: media.alt,
          })),
        },
      ],
    },
    {
      title: getCopy('homepage.formTitle'),
      subtitle: getCopy('homepage.formSubtitle'),
      buttonCopy: getCopy('homepage.createButtonLabel'),
      onStepSubmit: onSignup,
      fields: [
        ...signupIdFields()
      ],
    },
    {
      title: getCopy('homepage.formTitle'),
      subtitle: getCopy('homepage.formSubtitle'),
      buttonCopy: getCopy('homepage.formButtonLabel'),
      fields: [
        {
          fieldId: 'votePlan',
          fieldType: 'RADIO_FIELD',
          label: 'Are you planning to vote by absentee?',
          options: [
            'Yes and already submitted my ballot',
            'Yes and I need a ballot',
            'No I\'m not sure',
            'I\'d like to learn more',
          ],
        }
      ],
    },
  ];

  if (role === STAFF_ROLE) {
    steps[1].fields.push({
      fieldId: 'customBackground',
      fieldType: MEDIA_UPLOAD,
      label: getCopy('formLabels.customBackground'),
      set: 'background',
    });
  }

  const authenticatedSteps = [
    {
      ...steps[1],
      title: getCopy('homepage.formTitle'),
      buttonCopy: getCopy('homepage.createButtonLabel'),
    }
  ];

  const [clientSteps, setClientSteps] = React.useState(steps);

  React.useEffect(() => {
    if (isAuthenticated()) {
      setClientSteps(authenticatedSteps);
    }
  }, []);

  React.useEffect(() => {
    setClientSteps(isAuthenticated() ? authenticatedSteps : steps);
  }, [role]);

  const [hasPrefilledCode, setHasPrefilledCode] = React.useState(false);
  const [hasPrefilledTitle, setHasPrefilledTitle] = React.useState(false);

  function onFormValueChange(formValues, setFormValues, activeStep) {
    if (
      formValues.firstName
      && formValues.lastName
      && !formValues.code
      && !hasPrefilledCode
    ) {
      const prefill = `${formValues.firstName}-${formValues.lastName}`;

      setFormValues((copy) => ({
        ...copy,
        code: prefill,
      }));

      setHasPrefilledCode(true);
    }

    if (
      formValues.firstName
      && !formValues.title
      && !hasPrefilledTitle
      && activeStep === 1
    ) {
      setFormValues((formCopy) => ({
        ...formCopy,
        title: getCopy('homepage.defaultTitle').replace('{{FIRST_NAME}}', formValues.firstName),
      }));

      setHasPrefilledTitle(true);
    }
  }

  return (
    <SplitScreen media={getConfig('defaultMedia')}>
      <StandardHelmet />
      <Form
        formId="create"
        steps={clientSteps}
        onFormValueChange={onFormValueChange}
        onCompletion={onCompletion}
      />
    </SplitScreen>
  );
}
