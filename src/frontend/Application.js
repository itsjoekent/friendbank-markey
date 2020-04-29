import React from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { ApplicationContext } from './ApplicationContext';
import GlobalStyle from './GlobalStyle';
import Nav from './components/Nav';
import ErrorPage from './pages/Error';
import Homepage from './pages/Homepage';
import SignupPage from './pages/Signup';
import theme from './theme';

function reducer(state, action) {
  return state;
}

export default function Application(props) {
  const [state, dispatch] = React.useReducer(reducer, props);

  const contextValue = {
    ...state,
    dispatch,
  };

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <ApplicationContext.Provider value={contextValue}>
          <GlobalStyle />
          <Nav />
          {(!state || !state.pageType || state.pageType === 'error') && <ErrorPage />}
          {(state.pageType === 'notfound') && <ErrorPage is404 />}
          {(state.pageType === 'homepage') && <Homepage />}
          {(state.pageType === 'signup') && <SignupPage />}
        </ApplicationContext.Provider>
      </ThemeProvider>
    </React.Fragment>
  );
}
