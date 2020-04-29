import React from 'react';
import styled from 'styled-components';
import SplitScreen from '../components/SplitScreen';
import Form from '../components/Form';
import backgrounds from '../../backgrounds';
import {
  SINGLE_LINE_TEXT_INPUT,
} from '../components/FormFields';
import {
  validateName,
  validateZip,
  validatePhone,
} from '../utils/fieldValidations';

export default function Homepage() {
  const steps = [
    {
      title: 'make your own ed markey support page',
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
      buttonCopy: 'Next',
      fields: [
        {
          fieldId: 'firstName',
          fieldType: SINGLE_LINE_TEXT_INPUT,
          label: 'First name',
          isHalfWidth: true,
          validator: validateName,
        },
        {
          fieldId: 'lastName',
          fieldType: SINGLE_LINE_TEXT_INPUT,
          label: 'Last name',
          isHalfWidth: true,
          validator: validateName,
        },
        {
          fieldId: 'zip',
          fieldType: SINGLE_LINE_TEXT_INPUT,
          label: 'Zip',
          isHalfWidth: true,
          validator: validateZip,
        },
        {
          fieldId: 'phone',
          fieldType: SINGLE_LINE_TEXT_INPUT,
          label: 'Phone',
          isHalfWidth: true,
          validator: validatePhone,
        },
      ],
    },
    {
      title: 'make your own ed markey support page',
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
      buttonCopy: 'Next',
      fields: [
        {
          fieldId: 'firstName',
          fieldType: SINGLE_LINE_TEXT_INPUT,
          label: 'First name',
          isHalfWidth: true,
          validator: validateName,
        },
        {
          fieldId: 'lastName',
          fieldType: SINGLE_LINE_TEXT_INPUT,
          label: 'Last name',
          isHalfWidth: true,
          validator: validateName,
        },
        {
          fieldId: 'zip',
          fieldType: SINGLE_LINE_TEXT_INPUT,
          label: 'Zip',
          isHalfWidth: true,
          validator: validateZip,
        },
        {
          fieldId: 'phone',
          fieldType: SINGLE_LINE_TEXT_INPUT,
          label: 'Phone',
          isHalfWidth: true,
          validator: validatePhone,
        },
      ],
    },    
  ];

  return (
    <SplitScreen media={backgrounds.default}>
      <Form formId="create" steps={steps} />
    </SplitScreen>
  );
}
