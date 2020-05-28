import React from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { ApplicationContext } from './ApplicationContext';
import GlobalStyle from './GlobalStyle';
import Nav from './components/Nav';
import CommitteeDisclaimer from './components/CommitteeDisclaimer';
import ErrorPage from './pages/Error';
import Homepage from './pages/Homepage';
import SignupPage from './pages/Signup';
import theme from './theme';
import router from './router';

const Chrome = styled.div`
  display: block;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.chrome};
`;

const PageContainer = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.max.site};
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 24px;

  @media ${({ theme }) => theme.media.tablet} {
    padding-left: 24px;
    padding-right: 24px;
  }
`;

function reducer(state, action) {
  return action(state);
}

export default function Application(props) {
  const initialState = { ...props };
  if (!initialState.PageComponent) {
    initialState.PageComponent = router(location.pathname).pop();
  }

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const contextValue = {
    ...state,
    dispatch,
  };

  const { PageComponent } = state;

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <ApplicationContext.Provider value={contextValue}>
          <GlobalStyle />
          <Chrome>
            <PageContainer>
              <Nav />
              <PageComponent />
              {/* {(!state || !state.pageType || state.pageType === 'error') && <ErrorPage />}
              {(state.pageType === 'notfound') && <ErrorPage is404 />}
              {(state.pageType === 'homepage') && <Homepage />}
              {(state.pageType === 'signup') && <SignupPage />} */}
              <CommitteeDisclaimer />
            </PageContainer>
          </Chrome>
        </ApplicationContext.Provider>
      </ThemeProvider>
    </React.Fragment>
  );
}
