import { ENGLISH, SPANISH, SPANISH_PREFIX } from './lang';

const copy = {
  formLabels: {
    shareCode: {
      [ENGLISH]: 'Share code',
    },
    shareCodeHelp: {
      [ENGLISH]: 'We suggest using a combination of your first + last name.',
    },
    shareCodeAvailable: {
      [ENGLISH]: 'This code is available',
    },
    shareCodeNotAvailable: {
      [ENGLISH]: 'This code is not available',
    },
    shareCodePending: {
      [ENGLISH]: 'Checking if this code is available',
    },
    title: {
      [ENGLISH]: 'Title',
    },
    subtitle: {
      [ENGLISH]: 'Share why you\'re #StickingWithEd',
    },
    background: {
      [ENGLISH]: 'Background',
    },
    firstName: {
      [ENGLISH]: 'First name',
    },
    lastName: {
      [ENGLISH]: 'Last name',
    },
    zip:{
      [ENGLISH]: 'Zip',
    },
    phone:{
      [ENGLISH]: 'Phone',
    },
    email:{
      [ENGLISH]: 'Email',
    },
  },
  idQuestions: {
    support: {
      label: {
        [ENGLISH]: 'Will you vote to re-elect Ed Markey to the United States Senate on September 1st?',
      },
      options: {
        [ENGLISH]: [
          'Definitely',
          'Probably',
          'Undecided',
          'Probably not',
          'Definitely not',
          'Too Young/Ineligible to Vote',
        ],
      },
    },
    volunteer: {
      label: {
        [ENGLISH]: 'Will you volunteer with Team Markey?',
      },
      options: {
        [ENGLISH]: [
          'Yes',
          'Maybe',
          'Later',
          'No',
        ],
      },
    },
  },
  validations: {
    required: {
      [ENGLISH]: '*Required',
    },
    nameLength: {
      [ENGLISH]: 'Must be less than 50 chars.',
    },
    zipFormat: {
      [ENGLISH]: 'Invalid zip',
    },
    phoneFormat: {
      [ENGLISH]: 'Invalid phone number',
    },
    emailFormat: {
      [ENGLISH]: 'Invalid email',
    },
    codeLength: {
      [ENGLISH]: 'Must be less than 50 chars.',
    },
    codeFormat: {
      [ENGLISH]: 'Can only contain letters, numbers, dashes & underscores.',
    },
  },
  homepage: {
    formTitle: {
      [ENGLISH]: 'Create your own Ed Markey supporter page',
    },
    formSubtitle: {
      [ENGLISH]: 'Our grassroots campaign is powered by people like you who are connecting with family, friends, and neighbors about this important election. Complete the sections below to create your own personal supporter page and reach out to your network about why you’re a member of Team Markey!',
    },
    customizeTitle: {
      [ENGLISH]: 'Customize your page',
    },
    customizeSubtitle: {
      [ENGLISH]: `Fill out the sections below to personalize the title, description, and design of your supporter page to tell your network why you’re #StickingWithEd. Share your story of why you’re a member of this movement -- feel free to get creative!`,
    },
    formButtonLabel: {
      [ENGLISH]: 'next',
    },
    createButtonLabel: {
      [ENGLISH]: 'create page',
    },
    defaultSubtitle: {
      [ENGLISH]: 'Ed comes from a working family, and he’s fighting from the heart for the working class. Ed is running a people-powered campaign, and it’s up to us to help make sure he can keep fighting in the Senate for our shared progressive values. Let me know that you are with me, and help me reach my goal!',
    },
    defaultTitle: {
      [ENGLISH]: `{{FIRST_NAME}} is #StickingWithEd because...`,
    },
  },
  signupPage: {
    stepOneButtonLabel: {
      [ENGLISH]: 'Next',
    },
    stepTwoButtonLabel: {
      [ENGLISH]: 'Submit',
    },
    postSignupTitle: {
      [ENGLISH]: 'Thank you!',
    },
    postSignupSubtitle: {
      [ENGLISH]: 'Next, keep up the momentum by sharing this link with your friends, family, and network, and help {{FIRST_NAME}} reach their goal! Or, make your own page and get everyone you know to join the fight.',
    },
    postSignupCreateTitle: {
      [ENGLISH]: 'Make your own page',
    },
    postSignupCreateSubtitle: {
      [ENGLISH]: 'Create your own supporter page and become a grassroots organizer for Ed. We’ll show you how!',
    },
    postSignupCreateButtonLabel: {
      [ENGLISH]: 'Get started',
    },
    modalTitle: {
      [ENGLISH]: `Here's how you can join ed's fight`,
    },
    modalCopy: {
      [ENGLISH]: [
        `### Send your link far and wide`,
        `Share this page with your network to help us grow Team Markey! Your friends, family, neighbors, colleagues, roommates, classmates, Facebook friends, Twitter peeps, your Zoom hangout friends -- the sky's the limit, and we need to reach everyone.`,
        `### Relational organizing tips`,
        ` - Call 5 friends and ask them to fill out your link`,
        ` - Email your link to 50 people`,
        ` - Share it on your Facebook and other social media`,
        ` - Go through your contact list in your phone and text the link to at least 10 people!`,
        ' ',
        `### Volunteer with Team Markey`,
        `[Join the movement here](http://edmarkey.com/volunteer).`,
      ],
    },
    modalCloseLabel: {
      [ENGLISH]: 'Okay, got it',
    },
  },
  nav: {
    logoAlt: {
      [ENGLISH]: 'Ed Markey For Senate Logo',
    },
    return: {
      [ENGLISH]: 'return to edmarkey.com',
    },
    returnLink: {
      [ENGLISH]: 'https://www.edmarkey.com/',
    },
    donate: {
      [ENGLISH]: 'donate',
    },
    donateForm: {
      [ENGLISH]: 'https://secure.actblue.com/donate/ejm2020',
    },
  },
  share: {
    facebook: {
      [ENGLISH]: 'Share on Facebook',
    },
    twitter: {
      [ENGLISH]: 'Share on Twitter',
    },
    email: {
      [ENGLISH]: 'Share via email',
    },
    link: {
      [ENGLISH]: 'copy link',
    },
  },
  genericError: {
    [ENGLISH]: 'Looks like we had an error, try again? If this continues to happen, please contact us https://www.edmarkey.com/contact-us/',
  },
  politicalDiclaimer: {
    [ENGLISH]: 'PAID FOR BY THE MARKEY COMMITTEE',
  },
  smsDisclaimer: {
    [ENGLISH]: 'By providing your cell phone number you consent to receive periodic campaign updates from the Markey Committee. Text HELP for help, STOP to end. Message & data rates may apply. https://www.edmarkey.com/privacy-policy/',
  },
};

export default function getCopy(path, defaultToEnglish = true, fallback = '') {
  const language = typeof location === 'undefined'
    ? ENGLISH
    : location.pathname.startsWith(SPANISH_PREFIX) ? SPANISH : ENGLISH;

  let value = { ...copy };

  for (const key of path.split('.')) {
     if (! value[key]) {
       return fallback;
     }

     value = { ...value[key] };
  }

  return value[language] || (defaultToEnglish && value[ENGLISH]) || fallback;
}
