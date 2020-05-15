import getCopy from '../utils/getCopy';

export default async function makeFormApiRequest(path, data) {
  try {
    const response = await fetch(path, {
      method: 'post',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status !== 200) {
      const { field, error } = await response.json();
      console.log(field, error);

      return [
        getCopy(error, true, null) || getCopy('genericError'),
        getCopy(`formLabels.${field}`, true, null) || null,
      ];
    }

    return null;
  } catch (error) {
    console.error(error);
    return [getCopy('genericError'), null];
  }
}
