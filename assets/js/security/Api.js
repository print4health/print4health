import { Config } from '../config';

export async function GET(path) {
  const url = Config.apiBasePath + path;

  try {
    const response = await fetch(url);

    return response;
  }
  catch (e) {
    apiError('GET', url);
  }
}

export async function POST(path, data) {
  const url = Config.apiBasePath + path;

  try {
    const response = await fetch(url,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    return(response);
  }
  catch (e) {
    apiError('POST', url, data);
  }
}

function apiError(method, url, data) {
  throw new Error(`Api call Fail with method="${method}", url="${url}", data="${data}"`);
}
