
function doGet(e) {
  const action = e && e.parameter ? e.parameter.action : '';

  // API lấy danh sách học sinh
  if (action === 'getStudents') {
    return getStudentListAsJSON();
  }
  
  // API lấy danh sách nhiệm vụ (JOBS)
  if (action === 'getTasks') {
    return getTaskListAsJSON();
  }

  // API lấy danh sách vai trò cố định (JOBS2)
  if (action === 'getFixedRoles') {
    return getFixedRolesAsJSON();
  }

  // API lấy phân công mới nhất
  if (action === 'getLatestAssignment') {
    return getLatestAssignmentAsJSON();
  }
  
  // API lấy mô tả nhiệm vụ
  if (action === 'getTaskDescriptions') {
    return getTaskDescriptionsAsJSON();
  }

  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Phân Công Nhiệm Vụ')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  try {
    // Web App gửi text/plain để tránh CORS, nên cần parse thủ công
    const postData = JSON.parse(e.postData.contents);
    
    if (postData.action === 'saveAssignments') {
      return saveAssignmentData(postData);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ error: "Invalid action" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// --- CORE FUNCTIONS ---

function getStudentList() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('TEN');
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return []; // Không có dữ liệu (trừ header)
  
  // Tìm cột HOTEN
  const headers = data[0];
  const nameColIndex = headers.indexOf('HOTEN');
  
  if (nameColIndex === -1) return [];
  
  // Lấy dữ liệu cột tên (bỏ header)
  const students = [];
  for (let i = 1; i < data.length; i++) {
    const name = data[i][nameColIndex];
    if (name && name.toString().trim() !== '') {
      students.push(name.toString().trim());
    }
  }
  return students;
}

function getTaskList() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('MANAGE');
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  
  // Tìm cột JOBS
  const headers = data[0];
  const jobColIndex = headers.indexOf('JOBS');
  
  if (jobColIndex === -1) return [];
  
  const tasks = [];
  for (let i = 1; i < data.length; i++) {
    const job = data[i][jobColIndex];
    if (job && job.toString().trim() !== '') {
      tasks.push(job.toString().trim());
    }
  }
  return tasks;
}

function getFixedRoles() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('MANAGE');
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  
  // Tìm cột JOBS2
  const headers = data[0];
  const jobColIndex = headers.indexOf('JOBS2');
  
  if (jobColIndex === -1) return [];
  
  const roles = [];
  for (let i = 1; i < data.length; i++) {
    const role = data[i][jobColIndex];
    if (role && role.toString().trim() !== '') {
      roles.push(role.toString().trim());
    }
  }
  return roles;
}

function saveAssignmentData(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('PHANCONG');
  
  // Nếu chưa có sheet thì tạo mới và thêm header
  if (!sheet) {
    sheet = ss.insertSheet('PHANCONG');
    sheet.appendRow(['THOI_GIAN_TAO', 'TU_NGAY', 'DEN_NGAY', 'TEN_NHIEM_VU', 'DANH_SACH_HOC_SINH']);
  }
  
  const timestamp = new Date();
  const rowsToAdd = data.assignments.map(a => [
    timestamp,
    data.startDate,
    data.endDate,
    a.taskName,
    a.students.join(', ')
  ]);
  
  if (rowsToAdd.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rowsToAdd.length, 5).setValues(rowsToAdd);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
}

function getLatestAssignment() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('PHANCONG');
  
  // Mặc định trả về null nếu chưa có dữ liệu
  if (!sheet || sheet.getLastRow() < 2) return null;
  
  const data = sheet.getDataRange().getValues();
  // data[0] là header
  // Dữ liệu bắt đầu từ dòng 2 (index 1)
  
  // Lấy dòng cuối cùng để xác định timestamp mới nhất
  const lastRow = data[data.length - 1];
  const latestTimestampStr = lastRow[0].toString(); 
  
  // Lọc tất cả các dòng có cùng timestamp với dòng cuối cùng
  const currentAssignments = data.filter((row, index) => index > 0 && row[0].toString() === latestTimestampStr);
  
  if (currentAssignments.length === 0) return null;
  
  // Cấu trúc lại dữ liệu trả về
  // row[1] = TU_NGAY, row[2] = DEN_NGAY, row[3] = TEN_NHIEM_VU, row[4] = DANH_SACH
  return {
    createdAt: latestTimestampStr,
    startDate: currentAssignments[0][1],
    endDate: currentAssignments[0][2],
    tasks: currentAssignments.map(row => ({
      taskName: row[3],
      students: row[4] ? row[4].split(', ') : []
    }))
  };
}

function getTaskDescriptions() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('MOTA');
  if (!sheet) return {};
  
  const data = sheet.getDataRange().getValues();
  if (data.length < 1) return {};
  
  const headers = data[0];
  const descriptions = {};
  
  // Duyệt qua từng cột header để lấy mô tả bên dưới
  for (let col = 0; col < headers.length; col++) {
    const taskName = headers[col].toString().trim();
    if (!taskName) continue;
    
    const taskDescList = [];
    // Duyệt từ dòng 2 (index 1) trở xuống
    for (let row = 1; row < data.length; row++) {
      const desc = data[row][col];
      // Nếu có dữ liệu thì thêm vào list
      if (desc && desc.toString().trim() !== '') {
        taskDescList.push(desc.toString().trim());
      }
    }
    descriptions[taskName] = taskDescList;
  }
  
  return descriptions;
}

// --- HELPER WRAPPERS FOR JSON RESPONSE ---

function getStudentListAsJSON() {
  const students = getStudentList();
  return ContentService.createTextOutput(JSON.stringify(students))
    .setMimeType(ContentService.MimeType.JSON);
}

function getTaskListAsJSON() {
  const tasks = getTaskList();
  return ContentService.createTextOutput(JSON.stringify(tasks))
    .setMimeType(ContentService.MimeType.JSON);
}

function getFixedRolesAsJSON() {
  const roles = getFixedRoles();
  return ContentService.createTextOutput(JSON.stringify(roles))
    .setMimeType(ContentService.MimeType.JSON);
}

function getLatestAssignmentAsJSON() {
  const data = getLatestAssignment();
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getTaskDescriptionsAsJSON() {
  const data = getTaskDescriptions();
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}