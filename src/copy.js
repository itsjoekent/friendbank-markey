import { ENGLISH, SPANISH, SPANISH_PREFIX } from './lang';

const copy = {
  formLabels: {
    shareCode: {
      [ENGLISH]: 'Share code',
      [SPANISH]: 'Comparte el código',
    },
    shareCodeHelp: {
      [ENGLISH]: 'We suggest using a combination of your first + last name.',
      [SPANISH]: 'Sugerimos usar una combinación de tu nombre y apellido.',
    },
    shareCodeAvailable: {
      [ENGLISH]: 'This code is available',
      [SPANISH]: 'Este código está disponible',
    },
    shareCodeNotAvailable: {
      [ENGLISH]: 'This code is not available',
      [SPANISH]: 'Este código no está disponible',
    },
    shareCodePending: {
      [ENGLISH]: 'Checking if this code is available',
      [SPANISH]: 'Comprobando si este código está disponible',
    },
    title: {
      [ENGLISH]: 'Title',
      [SPANISH]: 'Título',
    },
    subtitle: {
      [ENGLISH]: 'Share why you\'re #StickingWithEd',
      [SPANISH]: 'Comparte por qué estás #ConEd',
    },
    background: {
      [ENGLISH]: 'Background',
      [SPANISH]: 'Trasfondo',
    },
    firstName: {
      [ENGLISH]: 'First name',
      [SPANISH]: 'Nombre',
    },
    lastName: {
      [ENGLISH]: 'Last name',
      [SPANISH]: 'Apellido',
    },
    zip:{
      [ENGLISH]: 'Zip',
      [SPANISH]: 'Código postal',
    },
    phone:{
      [ENGLISH]: 'Phone',
      [SPANISH]: 'Teléfono',
    },
    email:{
      [ENGLISH]: 'Email',
      [SPANISH]: 'Correo electrónico',
    },
  },
  idQuestions: {
    support: {
      label: {
        [ENGLISH]: 'Will you vote to re-elect Ed Markey to the United States Senate on September 1st?',
        [SPANISH]: '¿Votará para reelegir a Ed Markey al Senado de los Estados Unidos el 1 de septiembre?',
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
        [SPANISH]: [
          'Definitivamente',
          'Probablemente',
          'Indeciso',
          'Probablemente no',
          'Definitivamente no',
          'Demasiado joven/Inelegible para votar',
        ],
      },
    },
    volunteer: {
      label: {
        [ENGLISH]: 'Will you volunteer with Team Markey?',
        [SPANISH]: '¿Quiéres ser voluntario con el Equipo Markey?',
      },
      options: {
        [ENGLISH]: [
          'Yes',
          'Maybe',
          'Later',
          'No',
        ],
        [SPANISH]: [
          'Sí',
          'Tal vez',
          'Más tarde',
          'No',
        ],
      },
    },
  },
  validations: {
    required: {
      [ENGLISH]: '*Required',
      [SPANISH]: '*Requerido',
    },
    nameLength: {
      [ENGLISH]: 'Must be less than 50 chars.',
      [SPANISH]: 'Debe ser menos de 50 caracteres.',
    },
    zipFormat: {
      [ENGLISH]: 'Invalid zip',
      [SPANISH]: 'Código postal inválido',
    },
    phoneFormat: {
      [ENGLISH]: 'Invalid phone number',
      [SPANISH]: 'Número de teléfono inválido',
    },
    emailFormat: {
      [ENGLISH]: 'Invalid email',
      [SPANISH]: 'Correo electrónico inválido',
    },
    codeLength: {
      [ENGLISH]: 'Must be less than 50 chars.',
      [SPANISH]: 'Debe ser menos de 50 caracteres.',
    },
    codeFormat: {
      [ENGLISH]: 'Can only contain letters, numbers, dashes & underscores.',
      [SPANISH]: 'Sólo puede contener letras, números, guiones y guiones bajos.',
    },
  },
  homepage: {
    formTitle: {
      [ENGLISH]: 'Create your own Ed Markey supporter page',
      [SPANISH]: 'Crea tu propia página de apoyo para Ed Markey',
    },
    formSubtitle: {
      [ENGLISH]: 'Our grassroots campaign is powered by people like you who are connecting with family, friends, and neighbors about this important election. Complete the sections below to create your own personal supporter page and reach out to your network about why you’re a member of Team Markey!',
      [SPANISH]: 'Nuestra campaña está impulsada por gente como tú que se está conectando con familia, amigos y vecinos sobre esta elección importante. Completa las siguientes secciones para crear tu propia página de apoyo personal y hablarle a tus redes de por qué eres miembro del Equipo Markey!',
    },
    customizeTitle: {
      [ENGLISH]: 'Customize your page',
      [SPANISH]: 'Personaliza tu página',
    },
    customizeSubtitle: {
      [ENGLISH]: `Fill out the sections below to personalize the title, description, and design of your supporter page to tell your network why you’re #StickingWithEd. Share your story of why you’re a member of this movement -- feel free to get creative!`,
      [SPANISH]: `Llena las siguientes secciones para personalizar el título, la descripción y el diseño de tu página de apoyo para decirle a tus redes por qué estás #ConEd. Comparte tu historia de por qué eres miembro de este movimiento. ¡Siéntete libre de ser creativo!`,
    },
    formButtonLabel: {
      [ENGLISH]: 'next',
      [SPANISH]: 'siguiente',
    },
    createButtonLabel: {
      [ENGLISH]: 'create page',
      [SPANISH]: 'crear página',
    },
    defaultTitle: {
      [ENGLISH]: `{{FIRST_NAME}} is #StickingWithEd because...`,
      [SPANISH]: '{{FIRST_NAME}} está #ConEd porque...'
    },
    defaultSubtitle: {
      [ENGLISH]: 'Ed comes from a working family, and he’s fighting from the heart for the working class. Ed is running a people-powered campaign, and it’s up to us to help make sure he can keep fighting in the Senate for our shared progressive values. Let me know that you are with me, and help me reach my goal!',
      [SPANISH]: 'Ed viene de una familia trabajadora y está luchando con todo su corazón por la clase trabajadora. Ed está llevando a cabo una campaña impulsada por la gente y depende de nosotros asegurarnos de que pueda seguir luchando en el Senado por nuestros valores progresistas. ¡Háganme saber que están conmigo y ayúdenme a alcanzar mi meta!',
    },
  },
  signupPage: {
    stepOneButtonLabel: {
      [ENGLISH]: 'Next',
      [SPANISH]: 'siguiente',
    },
    stepTwoButtonLabel: {
      [ENGLISH]: 'Submit',
      [SPANISH]: 'someter',
    },
    postSignupTitle: {
      [ENGLISH]: 'Thank you!',
      [SPANISH]: '¡Gracias!',
    },
    postSignupSubtitle: {
      [ENGLISH]: 'Next, keep up the momentum by sharing this link with your friends, family, and network, and help {{FIRST_NAME}} reach their goal! Or, make your own page and get everyone you know to join the fight.',
      [SPANISH]: '¡Mantén el impulso compartiendo este enlace con tus amigos, familia y redes y ayuda a {{FIRST_NAME}} alcanzar su objetivo! O haz tu propia página y haz que todo el que conoces se una a la lucha.',
    },
    postSignupCreateTitle: {
      [ENGLISH]: 'Make your own page',
      [SPANISH]: 'Haz tu propia página',
    },
    postSignupCreateSubtitle: {
      [ENGLISH]: 'Create your own supporter page and become a grassroots organizer for Ed. We’ll show you how!',
      [SPANISH]: 'Crea tu propia página de apoyo y conviértete en un organizador en tu comunidad para Ed. ¡Te mostraremos cómo!',
    },
    postSignupCreateButtonLabel: {
      [ENGLISH]: 'Get started',
      [SPANISH]: 'Comenzar',
    },
    modalTitle: {
      [ENGLISH]: `Here's how you can join ed's fight`,
      [SPANISH]: 'Como puedes unirte a la lucha de Ed',
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
      [SPANISH]: [
        '### Comparte tu enlace',
        `¡Comparte esta página con tus redes para ayudarnos a crecer el Equipo Markey! Tus amigos, familia, vecinos, colegas, compañeros de habitación, compañeros de clase, amigos de Facebook, seguidores en Twitter, tus amigos de Zoom...el cielo es el límite y tenemos que llegar a todos.`,
        `### Consejos para organizar relacionalmente`,
        ` - Llama a 5 amigos y pídeles que llenen tu enlace`,
        ` - Envía tu enlace a 50 personas`,
        ` - Compártelo en tu Facebook y otras redes sociales`,
        ` - ¡Revisa la lista de contactos de tu teléfono y envía el enlace al menos a 10 personas!`,
        ` `,
        `### Ser voluntario con el Equipo Markey`,
        `[Únete al movimiento aquí](http://edmarkey.com/volunteer).`,
      ],
    },
    modalCloseLabel: {
      [ENGLISH]: 'Okay, got it',
      [SPANISH]: 'Perfecto, lo tengo.',
    },
  },
  nav: {
    logoAlt: {
      [ENGLISH]: 'Ed Markey For Senate Logo',
      [SPANISH]: 'Logo de Ed Markey para el Senado',
    },
    return: {
      [ENGLISH]: 'return to edmarkey.com',
      [SPANISH]: 'volver a edmarkey.com',
    },
    returnLink: {
      [ENGLISH]: 'https://www.edmarkey.com/',
    },
    donate: {
      [ENGLISH]: 'donate',
      [SPANISH]: 'donar',
    },
    donateForm: {
      [ENGLISH]: 'https://secure.actblue.com/donate/ejm2020',
    },
  },
  share: {
    facebook: {
      [ENGLISH]: 'Share on Facebook',
      [SPANISH]: 'Compartir en Facebook',
    },
    twitter: {
      [ENGLISH]: 'Share on Twitter',
      [SPANISH]: 'Compartir en Twitter',
    },
    email: {
      [ENGLISH]: 'Share via email',
      [SPANISH]: 'Compartir por correo electrónico',
    },
    link: {
      [ENGLISH]: 'copy link',
      [SPANISH]: 'Copiar enlace',
    },
  },
  genericError: {
    [ENGLISH]: 'Looks like we had an error, try again? If this continues to happen, please contact us https://www.edmarkey.com/contact-us/',
    [SPANISH]: 'Parece que tuvimos un error, ¿intentar de nuevo? Si esto continúa sucediendo, por favor contáctenos https://www.edmarkey.com/contact-us/',
  },
  politicalDiclaimer: {
    [ENGLISH]: 'PAID FOR BY THE MARKEY COMMITTEE',
    [SPANISH]: 'PAGADO POR THE MARKEY COMMITTEE',
  },
  smsDisclaimer: {
    [ENGLISH]: 'By providing your cell phone number you consent to receive periodic campaign updates from the Markey Committee. Text HELP for help, STOP to end. Message & data rates may apply. https://www.edmarkey.com/privacy-policy/',
    [SPANISH]: 'Al proporcionar su número de teléfono celular usted consiente en recibir actualizaciones periódicas de la campaña de The Markey Committee. Envíe un mensaje de texto que diga HELP para pedir ayuda o STOP para descontinuar los mensajes. Pueden aplicar tarifas de mensajes y data. https://www.edmarkey.com/privacy-policy/',
  },
};

export default function getCopy(path, defaultToEnglish = true, fallback = '') {
  const language = location.pathname.startsWith(SPANISH_PREFIX) ? SPANISH : ENGLISH;

  let value = { ...copy };

  for (const key of path.split('.')) {
     if (! value[key]) {
       return fallback;
     }

     value = { ...value[key] };
  }

  return value[language] || (defaultToEnglish && value[ENGLISH]) || fallback;
}
