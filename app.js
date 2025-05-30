function saveUser(name) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (!users.includes(name)) {
    users.push(name);
    localStorage.setItem("users", JSON.stringify(users));
  }
  localStorage.setItem("currentUser", name);
}

function getCurrentUser() {
  return localStorage.getItem("currentUser") || "";
}

function getProjects() {
  const data = JSON.parse(localStorage.getItem("records")) || [];
  const projects = [...new Set(data.map(item => item.project))];
  return projects;
}

function loadSummaryReport() {
  const projectSelect = document.getElementById("projectSelect");
  const data = JSON.parse(localStorage.getItem("records")) || [];
  const projects = getProjects();

  projectSelect.innerHTML = '<option value="">-- เลือกโครงการ --</option>';
  projects.forEach(proj => {
    const opt = document.createElement("option");
    opt.value = proj;
    opt.textContent = proj;
    projectSelect.appendChild(opt);
  });

  projectSelect.addEventListener("change", () => {
    const selected = projectSelect.value;
    const filtered = selected ? data.filter(i => i.project === selected) : data;

    const total = filtered.length;
    const inProgress = filtered.filter(i => i.status === "อยู่ระหว่างแก้ไข").length;
    const qcPass = filtered.filter(i => i.status === "QC ผ่านแล้ว").length;
    const handover = filtered.filter(i => i.status === "ลูกบ้านรับมอบ").length;
    const pending = total - (inProgress + qcPass + handover);

    document.getElementById("totalItems").textContent = total;
    document.getElementById("inProgress").textContent = inProgress;
    document.getElementById("qcPass").textContent = qcPass;
    document.getElementById("handover").textContent = handover;
    document.getElementById("pending").textContent = pending;

    const counter = {};
    filtered.forEach(item => {
      counter[item.description] = (counter[item.description] || 0) + 1;
    });

    const sorted = Object.entries(counter).sort((a,b) => b[1] - a[1]).slice(0,3);
    const topList = document.getElementById("topItems");
    topList.innerHTML = "";
    sorted.forEach(([desc, count]) => {
      const li = document.createElement("li");
      li.textContent = `${desc} (${count} รายการ)`;
      topList.appendChild(li);
    });
  });
}

// ฟังก์ชันอื่น ๆ สำหรับ login, record, report, detail, ฯลฯ จะตามมา
