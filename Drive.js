const CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
const API_KEY = 'YOUR_API_KEY';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

let tokenClient;
let gapiInited = false;
let gisInited = false;

// เรียกเมื่อโหลดหน้าเสร็จ
function gapiLoaded() {
  gapi.load('client', async () => {
    await gapi.client.init({ apiKey: API_KEY });
    gapiInited = true;
    maybeEnableButtons();
  });
}

function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // set later
  });
  gisInited = true;
  maybeEnableButtons();
}

function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById('loginBtn')?.removeAttribute('disabled');
  }
}

function signIn(callback) {
  tokenClient.callback = async (resp) => {
    if (resp.error) return console.error(resp);
    await gapi.client.load('drive', 'v3');
    callback && callback();
  };
  tokenClient.requestAccessToken({ prompt: 'consent' });
}

function signOut() {
  const token = gapi.client.getToken();
  if (token) {
    google.accounts.oauth2.revoke(token.access_token, () => {
      gapi.client.setToken('');
      alert("ออกจากระบบแล้ว");
    });
  }
}

// สร้างโฟลเดอร์ถ้ายังไม่มี
async function createFolderIfNotExists(folderName) {
  const q = `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`;
  const res = await gapi.client.drive.files.list({ q });
  if (res.result.files.length > 0) return res.result.files[0].id;

  const fileMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder'
  };
  const createRes = await gapi.client.drive.files.create({
    resource: fileMetadata,
    fields: 'id'
  });
  return createRes.result.id;
}

// อัปโหลด JSON ไปยังโฟลเดอร์
async function uploadJson(folderId, fileName, jsonData) {
  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelim = `\r\n--${boundary}--`;

  const contentType = 'application/json';
  const metadata = {
    name: fileName,
    parents: [folderId],
    mimeType: contentType
  };

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: ' + contentType + '\r\n\r\n' +
    JSON.stringify(jsonData) +
    closeDelim;

  const request = gapi.client.request({
    path: '/upload/drive/v3/files?uploadType=multipart',
    method: 'POST',
    headers: {
      'Content-Type': `multipart/related; boundary="${boundary}"`
    },
    <script src="drive.js"></script>

    body: multipartRequestBody
  });

  return request.then(res => res.result);
}

// อ่านไฟล์ JSON จากชื่อ
async function readJson(folderId, fileName) {
  const q = `'${folderId}' in parents and name='${fileName}' and trashed=false`;
  const list = await gapi.client.drive.files.list({ q, fields: "files(id, name)" });
  if (list.result.files.length === 0) return null;

  const fileId = list.result.files[0].id;
  const file = await gapi.client.drive.files.get({
    fileId,
    alt: 'media'
  });
  return file.result;
}
