// Code.gs
// Main Google Apps Script file

// Show month selection dropdown
function showMonthDropdown() {
  try {
    var months = getAvailableMonths();
    Logger.log("Available months: " + months); // Debug log
    
    var template = HtmlService.createTemplateFromFile('MonthSelectionForm');
    template.months = months; // Pass data to template
    
    var htmlOutput = template.evaluate()
        .setWidth(400)
        .setHeight(200)
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);
    
    SpreadsheetApp.getUi().showSidebar(htmlOutput);
  } catch (error) {
    Logger.log("Error in showMonthDropdown: " + error.toString()); // Debug log
    SpreadsheetApp.getUi().alert('Error: ' + error.message);
  }
}

function generatePDF(htmlContent, monthSheet) {
  try {
    var blob = HtmlService.createHtmlOutput(htmlContent)
        .getBlob()
        .getAs('application/pdf');
        
    var pdfFile = DriveApp.createFile(blob).setName(monthSheet + ' Log Report.pdf');
    return pdfFile.getUrl();
  } catch (error) {
    throw new Error('PDF generation failed: ' + error.message);
  }
}

// Generate report for selected month
function generateReportForSelectedMonth(selectedMonth) {
  const ui = SpreadsheetApp.getUi();
  
  try {
    // Check permissions first
    checkPermissions();
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(selectedMonth);
    
    if (!sheet) {
      throw new Error(`No data found for ${selectedMonth}`);
    }
    
    // Show loading message
    ui.alert('Generating report, please wait...');
    
    var data = sheet.getDataRange().getValues();
    validateData(data);
    
    var html = HtmlService.createHtmlOutput(buildHtml(data, selectedMonth))
        .setTitle(`${selectedMonth} Log Report`)
        .setWidth(850)
        .setHeight(600)
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);
        
    ui.showModalDialog(html, `${selectedMonth} Log Report`);
    
  } catch (error) {
    ui.alert('Error', `Failed to generate report: ${error.message}`, ui.ButtonSet.OK);
  }
}

// Build HTML for report
function buildHtml(data, monthSheet) {
  try {
    validateData(data);
    
    const safeHtml = str => str.replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char]);
    
    var html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <base target="_top">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            padding: 20px; 
            margin: 0;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 10px; 
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left; 
          }
          th { 
            background-color: #4CAF50; 
            color: white; 
          }
          tr:nth-child(even) { 
            background-color: #f2f2f2; 
          }
          .header { 
            text-align: center; 
            font-size: 16px; 
            margin-top: 10px; 
          }
          .logo-container { 
            text-align: center; 
            margin-bottom: 20px;
          }
          .details { 
            text-align: center; 
            font-size: 14px; 
            margin-top: 20px; 
            padding-top: 10px; 
          .download-btn {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
            display: inline-block;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
    `;
    
    // Header section
    html += `<div class='header'><h3>${safeHtml(monthSheet)} Log Report</h3></div>`;
     // Logo section
    html += "<div class='logo-container'><img src='https://example.com/img.png' alt='IIUM Logo' width='200px'></div>";
    
    // Additional details
    html += `
      <div class='details'>
        <p><strong>Name:</strong>...</p>
        <p><strong>Staff Number:</strong>...</p>
        <p><strong>Designation:</strong>...</p>
        <p><strong>Department:</strong>...</p>
      </div>
    `;
    
    // Add sanitized data to table
    html += "<table><tr>";
    data[0].forEach(header => {
      html += `<th>${safeHtml(header.toString())}</th>`;
    });
    html += "</tr>";
    
    // Process rows with formatted date
    for (let i = 1; i < data.length; i++) {
      html += "<tr>";
      data[i].forEach((cell, index) => {
        let value;
        if (index === 0) { // Date column
          value = formatDate(cell);
        } else if (index === 1 || index === 2) { // Time columns
          value = formatTime(cell);
        } else {
          value = safeHtml(cell.toString());
        }
        html += `<td>${value}</td>`;
      });
      html += "</tr>";
    }
    
     html += "</table>";
    
    // Add download button div (only shown in preview, not in PDF)
    html += `
      <div id="downloadDiv" style="text-align: center; margin-top: 20px;">
        <button onclick="downloadPDF()" class="download-btn">Download PDF</button>
      </div>
    `;
    
    // Add script for PDF download
    html += `
      <script>
        function downloadPDF() {
          google.script.run
            .withSuccessHandler(function(url) {
              if (url) {
                window.open(url, '_blank');
              }
            })
            .withFailureHandler(function(error) {
              alert('Error generating PDF: ' + error.message);
            })
            .generatePDF(document.documentElement.outerHTML, '${monthSheet}');
        }
      </script>
      </body></html>
    `;
    
    return html;
  } catch (error) {
    throw new Error(`HTML Generation failed: ${error.message}`);
  }
}

// Modify generateReportForSelectedMonth to include PDF generation
function generateReportForSelectedMonth(selectedMonth) {
  const ui = SpreadsheetApp.getUi();
  
  try {
    checkPermissions();
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(selectedMonth);
    
    if (!sheet) {
      throw new Error(`No data found for ${selectedMonth}`);
    }
    
    var data = sheet.getDataRange().getValues();
    validateData(data);
    
    var htmlContent = buildHtml(data, selectedMonth);
    var html = HtmlService.createHtmlOutput(htmlContent)
        .setTitle(`${selectedMonth} Log Report`)
        .setWidth(850)
        .setHeight(600)
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);
        
    ui.showModalDialog(html, `${selectedMonth} Log Report`);
    
  } catch (error) {
    ui.alert('Error', `Failed to generate report: ${error.message}`, ui.ButtonSet.OK);
  }
}

// Format time values
function formatTime(time) {
  if (!time) return 'N/A';
  
  try {
    if (time instanceof Date) {
      var hours = ('0' + time.getHours()).slice(-2);
      var minutes = ('0' + time.getMinutes()).slice(-2);
      return hours + ":" + minutes;
    } else if (typeof time === 'string' && time.includes(':')) {
      return time; // Already formatted
    } else {
      return 'Invalid Time';
    }
  } catch (e) {
    return 'Error';
  }
}

// Validate data structure
function validateData(data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Invalid data format");
  }
  
  // Validate headers
  const requiredColumns = ['Date', 'Time In', 'Time Out'];
  const headers = data[0];
  requiredColumns.forEach(col => {
    if (!headers.includes(col)) {
      throw new Error(`Missing required column: ${col}`);
    }
  });
  
  return true;
}

// Check user permissions
function checkPermissions() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var protection = ss.getProtections(SpreadsheetApp.ProtectionType.SHEET);
    var user = Session.getActiveUser().getEmail();
    
    if (!ss.getEditors().map(editor => editor.getEmail()).includes(user)) {
      throw new Error("User does not have sufficient permissions");
    }
    
    return true;
  } catch (e) {
    throw new Error(`Permission check failed: ${e.message}`);
  }
}

// Get available months from sheet names
function getAvailableMonths() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var months = [];
  
  // More flexible month validation
  var monthPattern = /^(January|February|March|April|May|June|July|August|September|October|November|December)\s\d{4}$/i;
  
  sheets.forEach(function(sheet) {
    var sheetName = sheet.getName();
    if (monthPattern.test(sheetName)) {
      months.push(sheetName);
    }
  });
  
  return [...new Set(months)].sort();
}
