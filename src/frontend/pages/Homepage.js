import React from 'react';
import styled from 'styled-components';
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
        return data.error || 'Looks like we had an error, try again? If this continues to happen, please contact us https://www.edmarkey.com/contact-us/';
      }

      return null;
    } catch (error) {
      console.error(error);
      return 'Looks like we had an error, try again? If this continues to happen, please contact us https://www.edmarkey.com/contact-us/';
    }
  }

  function onCompletion(formValues) {
    window.location.href = `/${formValues.code}`;
  }

  const steps = [
    {
      title: 'make your own ed markey support page',
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
      buttonCopy: 'Next',
      fields: [
        ...signupStepOneFields,
        {
          fieldId: 'code',
          fieldType: CODE_INPUT_FIELD,
          label: 'Share code',
          help: 'We suggest using a combination of your first + last name.',
          validator: validateCode,
        },
      ],
    },
    {
      title: 'Lorem ipsum dolor sit amet',
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
      buttonCopy: 'Next',
      fields: [...signupStepTwoFields],
    },
    {
      title: 'Customize your page',
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
      buttonCopy: 'Create',
      onStepSubmit: onFinalStepSubmit,
      fields: [
        {
          fieldId: 'title',
          fieldType: SINGLE_LINE_TEXT_INPUT,
          label: 'Title',
          validator: validateRequired,
        },
        {
          fieldId: 'subtitle',
          fieldType: MULTI_LINE_TEXT_INPUT,
          label: 'Share #WhyImWithEd',
          validator: validateRequired,
        },
        {
          fieldId: 'background',
          fieldType: GALLERY_PICKER,
          label: 'Background',
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
