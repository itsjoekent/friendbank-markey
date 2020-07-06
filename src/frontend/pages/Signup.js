import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import _404 from './_404';
import { useApplicationContext } from '../ApplicationContext';
import { RedButton } from '../components/Buttons';
import { DefaultTitle, DefaultParagraph } from '../components/Typography';
import SplitScreen from '../components/SplitScreen';
import Modal from '../components/Modal';
import Form from '../components/Form';
import ShareWidget, { DARK_THEME, ShareContainer } from '../components/ShareWidget';
import signupContactFields from '../forms/signupContactFields';
import signupIdFields from '../forms/signupIdFields';
import makeLocaleLink from '../utils/makeLocaleLink';
import getCopy from '../utils/getCopy';
import makeFormApiRequest from '../utils/makeFormApiRequest';

const PostSignupContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${DefaultTitle} {
    margin-bottom: 12px;
  }

  ${DefaultParagraph} {
    margin-bottom: 24px;
  }

  ${ShareContainer} {
    margin-bottom: 24px;
  }

  ${RedButton} {
    width: fit-content;
  }
`;

export default function Signup() {
  const context = useApplicationContext();

  if (!context.page) {
    return <_404 />;
  }

  const {
    page: {
      code,
      title,
      subtitle,
      background,
      createdByFirstName,
      media,
    },
  } = context;

  const [hasReachedEnd, setHasReachedEnd] = React.useState(false);

  async function onStepSubmit(formValues) {
    return await makeFormApiRequest('/api/v1/signup', 'post', { ...formValues, code });
  }

  function onCompletion(formValues) {
    setHasReachedEnd(true);
  }

  const steps = [
    {
      title: title,
      subtitle: subtitle,
      buttonCopy: getCopy('signupPage.stepOneButtonLabel'),
      fields: [...signupContactFields()],
      showSmsDisclaimer: true,
      onStepSubmit: onStepSubmit,
    },
    {
      title: title,
      subtitle: subtitle,
      buttonCopy: getCopy('signupPage.stepTwoButtonLabel'),
      fields: [...signupIdFields()],
      onStepSubmit: onStepSubmit,
    },
  ];

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    const isNew = sessionStorage.getItem(`${code}-new`);

    if (isNew) {
      sessionStorage.removeItem(`${code}-new`);
      setIsModalOpen(true);
    }
  }, []);

  return (
    <React.Fragment>
      <Helmet>
        <title>{title}</title>
        <meta name="og:title" content={title} />
        <meta property="og:description" content={subtitle} />
        <meta property="og:image" content={media.source} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={subtitle} />
      </Helmet>
      {isModalOpen && (
        <Modal
          modalTitle={getCopy('signupPage.modalTitle')}
          modalCopy={getCopy('signupPage.modalCopy').join('\n')}
          modalCloseLabel={getCopy('signupPage.modalCloseLabel')}
          customShareText={`${title} ${subtitle}`}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <SplitScreen media={media}>
        {hasReachedEnd && (
          <PostSignupContainer>
            <DefaultTitle>
              {getCopy('signupPage.postSignupTitle')}
            </DefaultTitle>
            <DefaultParagraph>
              {getCopy('signupPage.postSignupSubtitle').replace('{{FIRST_NAME}}', createdByFirstName)}
            </DefaultParagraph>
            <ShareWidget
              theme={DARK_THEME}
              customShareText={`${title} ${subtitle}`}
            />
            <DefaultTitle>
              {getCopy('signupPage.postSignupCreateTitle')}
            </DefaultTitle>
            <DefaultParagraph>
              {getCopy('signupPage.postSignupCreateSubtitle')}
            </DefaultParagraph>
            <RedButton as="a" href={makeLocaleLink("/")} data-track="create-my-own">
              {getCopy('signupPage.postSignupCreateButtonLabel')}
            </RedButton>
          </PostSignupContainer>
        )}
        {!hasReachedEnd && (
          <Form
            formId="signup"
            steps={steps}
            onCompletion={onCompletion}
          />
        )}
      </SplitScreen>
    </React.Fragment>
  );
}
