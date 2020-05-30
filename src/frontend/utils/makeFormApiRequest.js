import getCopy from './getCopy';
import makeApiRequest from './makeApiRequest';

export default async function makeFormApiRequest(path, method, data, afterRequest, enableAuthorizationRedirect = true) {
  try {
    const {
      errorMessage,
      json,
      response,
    } = await makeApiRequest(path, method, data, enableAuthorizationRedirect);

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
