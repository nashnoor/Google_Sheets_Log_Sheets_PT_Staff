// Entry Form System
function showLogForm() {
  var htmlForm = HtmlService.createHtmlOutputFromFile("LogFormWithDropdowns")
      .setTitle("Daily Log Entry")
      .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(htmlForm);
}

function submitLogForm(month, date, timeIn, timeOut, task) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(month);
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert("No sheet found for the selected month!");
    return;
  }

  var data = sheet.getDataRange().getValues();
  var found = false;
  var inputDate = new Date(date);
  var formattedInputDate = formatDate(inputDate);

  for (var i = 1; i < data.length; i++) {
    var sheetDate = data[i][0];
    if (sheetDate instanceof Date) {
      var formattedSheetDate = formatDate(sheetDate);
      if (formattedSheetDate === formattedInputDate) {
        sheet.getRange(i + 1, 2).setValue(timeIn);
        sheet.getRange(i + 1, 3).setValue(timeOut);
        sheet.getRange(i + 1, 4).setValue(task);
        found = true;
        break;
      }
    }
  }

  if (!found) {
    SpreadsheetApp.getUi().alert("Date not found in the selected month sheet!");
  }
}

function formatDate(date) {
  var d = new Date(date);
  var day = ('0' + d.getDate()).slice(-2);
  var month = ('0' + (d.getMonth() + 1)).slice(-2);
  var year = d.getFullYear();
  return day + "/" + month + "/" + year;
}

function getAvailableMonths() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var months = [];

  sheets.forEach(function(sheet) {
    var sheetName = sheet.getName();
    if (/^[A-Za-z]+\s\d{4}$/.test(sheetName)) {
      months.push(sheetName);
    }
  });

  return [...new Set(months)];
}
