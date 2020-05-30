import React from 'react';
import styled from 'styled-components';
import { useApplicationContext } from '../ApplicationContext';
import getCopy from '../utils/getCopy';
import StandardHelmet from '../components/StandardHelmet';
import SplitScreen from '../components/SplitScreen';
import Form from '../components/Form';
import useAuthGate from '../hooks/useAuthGate';
import makeFormApiRequest from '../utils/makeFormApiRequest';
import makeLocaleLink from '../utils/makeLocaleLink';
import backgrounds from '../../shared/backgrounds';
import normalizePageCode from '../../shared/normalizePageCode';
import {
  SINGLE_LINE_TEXT_INPUT,
  MULTI_LINE_TEXT_INPUT,
  GALLERY_PICKER,
} from '../components/FormFields';
import {
  validateTitle,
  validateSubtitle,
  validateBackground,
} from '../../shared/fieldValidations';

export const EDIT_PAGE_ROUTE = '/:code/edit';

export async function getEditPageInitialProps({
  routeMatch,
  db,
  ObjectId,
  campaign,
}) {
  try {
    const { code } = routeMatch;
    const normalizedCode = normalizePageCode(code);

    const campaignId = campaign._id.toString();

    const pages = db.collection('pages');

    const page = await pages.findOne({
      code: normalizedCode,
      campaign: campaignId,
    });

    if (!page) {
      return {};
    }

    const {
      title,
      subtitle,
      background,
    } = page;

    return {
      page: {
        code: normalizedCode,
        title,
        subtitle,
        background,
      },
    };
  } catch (error) {
    return error;
  }
}

export default function EditPage() {
  useAuthGate();

  const context = useApplicationContext();

  if (!context.page) {
    // TODO: return 404
    return null;
  }

  const {
    page: {
      code,
      title,
      subtitle,
      background,
    },
  } = context;

  async function onPageSubmit(formValues) {
    return await makeFormApiRequest(`/api/v1/page/${code}`, 'put', formValues);
  }

  async function onCompletion() {
    window.location.href = makeLocaleLink(`/${code}`);
  }

  const steps = [
    {
      title: getCopy('homepage.customizeTitle'),
      subtitle: getCopy('homepage.customizeSubtitle'),
      buttonCopy: getCopy('formLabels.submit'),
      onStepSubmit: onPageSubmit,
      fields: [
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
          options: Object.keys(backgrounds).map((key) => ({
            name: key,
            src: backgrounds[key].source,
            alt: backgrounds[key].alt,
          })),
        },
      ],
    },
  ];

  return (
    <SplitScreen media={backgrounds[background]}>
      <StandardHelmet />
      <Form
        formId="edit"
        initialFieldValues={{ title, subtitle, background }}
        steps={steps}
        onCompletion={onCompletion}
      />
    </SplitScreen>
  );
}
