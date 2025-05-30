function saveUser(name) {
  localStorage.setItem("username", name);
}

function getUser() {
  return localStorage.getItem("username") || "";
}

function loadUsername() {
  const usernameField = document.getElementById("username");
  if (usernameField) usernameField.value = getUser();
}

function requirePassword(callback) {
  const pass = prompt("กรอกรหัสผ่านเพื่อดำเนินการ");
  if (pass === "211421") callback();
  else alert("รหัสไม่ถูกต้อง");
}

// ----- บันทึกข้อมูลจาก record.html -----
function saveRecord() {
  const project = document.getElementById("project").value;
  const plot = document.getElementById("plot").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const item = document.getElementById("item").value;
  const status = document.getElementById("status").value;
  const before1 = document.getElementById("before1Preview").src;
  const before2 = document.getElementById("before2Preview").src;
  const after1 = document.getElementById("after1Preview").src;
  const after2 = document.getElementById("after2Preview").src;

  const newRecord = {
    startDate, endDate, item, status, before1, before2, after1, after2,
    user: getUser(), timestamp: new Date().toISOString()
  };

  const key = `${project}_${plot}`;
  let existing = JSON.parse(localStorage.getItem(key)) || [];
  existing.push(newRecord);
  localStorage.setItem(key, JSON.stringify(existing));
  alert("บันทึกข้อมูลสำเร็จ");
}

function loadRecord() {
  const project = document.getElementById("project").value;
  const plot = document.getElementById("plot").value;
  const key = `${project}_${plot}`;
  const records = JSON.parse(localStorage.getItem(key)) || [];

  if (records.length > 0) {
    const rec = records[records.length - 1];
    document.getElementById("startDate").value = rec.startDate;
    document.getElementById("endDate").value = rec.endDate;
    document.getElementById("item").value = rec.item;
    document.getElementById("status").value = rec.status;
    document.getElementById("before1Preview").src = rec.before1;
    document.getElementById("before2Preview").src = rec.before2;
    document.getElementById("after1Preview").src = rec.after1;
    document.getElementById("after2Preview").src = rec.after2;
  } else {
    alert("ไม่พบข้อมูลเดิม");
  }
}

// ----- รายงานทั้งหมด -----
function loadProjectList(selectId) {
  const select = document.getElementById(selectId);
  const keys = Object.keys(localStorage);
  const projects = [...new Set(keys.map(k => k.split("_")[0]))];
  select.innerHTML = `<option value="">เลือกโครงการ</option>` +
    projects.map(p => `<option value="${p}">${p}</option>`).join("");
}

function loadReport(project) {
  const table = document.getElementById("reportTable");
  table.innerHTML = "";
  const keys = Object.keys(localStorage).filter(k => k.startsWith(project));
  keys.forEach(k => {
    const records = JSON.parse(localStorage.getItem(k));
    records.forEach(rec => {
      const row = `<tr><td>${rec.project}</td><td>${k.split("_")[1]}</td><td>${rec.status}</td><td>${rec.item}</td></tr>`;
      table.innerHTML += row;
    });
  });
}

// ----- สรุปรายงาน -----
function loadSummaryReport() {
  const select = document.getElementById("projectSelect");
  const value = select?.value || "";
  const keys = Object.keys(localStorage).filter(k => k.includes("_"));
  let allRecords = [];

  keys.forEach(k => {
    const data = JSON.parse(localStorage.getItem(k));
    data.forEach(r => {
      if (value === "" || r.project === value) {
        allRecords.push(r);
      }
    });
  });

  document.getElementById("totalItems").textContent = allRecords.length;
  document.getElementById("inProgress").textContent = allRecords.filter(r => r.status === "อยู่ระหว่างแก้ไข").length;
  document.getElementById("qcPass").textContent = allRecords.filter(r => r.status === "QC ผ่านแล้ว").length;
  document.getElementById("handover").textContent = allRecords.filter(r => r.status === "ลูกบ้านรับมอบ").length;
  document.getElementById("pending").textContent = allRecords.filter(r => r.status === "").length;

  const freq = {};
  allRecords.forEach(r => {
    freq[r.item] = (freq[r.item] || 0) + 1;
  });

  const topItems = Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0,3);
  document.getElementById("topItems").innerHTML = topItems.map(([item, count]) => `<li>${item} (${count})</li>`).join("");
}
