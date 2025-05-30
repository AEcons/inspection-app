function saveRecord(record) {
  const records = JSON.parse(localStorage.getItem('aeRecords') || '[]');
  const index = records.findIndex(r => r.project === record.project && r.plot === record.plot);
  if (index >= 0) {
    records[index] = record;
  } else {
    records.push(record);
  }
  localStorage.setItem('aeRecords', JSON.stringify(records));
}

function loadRecord(project, plot) {
  const records = JSON.parse(localStorage.getItem('aeRecords') || '[]');
  return records.find(r => r.project === project && r.plot === plot);
}

function getAllRecords() {
  return JSON.parse(localStorage.getItem('aeRecords') || '[]');
}

function previewImage(input, imgId) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById(imgId).src = reader.result;
    document.getElementById(imgId).style.display = 'block';
  };
  reader.readAsDataURL(file);
}

function convertImageToBase64(fileInput) {
  return new Promise((resolve, reject) => {
    const file = fileInput.files[0];
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function populateUserList(selectId) {
  const users = JSON.parse(localStorage.getItem('aeUserList') || '[]');
  const select = document.getElementById(selectId);
  select.innerHTML = users.map(u => `<option value="${u}">${u}</option>`).join('');
}
