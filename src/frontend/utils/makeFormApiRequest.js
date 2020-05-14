import getCopy from '../utils/getCopy';

export default async function makeFormApiRequest(path, data) {
  try {
    const response = await fetch(path, {
      method: 'post',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status !== 200) {
      const data = await response.json();
      return getCopy(data.error, true, null) || getCopy('genericError');
    }

    return null;
  } catch (error) {
    console.error(error);
    return getCopy('genericError');
  }
}
