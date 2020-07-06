import React from 'react';
import loadable from '@loadable/component';
import UrlPattern from 'url-pattern';
import _404 from './pages/_404';
import { HOMEPAGE_ROUTE, getHomepageInitialProps } from './pages/Homepage';
import { SIGNUP_ROUTE, getSignupInitialProps } from './pages/Signup';
import { EDIT_PAGE_ROUTE, getEditPageInitialProps } from './pages/EditPage';
import { LOGIN_ROUTE } from './pages/Login';
import { CREATE_ACCOUNT_ROUTE } from './pages/CreateAccount';
import { FORGOT_PASSWORD_ROUTE } from './pages/ForgotPassword';
import { RESET_PASSWORD_ROUTE } from './pages/ResetPassword';
import { DASHBOARD_ROUTE } from './pages/Dashboard';
import { PHONEBANK_FORM_ROUTE } from './pages/PhonebankForm';
import { SPANISH_PREFIX } from '../shared/lang';

const Homepage = loadable(() => import('./pages/Homepage'));
const Login = loadable(() => import('./pages/Login'));
const CreateAccount = loadable(() => import('./pages/CreateAccount'));
const ForgotPassword = loadable(() => import('./pages/ForgotPassword'));
const ResetPassword = loadable(() => import('./pages/ResetPassword'));
const Dashboard = loadable(() => import('./pages/Dashboard'));
const PhonebankForm = loadable(() => import('./pages/PhonebankForm'));
const EditPage = loadable(() => import('./pages/EditPage'));
const Signup = loadable(() => import('./pages/Signup'));

function removeTrailingSlash(from) {
  return from.replace(/^(.+?)\/*?$/, '$1');
}

const PAGE_MAP = [
  [
    HOMEPAGE_ROUTE,
    getHomepageInitialProps,
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
    FORGOT_PASSWORD_ROUTE,
    null,
    ForgotPassword,
  ],
  [
    RESET_PASSWORD_ROUTE,
    null,
    ResetPassword,
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
  return match || [null, () => {}, _404];
}
