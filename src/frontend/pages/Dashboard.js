import React from 'react';
import styled, { css } from 'styled-components';
import StandardHelmet from '../components/StandardHelmet';
import LoadingSpinner from '../components/LoadingSpinner';
import SignupsTable from '../components/SignupsTable';
import { DarkBlueButton } from '../components/Buttons';
import Form, { FormContainer, FormTitleContainer } from '../components/Form';
import {
  SINGLE_LINE_TEXT_INPUT,
  PASSWORD_INPUT,
  RADIO_FIELD,
} from '../components/FormFields';
import useAuthGate from '../hooks/useAuthGate';
import getCopy from '../utils/getCopy';
import share from '../utils/share';
import makeLocaleLink from '../utils/makeLocaleLink';
import makeApiRequest from '../utils/makeApiRequest';
import makeFormApiRequest from '../utils/makeFormApiRequest';
import { removeAuthToken } from '../utils/auth';
import { HOMEPAGE_ROUTE, EDIT_PAGE_ROUTE } from '../routes';
import {
  validateName,
  validateZip,
  validateEmail,
  validatePassword,
  validateRequired,
} from '../../shared/fieldValidations';
import {
  TRANSACTIONAL_EMAIL,
  UNSUBSCRIBED,
} from '../../shared/emailFrequency';

export const DASHBOARD_ROUTE = '/friendbank/dashboard';

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 48px;

  @media ${({ theme }) => theme.media.tablet} {
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
  }
`;

const Card = styled.div`
  width: 100%;
  box-shadow: ${({ theme }) => theme.shadow};
  background: ${({ theme }) => theme.colors.white};
  margin-bottom: 24px;

  min-height: 200px;
`;

const ProfileCard = styled(Card)`
  order: 3;

  ${FormContainer} {
    margin-bottom: 48px;
  }

  ${FormTitleContainer} {
    margin-bottom: 0;
  }

  @media ${({ theme }) => theme.media.tablet} {
    order: initial;
    width: 50%;
    margin-right: 24px;
  }

  @media ${({ theme }) => theme.media.desktop} {
    width: 33.33%;
    margin-right: 24px;
  }
`;

const SignupsCard = styled(Card)`
  position: relative;
  margin-top: 24px;

  @media ${({ theme }) => theme.media.tablet} {
    margin-top: 0;
  }
`;

const SignupPagesCard = styled(Card)`
  height: fit-content;
  max-height: 800px;
  overflow-y: scroll;

  @media ${({ theme }) => theme.media.tablet} {
    width: calc(50% - 24px);
  }

  @media ${({ theme }) => theme.media.desktop} {
    width: calc(66.66% - 24px);
  }
`;

const CardGrid = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
`;

const CardHeader = styled.h1`
  font-family: ${({ theme }) => theme.fonts.headerFamily};
  font-weight: bold;
  font-size: 28px;
  line-height: 1.1;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.blue};
  padding: 16px 24px;
`;

const CardSubheader = styled.h2`
  font-family: ${({ theme }) => theme.fonts.headerFamily};
  font-weight: bold;
  font-size: 24px;
  line-height: 1.1;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: 16px;
`;

const SuccessMessage = styled.p`
  font-family: ${({ theme }) => theme.fonts.mainFamily};
  font-weight: normal;
  font-size: 18px;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.green};
`;

const LinkButton = styled.button`
  font-family: ${({ theme }) => theme.fonts.mainFamily};
  font-weight: normal;
  font-size: 18px;
  text-decoration: underline;
  text-align: right;
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.black};
  }
`;

const EditPageButton = styled(LinkButton)`
  color: ${({ theme }) => theme.colors.blue};
`;

const LogoutButton = styled(LinkButton)`
  color: ${({ theme }) => theme.colors.red};
`;

const SignupsHeaderRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;

  ${DarkBlueButton} {
    width: fit-content;
  }

  @media ${({ theme }) => theme.media.tablet} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    ${CardSubheader} {
      margin-bottom: 0;
    }
  }
`;

const LoadMoreRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  margin-top: 16px;
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 24px;
  box-shadow: ${({ theme }) => theme.shadow};

  @media ${({ theme }) => theme.media.tablet} {
    flex-direction: row-reverse;
  }
`;

const PageDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px;

  @media ${({ theme }) => theme.media.tablet} {
    width: 50%;
  }
