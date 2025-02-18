### **Steps to Create and Implement the Google Apps Script for Your Log System**  

This guide will walk you through setting up your Google Apps Script, creating the necessary forms, and ensuring your script functions properly.

## **Step 1: Create or Open a Google Spreadsheet**
1. Open [Google Sheets](https://docs.google.com/spreadsheets/).
2. Create a new spreadsheet or open an existing one.
3. Ensure your sheet has the following **headers** (starting from A1):
   ```
   Date | Time In | Time Out | Task
   ```

## **Step 2: Open the Script Editor**
1. Click on **Extensions** > **Apps Script** in the menu.
2. Delete any existing code.
3. Copy and paste the **Apps Script Code** from my previous message into the script editor.

## **Step 3: Save and Authorize the Script**
1. Click the **Save (💾) icon** or press `Ctrl + S` (`Cmd + S` on Mac).
2. Click **Run** > **onOpen** to initialize the menu.
3. Google will ask for authorization:
   - Click **Review Permissions**.
   - Select your **Google Account**.
   - Click **Advanced** > **Go to [your script name]**.
   - Click **Allow**.

## **Step 4: Create the Google Apps File **
1. In the **Apps Script Editor**, click **File** > **New** > **Script**.
2. Name the file **"UI"**.
3. Paste the **UI.gs** content.
4. Save the file.
5. Repeat for the other .gs files. 

## **Step 5: Create the HTML File**
1. In the **Apps Script Editor**, click **File** > **New** > **HTML**.
2. Name the file **"MonthSelectionForm"**.
3. Paste the **MonthSelectionForm.html codes**.
4. Save the file.
5. Repeat for the other .html files. 

## **Step 6: Test the System**
1. **Refresh your Google Sheets** (reload the page).
2. A new menu called **"Log Entry"** should appear.
3. Click **"Log Entry" > "Open Form"** to enter logs.
4. Click **"Log Report" > "Generate Monthly Report"** to generate a report.

## **Step 7: Ensure It Works**
- The date should come from **Column A** (dropdown in the form).
- The **"Check-in" & "Check-out" buttons** should insert the current time.
- The **report** should allow you to select a **month from a dropdown**.

### **Final Notes**
✅ The **Google Apps Script runs in the background** and saves logs automatically.  
✅ The **report uses a dropdown** to generate a filtered log based on the selected month.  
✅ The **IIUM logo appears at the top** of the report.

Let me know if you need any more help! 🚀

Done with AI's help 😃
