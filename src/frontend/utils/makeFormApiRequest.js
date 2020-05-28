import makeApiRequest from './makeApiRequest';

export default async function makeFormApiRequest(path, data, afterRequest) {
  try {
    const {
      errorMessage,
      json,
      response,
    } = await makeApiRequest(path, 'post', data);

    if (errorMessage && errorMessage.length) {
      return errorMessage;
    }

    if (afterRequest) {
      await afterRequest(json, response);
    }

    return null;
  } catch (error) {
    console.error(error);
    return [getCopy('genericError'), null];
  }
}
