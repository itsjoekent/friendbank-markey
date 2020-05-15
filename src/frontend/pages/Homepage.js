import React from 'react';
import styled from 'styled-components';
import getCopy from '../utils/getCopy';
import SplitScreen from '../components/SplitScreen';
import Form from '../components/Form';
import CommitteeDisclaimer, { DisclaimerWrapper } from '../components/CommitteeDisclaimer';
import backgrounds from '../../shared/backgrounds';
import signupContactFields from '../forms/signupContactFields';
import signupIdFields from '../forms/signupIdFields';
import makeLocaleLink from '../utils/makeLocaleLink';
import makeFormApiRequest from '../utils/makeFormApiRequest';
import {
  SINGLE_LINE_TEXT_INPUT,
  MULTI_LINE_TEXT_INPUT,
  CODE_INPUT_FIELD,
  GALLERY_PICKER,
} from '../components/FormFields';
import {
  validateCode,
  validateRequired,
} from '../../shared/fieldValidations';

export default function Homepage() {
  async function onFinalStepSubmit(formValues) {
    const { code, ...rest } = formValues;

    return await makeFormApiRequest(`/api/v1/page/${code.toLowerCase()}`, rest);
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
      showSmsDisclaimer: true,
      fields: [
        ...signupContactFields(),
        {
          fieldId: 'code',
          fieldType: CODE_INPUT_FIELD,
          label: getCopy('formLabels.shareCode'),
          help: getCopy('formLabels.shareCodeHelp'),
          validator: validateCode,
        },
      ],
    },
    {
      title: getCopy('homepage.customizeTitle'),
      subtitle: getCopy('homepage.customizeSubtitle'),
      buttonCopy: getCopy('homepage.formButtonLabel'),
      fields: [
        {
          fieldId: 'title',
          fieldType: SINGLE_LINE_TEXT_INPUT,
          label: getCopy('formLabels.title'),
          validator: validateRequired,
        },
        {
          fieldId: 'subtitle',
          fieldType: MULTI_LINE_TEXT_INPUT,
          label: getCopy('formLabels.subtitle'),
          defaultValue: getCopy('homepage.defaultSubtitle'),
          validator: validateRequired,
        },
        {
          fieldId: 'background',
          fieldType: GALLERY_PICKER,
          label: getCopy('formLabels.background'),
          validator: validateRequired,
          options: Object.keys(backgrounds).map((key) => ({
            name: key,
            src: backgrounds[key].source,
            alt: backgrounds[key].alt,
          })),
        },
      ],
    },
    {
      title: getCopy('homepage.formTitle'),
      subtitle: getCopy('homepage.formSubtitle'),
      buttonCopy: getCopy('homepage.createButtonLabel'),
      onStepSubmit: onFinalStepSubmit,
      fields: [...signupIdFields()],
    },
  ];

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
    <SplitScreen media={backgrounds['ed-climate-march']}>
      <DisclaimerWrapper>
        <Form
          formId="create"
          steps={steps}
          onFormValueChange={onFormValueChange}
          onCompletion={onCompletion}
        />
        <CommitteeDisclaimer />
      </DisclaimerWrapper>
    </SplitScreen>
  );
}
