const SHEET_API = "https://script.google.com/a/macros/tnschools.gov.in/s/AKfycbwGo1NHRpBlEmOvqfe4Sdh41Dxb3JU2LsAv6vas_0zAabsJ7AewlKbb3VICXYr7TkZ0kA/exec";

let data = [], headers = [], selectedCols = new Set(["B"]);

async function init() {
  const res = await fetch(SHEET_API);
  const json = await res.json();
  headers = json.headers;
  data = json.rows;
  buildUI();
  renderTable();
}

function buildUI() {
  // checkboxes
  const cbDiv = document.getElementById("checkboxes");
  headers.forEach((h, i) => {
    const label = document.createElement("label");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = (i === 0); // only B selected initially
    cb.addEventListener("change", renderTable);
    label.append(cb, h);
    cbDiv.append(label);
  });

  // dropdowns (B,D,E,F,G → indices 0,2,3,4,5)
  const dropDiv = document.getElementById("dropdowns");
  [0,2,3,4,5].forEach(i => {
    const select = document.createElement("select");
    const values = [...new Set(data.map(r => r[i]))].sort();
    select.innerHTML = `<option value="">All</option>` +
      values.map(v => `<option>${v}</option>`).join("");
    select.addEventListener("change", renderTable);
    dropDiv.append(select);
  });
}

function renderTable() {
  const cbList = [...document.querySelectorAll("#checkboxes input")];
  const visibleCols = cbList.map((cb,i)=>cb.checked?i:null).filter(v=>v!==null);
  const filters = [...document.querySelectorAll("#dropdowns select")].map(s=>s.value);

  const table = document.createElement("table");
  const thead = table.createTHead();
  const hr = thead.insertRow();
  visibleCols.forEach(i => hr.insertCell().textContent = headers[i]);

  const tbody = table.createTBody();
  data.filter(r =>
    [0,2,3,4,5].every((idx, fi) => !filters[fi] || r[idx] === filters[fi])
  ).forEach(r => {
    const tr = tbody.insertRow();
    visibleCols.forEach(i => tr.insertCell().textContent = r[i]);
  });

  document.getElementById("table-container").innerHTML = "";
  document.getElementById("table-container").append(table);
}

init();
