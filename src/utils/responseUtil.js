export const goodResponse = (responseBody) => {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(goodResponse),
    isBase64Encoded: false
  };
}