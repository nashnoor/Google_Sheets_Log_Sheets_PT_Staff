function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("Log Entry")
    .addItem("Open Form", "showLogForm")
    .addToUi();
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("Log Report")
    .addItem("Generate Monthly Report", "showMonthDropdown")
    .addToUi();
  
}
