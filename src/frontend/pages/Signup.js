import React from 'react';
import styled from 'styled-components';
import { useApplicationContext } from '../ApplicationContext';
import SplitScreen from '../components/SplitScreen';
import Form from '../components/Form';
import backgrounds from '../../backgrounds';
import signupStepOneFields from '../forms/signupStepOneFields';
import signupStepTwoFields from '../forms/signupStepTwoFields';

export default function Signup() {
  async function onFirstStepSubmit(formValues) {
    // const { code, ...rest } = formValues;
    //
    // try {
    //   const response = await fetch(`/api/v1/page/${code.toLowerCase()}`, {
    //     method: 'post',
    //     body: JSON.stringify(rest),
    //     headers: { 'Content-Type': 'application/json' },
    //   });
    //
    //   if (response.status !== 200) {
    //     const data = await response.json();
    //     return data.error || 'Looks like we had an error, try again? If this continues to happen, please contact us https://www.edmarkey.com/contact-us/';
    //   }
    //
    //   return null;
    // } catch (error) {
    //   console.error(error);
    //   return 'Looks like we had an error, try again? If this continues to happen, please contact us https://www.edmarkey.com/contact-us/';
    // }
  }

  async function onSecondStepSubmit(formValues) {
    // const { code, ...rest } = formValues;
    //
    // try {
    //   const response = await fetch(`/api/v1/page/${code.toLowerCase()}`, {
    //     method: 'post',
    //     body: JSON.stringify(rest),
    //     headers: { 'Content-Type': 'application/json' },
    //   });
    //
    //   if (response.status !== 200) {
    //     const data = await response.json();
    //     return data.error || 'Looks like we had an error, try again? If this continues to happen, please contact us https://www.edmarkey.com/contact-us/';
    //   }
    //
    //   return null;
    // } catch (error) {
    //   console.error(error);
    //   return 'Looks like we had an error, try again? If this continues to happen, please contact us https://www.edmarkey.com/contact-us/';
    // }
  }

  function onCompletion(formValues) {
    // ...
  }

  const { page: { title, subtitle, background } } = useApplicationContext();

  const steps = [
    {
      title: title,
      subtitle: subtitle,
      buttonCopy: 'Submit',
      fields: [...signupStepOneFields,],
    },
    {
      title: 'Lorem ipsum dolor sit amet',
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
      buttonCopy: 'Submit',
      fields: [...signupStepTwoFields],
    },
  ];

  return (
    <SplitScreen media={backgrounds[background]}>
      <Form
        formId="signup"
        steps={steps}
        onCompletion={onCompletion}
      />
    </SplitScreen>
  );
}