`;

const PageDetailsFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ShareButtonIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  cursor: pointer;
  text-decoration: none;
  background: none;
  border: none;

  i {
    color: ${({ theme }) => theme.colors.blue};
    font-size: 24px;
  }

  &:hover {
    i {
      color: ${({ theme }) => theme.colors.black};
    }
  }
`;

const PageSubheader = styled.p`
  font-family: ${({ theme }) => theme.fonts.mainFamily};
  font-weight: normal;
  font-size: 18px;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.black};
`;

const PageCover = styled.div`
  display: block;
  width: 100%;
  height: 256px;
  position: relative;

  @media ${({ theme }) => theme.media.tablet} {
    height: auto;
    width: 50%;
  }
`;

const PageCoverImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

export default function Dashboard() {
  useAuthGate();

  const [profile, setProfile] = React.useState(null);
  const [successfullyUpdatedPassword, setSuccessfullyUpdatedPassword] = React.useState(false);

  const [signupPages, setSignupPages] = React.useState(null);
  const [totalSignupPages, setTotalSignupPages] = React.useState(0);
  const [requestedNextSignupPages, setRequestedNextSignupPages] = React.useState(true);

  React.useEffect(() => {
    let cancel = false;

    async function fetchProfile() {
      const { response, json } = await makeApiRequest('/api/v1/user', 'get');

      if (!cancel) {
        const { user } = json;

        const uiOptions = getCopy('dashboard.emailSubscriptionOptions');
        const apiOptions = [TRANSACTIONAL_EMAIL, UNSUBSCRIBED];

        setProfile({
          ...user,
          emailFrequency: uiOptions[apiOptions.indexOf(user.emailFrequency)],
        });
      }
    }

    if (!profile) {
      fetchProfile();
    }

    return () => { cancel = true };
  }, [profile, setProfile]);

  React.useEffect(() => {
    let cancel = false;

    async function fetchSignupPages() {
      const { response, json } = await makeApiRequest('/api/v1/user/pages', 'get');

      if (!cancel) {
        setRequestedNextSignupPages(false);

        if (json.pages) {
          setSignupPages((copy) => ([...(copy || []), ...json.pages]));
        }

        if (json.total !== totalSignupPages) {
          setTotalSignupPages(json.total);
        }
      }
    }

    if (requestedNextSignupPages) {
      fetchSignupPages();
    }

    return () => { cancel = true };
  }, [
    signupPages,
    setSignupPages,
    requestedNextSignupPages,
    setRequestedNextSignupPages,
  ]);

  async function onEditProfile(formValues) {
    const payload = Object.keys(profile).reduce((acc, key) => {
      if (profile[key] !== formValues[key]) {
        if (key === 'emailFrequency') {
          const uiOptions = getCopy('dashboard.emailSubscriptionOptions');
          const apiOptions = [TRANSACTIONAL_EMAIL, UNSUBSCRIBED];
          const subscriptionValue = apiOptions[uiOptions.indexOf(formValues[key])];

          return { ...acc, [key]: subscriptionValue };
        }

        return { ...acc, [key]: formValues[key] };
      }

      return acc;
    }, {});

    return await makeFormApiRequest('/api/v1/user', 'put', payload);
  }

  async function onEditPassword(formValues) {
    setSuccessfullyUpdatedPassword(false);

    const { password, passwordConfirmation } = formValues;

    if (password !== passwordConfirmation) {
      return [getCopy('validations.passwordMismatch'), null];
    }

    return await makeFormApiRequest('/api/v1/user', 'put', { password });
  }

  function onPasswordSuccessfullyChanged(formValues, setTargetStep, setFormValues) {
    setTargetStep(0);
    setFormValues({});
    setSuccessfullyUpdatedPassword(true);
  }

  function logout() {
    makeApiRequest('/api/v1/logout', 'post').then(() => {
      removeAuthToken();
      window.location.href = makeLocaleLink(`${HOMEPAGE_ROUTE}`);
    });
  }

  return (
    <Layout>
      <StandardHelmet />
      <SignupsCard>
        <SignupsTable />
      </SignupsCard>
      <ProfileCard>
        <CardHeader>
          {getCopy('dashboard.profileHeader')}
        </CardHeader>
        <CardGrid>
          <CardSubheader>
            {getCopy('dashboard.editProfileHeader')}
          </CardSubheader>
          <LoadingSpinner hasCompletedLoading={!!profile}>
            <Form
              formId="editProfile"
              initialFieldValues={profile}
              onCompletion={() => setProfile(null)}
              steps={[{
                onStepSubmit: onEditProfile,
                buttonCopy: getCopy('dashboard.editProfileButton'),
                fields: [
                  {
                    fieldId: 'email',
                    fieldType: SINGLE_LINE_TEXT_INPUT,
                    label: getCopy('formLabels.email'),
                    validator: validateEmail,
                  },
                  {
                    fieldId: 'firstName',
                    fieldType: SINGLE_LINE_TEXT_INPUT,
                    isHalfWidth: true,
                    label: getCopy('formLabels.firstName'),
                    validator: validateName,
                  },
                  {
                    fieldId: 'zip',
                    fieldType: SINGLE_LINE_TEXT_INPUT,
                    isHalfWidth: true,
                    label: getCopy('formLabels.zip'),
                    validator: validateZip,
                  },
                  {
                    fieldId: 'emailFrequency',
                    fieldType: RADIO_FIELD,
                    label: getCopy('dashboard.emailSubscriptionLabel'),
                    validator: validateRequired,
                    options: getCopy('dashboard.emailSubscriptionOptions'),
                  },
                ],
              }]}
            />
          </LoadingSpinner>
          <CardSubheader>
            {getCopy('dashboard.editPasswordHeader')}
          </CardSubheader>
          {successfullyUpdatedPassword && (
            <SuccessMessage>
              {getCopy('dashboard.editPasswordSuccess')}
            </SuccessMessage>
          )}
          <Form
            formId="editPassword"
            onCompletion={onPasswordSuccessfullyChanged}
            steps={[{
              onStepSubmit: onEditPassword,
              buttonCopy: getCopy('dashboard.editPasswordButton'),
              fields: [
                {
                  fieldId: 'password',
                  fieldType: PASSWORD_INPUT,
                  label: getCopy('formLabels.password'),
                  validator: validatePassword,
                },
                {
                  fieldId: 'passwordConfirmation',
                  fieldType: PASSWORD_INPUT,
                  label: getCopy('formLabels.passwordConfirmation'),
                  validator: validatePassword,
                },
              ],
            }]}
          />
          <LogoutButton onClick={logout}>
            {getCopy('dashboard.logoutLabel')}
          </LogoutButton>
        </CardGrid>
      </ProfileCard>
      <SignupPagesCard>
        <CardHeader>
          {getCopy('dashboard.signupPagesHeader')}
        </CardHeader>
        <CardGrid>
          <LoadingSpinner hasCompletedLoading={!!signupPages}>
            {signupPages && signupPages.map((page) => {
              const {
                facebookLink,
                twitterLink,
                emailLink,
                onCopy,
              } = share(page.title, makeLocaleLink(`/${page.code}`));

              const editRoute = makeLocaleLink(EDIT_PAGE_ROUTE.replace(':code', page.code));

              return (
                <PageContainer key={page.code}>
                  <PageCover>
                    <PageCoverImage src={page.media.source} />
                  </PageCover>
                  <PageDetails>
                    <div>
                      <CardSubheader>{page.title}</CardSubheader>
                      <PageSubheader>{page.subtitle}</PageSubheader>
                    </div>
                    <PageDetailsFooter>
                      <EditPageButton as="a" href={editRoute}>
                        {getCopy('dashboard.editPageButton')}
                      </EditPageButton>
                      <PageDetailsFooter>
                        <ShareButtonIcon href={facebookLink} target="_blank" rel="noopener noreferrer">
                          <i className="fab fa-facebook-square fa-lg" />
                        </ShareButtonIcon>
                        <ShareButtonIcon href={twitterLink} target="_blank" rel="noopener noreferrer">
                          <i className="fab fa-twitter-square fa-lg" />
                        </ShareButtonIcon>
                        <ShareButtonIcon href={emailLink} target="_blank" rel="noopener noreferrer">
                          <i className="fas fa-envelope-square fa-lg" />
                        </ShareButtonIcon>
                        <ShareButtonIcon as="button" onClick={onCopy}>
                          <i className="fas fa-copy fa-lg" />
                        </ShareButtonIcon>
                      </PageDetailsFooter>
                    </PageDetailsFooter>
                  </PageDetails>
                </PageContainer>
              );
            })}
            {signupPages && signupPages.length < totalSignupPages && (
              <LoadMoreRow>
                <DarkBlueButton onClick={() => setRequestedNextSignupPages(true)}>
                  {getCopy('dashboard.loadMore')}
                </DarkBlueButton>
              </LoadMoreRow>
            )}
          </LoadingSpinner>
        </CardGrid>
      </SignupPagesCard>
    </Layout>
  );
}
