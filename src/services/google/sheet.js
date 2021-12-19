const { google } = require('googleapis');
const { catchAsync } = require('../../utils/api.utils');

const authenticate = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  const client = await auth.getClient();

  const sheets = google.sheets({
    version: 'v4',
    auth: client,
  });
  return { sheets };
};

exports.get = catchAsync(async (spreadsheetId, range) => {
  const { sheets } = await authenticate();

  const writeReq = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
    valueInputOption: '',
    resource: {
      values: [],
    },
  });
  if (writeReq.status === 200) {
    return true;
  } else {
    return false;
  }
});

exports.append = catchAsync(async (spreadsheetId, range) => {
  const { sheets } = await authenticate();

  return await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
  });
});
