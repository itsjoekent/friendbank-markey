import React from 'react';
import { Helmet } from 'react-helmet';
import getCopy from '../utils/getCopy';
import backgrounds from '../../shared/backgrounds';

export default function StandardHelmet() {
  return (
    <Helmet>
      <title>{getCopy('homepage.formTitle')}</title>
      <meta name="og:title" content={getCopy('homepage.formTitle')} />
      <meta property="og:description" content={getCopy('homepage.formSubtitle')} />
      <meta property="og:image" content={backgrounds['ed-climate-march'].source} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={getCopy('homepage.formTitle')} />
      <meta property="twitter:description" content={getCopy('homepage.formSubtitle')} />
    </Helmet>
  );
}
