function addItem() {
  const container = document.getElementById('items');
  const index = container.children.length + 1;
  const div = document.createElement('div');
  div.innerHTML = `
    <h3>รายการที่ ${index}</h3>
    <label>รายละเอียดรายการ: <input type="text" name="desc${index}"></label><br>
    <label>รูปก่อนทำ: <input type="file" accept="image/*" name="before${index}"></label><br>
    <label>รูปหลังทำ: <input type="file" accept="image/*" name="after${index}"></label><br>
  `;
  container.appendChild(div);
}

document.getElementById('recordForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  alert('บันทึกเรียบร้อย (จำลอง)');
});
