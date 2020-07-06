import React from 'react';
import loadable from '@loadable/component';
import UrlPattern from 'url-pattern';
import _404 from './pages/_404';
import {
  HOMEPAGE_ROUTE,
  SIGNUP_ROUTE,
  EDIT_PAGE_ROUTE,
  LOGIN_ROUTE,
  CREATE_ACCOUNT_ROUTE,
  FORGOT_PASSWORD_ROUTE,
  RESET_PASSWORD_ROUTE,
  DASHBOARD_ROUTE,
  PHONEBANK_FORM_ROUTE,
} from './routes';
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
    Homepage,
  ],
  [
    LOGIN_ROUTE,
    Login,
  ],
  [
    CREATE_ACCOUNT_ROUTE,
    CreateAccount,
  ],
  [
    FORGOT_PASSWORD_ROUTE,
    ForgotPassword,
  ],
  [
    RESET_PASSWORD_ROUTE,
    ResetPassword,
  ],
  [
    DASHBOARD_ROUTE,
    Dashboard,
  ],
  [
    PHONEBANK_FORM_ROUTE,
    PhonebankForm,
  ],
  [
    EDIT_PAGE_ROUTE,
    EditPage,
  ],
  [
    SIGNUP_ROUTE,
    Signup,
  ],
];

export default function router(path) {
  const match = PAGE_MAP.reduce((match, page) => {
    if (match) return match;

    const [route, Component] = page;

    const pattern = new UrlPattern(removeTrailingSlash(route));
    const patternMatch = pattern.match(removeTrailingSlash(path));

    if (!!patternMatch) {
      return [patternMatch, route, Component];
    }

    const spanishPattern = new UrlPattern(removeTrailingSlash(`${SPANISH_PREFIX}${route}`));
    const spanishPatternMatch = spanishPattern.match(removeTrailingSlash(path));

    if (!!spanishPatternMatch) {
      return [spanishPatternMatch, route, Component];
    }

    return null;
  }, null);

  // TODO: Return 404 page
  return match || [null, null, _404];
}
