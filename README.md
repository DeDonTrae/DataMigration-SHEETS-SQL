# DataMigration-SHEETS-SQL
# 🧾 SQL Script Generator for Google Sheets

This project allows users to **convert any Google Sheet into SQL scripts** (CREATE TABLE + INSERT statements) using an easy-to-use web interface built with Google Apps Script and HTML.

---

## 📦 Features

- Auto-detects column data types (INT, FLOAT, DATETIME, VARCHAR).
- Converts sheet data into valid SQL `CREATE TABLE` and `INSERT INTO` statements.
- Allows users to select any sheet from a dropdown.
- One-click download of the generated `.sql` file.
- Clean, responsive UI for ease of use.

---

## 🚀 How to Deploy

> You must have a Google Sheet and permission to edit Apps Script for it.

### 1. Clone or Copy the Code

- Open your Google Sheet.
- Click on **Extensions > Apps Script**.
- Replace any existing content in `Code.gs` with the code from [`Code.gs`](./Code.gs).
- Add a new HTML file (`Index.html`) and paste the content from [`Index.html`](./Index.html).

### 2. Deploy as a Web App

- In Apps Script, click **Deploy > Test deployments** or **Manage deployments**.
- Choose **Web App**.
- Under *Execute as*: **Me**
- Under *Who has access*: **Anyone** (or **Only you**, for internal use)
- Click **Deploy** and authorize access if prompted.
- Copy the **web app URL** and open it in your browser.

---

## 🛠️ How It Works

1. The app loads available sheet names into a dropdown.
2. You select a sheet (with headers in the first row).
3. Click **Generate & Download SQL**.
4. It analyzes each column to guess SQL data types:
   - Numbers → `INT` or `FLOAT`
   - Dates → `DATETIME`
   - Text → `VARCHAR(n)`
5. Generates:
   - `CREATE TABLE <sheet_name> (...)`
   - `INSERT INTO <sheet_name> (...) VALUES (...)`
6. Automatically triggers a download of a `.sql` file.

---

## 📝 Sheet Requirements

- The **first row must contain column headers**.
- Data must start from the **second row onward**.
- Each sheet represents one SQL table.

---

## 📁 File Structure

| File         | Purpose                                       |
|--------------|-----------------------------------------------|
| `Code.gs`    | Google Apps Script backend for data parsing   |
| `Index.html` | Frontend HTML for the web app interface       |

---

## 💡 Customization Ideas

- Prompt user for custom table name.
- Export multiple sheets at once.
- Add option to preview SQL before download.
- Support additional SQL dialects (MySQL, PostgreSQL, etc).

---

## 🔐 Permissions

This app runs within Google Sheets. It needs permission to:

- Read data from sheets
- Serve HTML and trigger file downloads

All processing happens within your Google account; no external services are used.

---

## 📞 Support

If you run into issues or want to improve the tool, feel free to [open an issue](https://github.com/your-username/sql-script-generator/issues) or submit a pull request.

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

> Built with ❤️ to make working with data and databases easier.
