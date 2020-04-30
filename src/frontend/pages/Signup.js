import React from 'react';
import styled from 'styled-components';
import copy from '../../copy';
import { useApplicationContext } from '../ApplicationContext';
import { RedButton } from '../components/Buttons';
import { DefaultTitle, DefaultParagraph } from '../components/Typography';
import CommitteeDisclaimer, { DisclaimerWrapper } from '../components/CommitteeDisclaimer';
import SplitScreen from '../components/SplitScreen';
import Modal from '../components/Modal';
import Form from '../components/Form';
import ShareWidget, { DARK_THEME, ShareContainer } from '../components/ShareWidget';
import backgrounds from '../../backgrounds';
import signupStepOneFields from '../forms/signupStepOneFields';
import signupStepTwoFields from '../forms/signupStepTwoFields';

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
      try {
        const response = await fetch(`/api/v1/page/${code.toLowerCase()}/signup/${index}`, {
          method: 'post',
          body: JSON.stringify(formValues),
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

    return onStepSubmit;
  }

  function onCompletion(formValues) {
    setHasReachedEnd(true);
  }

  const steps = [
    {
      title: title,
      subtitle: subtitle,
      buttonCopy: copy.signupPage.stepOneButtonLabel,
      fields: [...signupStepOneFields],
      showSmsDisclaimer: true,
      onStepSubmit: onStepSubmitGenerator(1),
    },
    {
      title: title,
      subtitle: subtitle,
      buttonCopy: copy.signupPage.stepTwoButtonLabel,
      fields: [...signupStepTwoFields],
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
          modalTitle={copy.signupPage.modalTitle}
          modalCopy={copy.signupPage.modalCopy.join('\n')}
          modalCloseLabel={copy.signupPage.modalCloseLabel}
          customShareText={subtitle}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <SplitScreen media={backgrounds[background]}>
        <DisclaimerWrapper>
          {hasReachedEnd && (
            <PostSignupContainer>
              <DefaultTitle>
                {copy.signupPage.postSignupTitle}
              </DefaultTitle>
              <DefaultParagraph>
                {copy.signupPage.postSignupSubtitle.replace('{{FIRST_NAME}}', createdByFirstName)}
              </DefaultParagraph>
              <ShareWidget
                theme={DARK_THEME}
                customShareText={subtitle}
              />
              <DefaultTitle>
                {copy.signupPage.postSignupCreateTitle}
              </DefaultTitle>
              <DefaultParagraph>
                {copy.signupPage.postSignupCreateSubtitle}
              </DefaultParagraph>
              <RedButton as="a" href="/" data-track="create-my-own">
                {copy.signupPage.postSignupCreateButtonLabel}
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
