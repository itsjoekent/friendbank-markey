import React from 'react';
import UrlPattern from 'url-pattern';
import ErrorPage from './pages/Error';
import Homepage, { HOMEPAGE_ROUTE } from './pages/Homepage';
import Signup, { getSignupInitialProps, SIGNUP_ROUTE } from './pages/Signup';
import EditPage, { getEditPageInitialProps, EDIT_PAGE_ROUTE } from './pages/EditPage';
import Login, { LOGIN_ROUTE } from './pages/Login';
import CreateAccount, { CREATE_ACCOUNT_ROUTE } from './pages/CreateAccount';
import Dashboard, { DASHBOARD_ROUTE } from './pages/Dashboard';
import PhonebankForm, { PHONEBANK_FORM_ROUTE } from './pages/PhonebankForm';
import { SPANISH_PREFIX } from '../shared/lang';

function removeTrailingSlash(from) {
  return from.replace(/^(.+?)\/*?$/, '$1');
}

const PAGE_MAP = [
  [
    HOMEPAGE_ROUTE,
    null,
    Homepage,
  ],
  [
    LOGIN_ROUTE,
    null,
    Login,
  ],
  [
    CREATE_ACCOUNT_ROUTE,
    null,
    CreateAccount,
  ],
  [
    DASHBOARD_ROUTE,
    null,
    Dashboard,
  ],
  [
    PHONEBANK_FORM_ROUTE,
    null,
    PhonebankForm,
  ],
  [
    EDIT_PAGE_ROUTE,
    getEditPageInitialProps,
    EditPage,
  ],
  [
    SIGNUP_ROUTE,
    getSignupInitialProps,
    Signup,
  ],
];

export default function router(path) {
  const match = PAGE_MAP.reduce((match, page) => {
    if (match) return match;

    const [route, getProps, Component] = page;

    const pattern = new UrlPattern(removeTrailingSlash(route));
    const patternMatch = pattern.match(removeTrailingSlash(path));

    if (!!patternMatch) {
      return [patternMatch, getProps, Component];
    }

    const spanishPattern = new UrlPattern(removeTrailingSlash(`${SPANISH_PREFIX}${route}`));
    const spanishPatternMatch = spanishPattern.match(removeTrailingSlash(path));

    if (!!spanishPatternMatch) {
      return [spanishPatternMatch, getProps, Component];
    }

    return null;
  }, null);

  // TODO: Return 404 page
  return match || [null, () => {}, React.Fragment];
}
