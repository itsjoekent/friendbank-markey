import React from 'react';
import styled from 'styled-components';
import _404 from './_404';
import { useApplicationContext } from '../ApplicationContext';
import getCopy from '../utils/getCopy';
import StandardHelmet from '../components/StandardHelmet';
import SplitScreen from '../components/SplitScreen';
import Form from '../components/Form';
import useAuthGate from '../hooks/useAuthGate';
import useGetUserRole from '../hooks/useGetUserRole';
import makeFormApiRequest from '../utils/makeFormApiRequest';
import makeLocaleLink from '../utils/makeLocaleLink';
import normalizePageCode from '../../shared/normalizePageCode';
import {
  SINGLE_LINE_TEXT_INPUT,
  MULTI_LINE_TEXT_INPUT,
  GALLERY_PICKER,
  MEDIA_UPLOAD,
} from '../components/FormFields';
import { STAFF_ROLE } from '../../shared/roles';
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

    const config = JSON.parse(campaign.config);

    const mediaCollection = db.collection('media');
    const campaignMedia = await mediaCollection
      .find({ _id: { '$in': config.media } })
      .toArray();

    const pageMedia = await mediaCollection.findOne({ _id: background });

    return {
      page: {
        code: normalizedCode,
        title,
        subtitle,
        background,
        media: pageMedia,
      },
      campaignMedia,
    };
  } catch (error) {
    return error;
  }
}

export default function EditPage() {
  useAuthGate();

  const context = useApplicationContext();
  const role = useGetUserRole();

  if (!context.page) {
    return <_404 />;
  }

  const {
    page: {
      code,
      title,
      subtitle,
      media,
    },
    campaignMedia,
  } = context;

  async function onPageSubmit(formValues) {
    return await makeFormApiRequest(`/api/v1/page/${code}`, 'put', formValues);
  }

  async function onCompletion() {
    window.location.href = makeLocaleLink(`/${code}`);
  }

  const mediaOptions = [...campaignMedia];

  if (!mediaOptions.find((compare) => compare._id === media._id)) {
    mediaOptions.push(media);
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
          defaultValue: title || getCopy('homepage.defaultTitle'),
          validator: validateTitle,
        },
        {
          fieldId: 'subtitle',
          fieldType: MULTI_LINE_TEXT_INPUT,
          label: getCopy('formLabels.subtitle'),
          defaultValue: subtitle || getCopy('homepage.defaultSubtitle'),
          validator: validateSubtitle,
        },
        {
          fieldId: 'background',
          fieldType: GALLERY_PICKER,
          label: getCopy('formLabels.background'),
          validator: validateBackground,
          options: mediaOptions.map((item) => ({
            name: item._id,
            src: item.source,
            alt: item.alt,
          })),
        },
      ],
    },
  ];

  if (role === STAFF_ROLE) {
    steps[0].fields.push({
      fieldId: 'customBackground',
      fieldType: MEDIA_UPLOAD,
      label: getCopy('formLabels.customBackground'),
      set: 'background',
    });
  }

  return (
    <SplitScreen media={media}>
      <StandardHelmet />
      <Form
        formId="edit"
        initialFieldValues={{ title, subtitle, background: media._id }}
        steps={steps}
        onCompletion={onCompletion}
      />
    </SplitScreen>
  );
}
