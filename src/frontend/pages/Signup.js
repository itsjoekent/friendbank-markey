import React from 'react';
import styled from 'styled-components';
import { useApplicationContext } from '../ApplicationContext';
import CommitteeDisclaimer, { DisclaimerWrapper } from '../components/CommitteeDisclaimer';
import SplitScreen from '../components/SplitScreen';
import Form from '../components/Form';
import backgrounds from '../../backgrounds';
import signupStepOneFields from '../forms/signupStepOneFields';
import signupStepTwoFields from '../forms/signupStepTwoFields';

export default function Signup() {
  const { page: { code, title, subtitle, background } } = useApplicationContext();

  function onStepSubmitGenerator(index) {
    async function onStepSubmit(formValues) {
      try {
        const response = await fetch(`/api/v1/page/${code.toLowerCase()}/signup/${index}`, {
          method: 'post',
          body: JSON.stringify(formValues),
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

    return onStepSubmit;
  }

  function onCompletion(formValues) {
    // ...
  }

  const steps = [
    {
      title: title,
      subtitle: subtitle,
      buttonCopy: 'Submit',
      fields: [...signupStepOneFields],
      onStepSubmit: onStepSubmitGenerator(1),
    },
    {
      title: 'Lorem ipsum dolor sit amet',
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
      buttonCopy: 'Submit',
      fields: [...signupStepTwoFields],
      onStepSubmit: onStepSubmitGenerator(2),
    },
  ];

  return (
    <SplitScreen media={backgrounds[background]}>
      <DisclaimerWrapper>
        <Form
          formId="signup"
          steps={steps}
          onCompletion={onCompletion}
        />
        <CommitteeDisclaimer />
      </DisclaimerWrapper>
    </SplitScreen>
  );
}
