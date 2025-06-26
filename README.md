# 🧾 DataMigration-SHEETS-SQL
# 👌 SQL Script Generator for Google Sheets
This project provides a **Google Sheets Web App** that lets you easily export sheet data as valid SQL scripts (`CREATE TABLE` + `INSERT INTO`). Built entirely with **Google Apps Script + HTML**, it helps streamline database population for migrations and prototyping.

---

## 📦 Features

- ✅ Detects correct SQL data types (`INT`, `FLOAT`, `DATETIME`, `VARCHAR`)
- ✅ Reads any sheet in your spreadsheet
- ✅ One-click download of a clean, ready-to-run `.sql` file
- ✅ Responsive HTML interface
- ✅ Lightweight, fast, and no external dependencies

---

## 🚀 Deployment Guide

### 🛠️ Step 1: Set Up Script Files

1. Open your target **Google Sheet**
2. Go to **Extensions > Apps Script**
3. In the Script Editor:
   - Replace any existing content in `Code.gs` with the file from this repo
   - Add a new HTML file named `Index.html` and paste the content from this repo

### 🛰️ Step 2: Deploy Web App

1. In the Apps Script menu, click **Deploy > Manage deployments**
2. Select **Web app**
3. Settings:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` (or `Only you` for internal use)
4. Click **Deploy**
5. Open the web app link to access the UI

---

## 🧠 How It Works

1. The app reads the column headers from the first row of the selected sheet
2. It scans the values in each column to determine the most appropriate SQL data type:
   - Whole numbers → `INT`
   - Decimal numbers → `FLOAT`
   - Recognized dates → `DATETIME`
   - Everything else → `VARCHAR(n)` (dynamic sizing)
3. Generates SQL:
   - `CREATE TABLE <sanitized_sheet_name> (...)`
   - `INSERT INTO` statements for every row of data
4. Instantly triggers download of a `.sql` file with all the above

---

## ✅ Sheet Format Requirements

| Requirement | Description |
|-------------|-------------|
| **Headers** | Must be in the **first row** |
| **Data**    | Starts from **row 2** |
| **Naming**  | Sheet name becomes the table name (sanitized) |

---

## 📁 File Structure

| File         | Purpose                                       |
|--------------|-----------------------------------------------|
| `Code.gs`    | Server-side logic (Apps Script)               |
| `Index.html` | Front-end UI (sheet selector & generator)     |

---

## 💡 Future Improvements

- [ ] Allow custom table name override
- [ ] Let user select multiple sheets
- [ ] Preview SQL before download
- [ ] Support for MySQL, PostgreSQL dialect options

---

## 📸 Screenshots

![image](https://github.com/user-attachments/assets/9e66738c-15e7-45e7-83c8-82d5f5488cea)


---

## 🔐 Permissions & Security

- Data stays within your Google account
- Script runs entirely inside your Google environment
- No third-party APIs or external dependencies

---

## 🧩 Contributing

Pull requests are welcome! If you encounter bugs or want to suggest features, please [open an issue](https://github.com/DeDonTrae/DataMigration-SHEETS-SQL/issues).

---

> Built with ❤️ by [@DeDonTrae](https://github.com/DeDonTrae) to simplify data migration from spreadsheets to SQL databases.
