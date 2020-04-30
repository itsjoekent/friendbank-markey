import React from 'react';
import styled from 'styled-components';
import copy from '../../copy';
import SplitScreen from '../components/SplitScreen';
import Form from '../components/Form';
import CommitteeDisclaimer, { DisclaimerWrapper } from '../components/CommitteeDisclaimer';
import backgrounds from '../../backgrounds';
import signupStepOneFields from '../forms/signupStepOneFields';
import signupStepTwoFields from '../forms/signupStepTwoFields';
import {
  SINGLE_LINE_TEXT_INPUT,
  MULTI_LINE_TEXT_INPUT,
  CODE_INPUT_FIELD,
  GALLERY_PICKER,
} from '../components/FormFields';
import {
  validateCode,
  validateRequired,
} from '../utils/fieldValidations';

export default function Homepage() {
  async function onFinalStepSubmit(formValues) {
    const { code, ...rest } = formValues;

    try {
      const response = await fetch(`/api/v1/page/${code.toLowerCase()}`, {
        method: 'post',
        body: JSON.stringify(rest),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status !== 200) {
        const data = await response.json();
        return data.error || copy.genericError;
      }

      return null;
    } catch (error) {
      console.error(error);
      return copy.genericError;
    }
  }

  function onCompletion(formValues) {
    const linkCode = encodeURIComponent((formValues.code || '').trim().toLowerCase());

    sessionStorage.setItem(`${linkCode}-new`, true);
    window.location.href = `/${linkCode}`;
  }

  const steps = [
    {
      title: copy.homepage.formTitle,
      subtitle: copy.homepage.formSubtitle,
      buttonCopy: copy.homepage.formButtonLabel,
      showSmsDisclaimer: true,
      fields: [
        ...signupStepOneFields,
        {
          fieldId: 'code',
          fieldType: CODE_INPUT_FIELD,
          label: copy.formLabels.shareCode,
          help: copy.formLabels.shareCodeHelp,
          validator: validateCode,
        },
      ],
    },
    {
      title: copy.homepage.formTitle,
      subtitle: copy.homepage.formSubtitle,
      buttonCopy: copy.homepage.formButtonLabel,
      fields: [...signupStepTwoFields],
    },
    {
      title: copy.homepage.customizeTitle,
      subtitle: copy.homepage.customizeSubtitle,
      buttonCopy: copy.homepage.customizeButtonLabel,
      onStepSubmit: onFinalStepSubmit,
      fields: [
        {
          fieldId: 'title',
          fieldType: SINGLE_LINE_TEXT_INPUT,
          label: copy.formLabels.title,
          validator: validateRequired,
        },
        {
          fieldId: 'subtitle',
          fieldType: MULTI_LINE_TEXT_INPUT,
          label: copy.formLabels.subtitle,
          validator: validateRequired,
        },
        {
          fieldId: 'background',
          fieldType: GALLERY_PICKER,
          label: copy.formLabels.background,
          validator: validateRequired,
          options: Object.keys(backgrounds).map((key) => ({
            name: key,
            src: backgrounds[key].source,
            alt: backgrounds[key].alt,
          })),
        },
      ],
    },
  ];

  const [hasPrefilledCode, setHasPrefilledCode] = React.useState(false);
  const [hasPrefilledTitle, setHasPrefilledTitle] = React.useState(false);

  function onFormValueChange(formValues, setFormValues) {
    if (
      formValues.firstName
      && formValues.lastName
      && !formValues.code
      && !hasPrefilledCode
    ) {
      const prefill = `${formValues.firstName}-${formValues.lastName}-${Math.round(Math.random() * 1000)}`;

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
    ) {
      setFormValues((formCopy) => ({
        ...formCopy,
        title: copy.homepage.defaultTitle.replace('{{FIRST_NAME}}', formValues.firstName),
      }));

      setHasPrefilledTitle(true);
    }
  }

  return (
    <SplitScreen media={backgrounds.default}>
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
