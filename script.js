let internsData = {};

function showDashboard() {
  document.getElementById("dashboardSection").style.display = "block";
  document.getElementById("assessmentSection").style.display = "none";
}

function showAssessment() {
  document.getElementById("dashboardSection").style.display = "none";
  document.getElementById("assessmentSection").style.display = "block";
}

document.getElementById("assessmentForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const internName = document.getElementById("internName").value.trim();
  const domain = document.getElementById("domain").value.trim();
  const mentorName = document.getElementById("mentorName").value.trim();
  const assessmentNo = document.getElementById("assessmentNo").value;
  const topic = document.getElementById("assessmentTopic").value;
  const date = document.getElementById("assessmentDate").value;

  const overallScore =
    (["technical", "analytical", "troubleshooting", "verbal", "written", "collaboration"]
      .map(id => parseInt(document.getElementById(id).value || 0))
      .reduce((a, b) => a + b, 0)) / 6;

  const internKey = `${internName}_${domain}_${mentorName}`;
  if (!internsData[internKey]) {
    internsData[internKey] = { name: internName, domain, mentor: mentorName, score: 0, assessments: [] };
  }

  internsData[internKey].assessments.push({ no: assessmentNo, topic, date, score: overallScore.toFixed(1) });
  internsData[internKey].score = overallScore.toFixed(1);

  renderTable();

  bootstrap.Modal.getInstance(document.getElementById("assessmentModal")).hide();
  this.reset();
});

function renderTable() {
  const body = document.getElementById("assessmentTableBody");
  body.innerHTML = "";
  Object.entries(internsData).forEach(([key, intern]) => {
    const row = document.createElement("tr");
    const list = intern.assessments.map(a => a.no).join(", ");
    row.innerHTML = `
      <td>${intern.name}</td>
      <td>${intern.domain}</td>
      <td>${intern.mentor}</td>
      <td>${intern.score}</td>
      <td>${list}</td>
      <td>
        <button class="btn btn-info btn-sm me-1" onclick="viewRow('${key}')">View</button>
        <button class="btn btn-danger btn-sm" onclick="removeRow('${key}')">Remove</button>
      </td>`;
    body.appendChild(row);
  });
}

function removeRow(key) {
  delete internsData[key];
  renderTable();
}

function viewRow(key) {
  const intern = internsData[key];
  let html = `
    <tr><th>Name</th><td>${intern.name}</td></tr>
    <tr><th>Domain</th><td>${intern.domain}</td></tr>
    <tr><th>Mentor</th><td>${intern.mentor}</td></tr>
    <tr><th>Overall Score</th><td>${intern.score}</td></tr>
    <tr><th colspan="2">Assessments</th></tr>`;
  intern.assessments.forEach(a => {
    html += `<tr><td colspan="2"><b>${a.no}</b> - ${a.topic} (${a.date}) - Score: ${a.score}</td></tr>`;
  });
  document.getElementById("viewTableBody").innerHTML = html;
  new bootstrap.Modal(document.getElementById("viewModal")).show();
}
