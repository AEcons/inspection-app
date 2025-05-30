function printPage() {
  window.print();
}

// เพิ่มปุ่มพิมพ์แบบไดนามิกหากต้องการในหน้า HTML
function createPrintButton() {
  const button = document.createElement('button');
  button.innerText = 'พิมพ์รายงาน';
  button.onclick = printPage;
  button.className = 'no-print';
  document.body.appendChild(button);
}

document.addEventListener('DOMContentLoaded', createPrintButton);
