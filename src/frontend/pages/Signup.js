import React from 'react';
import styled from 'styled-components';
import getCopy from '../utils/getCopy';
import { useApplicationContext } from '../ApplicationContext';
import { RedButton } from '../components/Buttons';
import { DefaultTitle, DefaultParagraph } from '../components/Typography';
import CommitteeDisclaimer, { DisclaimerWrapper } from '../components/CommitteeDisclaimer';
import SplitScreen from '../components/SplitScreen';
import Modal from '../components/Modal';
import Form from '../components/Form';
import ShareWidget, { DARK_THEME, ShareContainer } from '../components/ShareWidget';
import backgrounds from '../../shared/backgrounds';
import signupContactFields from '../forms/signupContactFields';
import signupIdFields from '../forms/signupIdFields';
import makeLocaleLink from '../utils/makeLocaleLink';
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
  const {
    page: {
      code,
      title,
      subtitle,
      background,
      createdByFirstName,
    },
  } = useApplicationContext();

  const [hasReachedEnd, setHasReachedEnd] = React.useState(false);

  function onStepSubmitGenerator(index) {
    async function onStepSubmit(formValues) {
      return await makeFormApiRequest(`/api/v1/page/${code.toLowerCase()}/signup/${index}`, formValues);
    }

    return onStepSubmit;
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
      onStepSubmit: onStepSubmitGenerator(1),
    },
    {
      title: title,
      subtitle: subtitle,
      buttonCopy: getCopy('signupPage.stepTwoButtonLabel'),
      fields: [...signupIdFields()],
      onStepSubmit: onStepSubmitGenerator(2),
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
      {isModalOpen && (
        <Modal
          modalTitle={getCopy('signupPage.modalTitle')}
          modalCopy={getCopy('signupPage.modalCopy').join('\n')}
          modalCloseLabel={getCopy('signupPage.modalCloseLabel')}
          customShareText={`${title} ${subtitle}`}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <SplitScreen media={backgrounds[background]}>
        <DisclaimerWrapper>
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
          <CommitteeDisclaimer />
        </DisclaimerWrapper>
      </SplitScreen>
    </React.Fragment>
  );
}
