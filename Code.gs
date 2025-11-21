function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('SQL Script Generator');
}

// Get sheet names for dropdown
function getSheetNames() {
  const sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  return sheets.map(sheet => sheet.getName());
}

// Generate SQL script for a selected sheet
function generateSQLForSheet(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) throw new Error('Sheet not found: ' + sheetName);

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    throw new Error('Sheet must have headers and at least one data row.');
  }

  const headers = data[0];
  const rows = data.slice(1);

  const types = headers.map((_, colIndex) => guessSQLType(rows.map(row => row[colIndex])));

  const tableName = sanitizeSQLName(sheetName);

  // Build CREATE TABLE statement
  let createTableSQL = `CREATE TABLE ${tableName} (\n`;
  headers.forEach((header, i) => {
    createTableSQL += `  ${sanitizeSQLName(header)} ${types[i]}`;
    createTableSQL += (i < headers.length - 1) ? ',\n' : '\n';
  });
  createTableSQL += ');\n\n';

  // Build INSERT statements
  let insertSQL = '';
  rows.forEach(row => {
    const values = row.map((val, i) => formatValue(val, types[i])).join(', ');
    insertSQL += `INSERT INTO ${tableName} (${headers.map(h => sanitizeSQLName(h)).join(', ')}) VALUES (${values});\n`;
  });

  return createTableSQL + insertSQL;
}

// Guess SQL data type based on values
function guessSQLType(values) {
  let isInt = true;
  let isFloat = true;
  let maxLength = 0;
  let isDate = true;

  for (const val of values) {
    if (val === '' || val === null || val === undefined) continue;
    const strVal = val.toString().trim();

    // Check integer
    if (isInt && !/^[-+]?\d+$/.test(strVal)) isInt = false;
    // Check float
    if (isFloat && !/^[-+]?\d+(\.\d+)?$/.test(strVal)) isFloat = false;
    // Check date
    if (isDate) {
      const d = new Date(strVal);
      if (isNaN(d.getTime())) isDate = false;
    }

    if (strVal.length > maxLength) maxLength = strVal.length;
  }

  if (isInt) return 'BIGINT'; // Large numbers like phone numbers
  if (isFloat) return 'FLOAT';
  if (isDate) return 'DATE'; // Store as DATE type
  return `VARCHAR(${Math.min(Math.max(maxLength, 1), 255)})`;
}

// Format values for SQL insert
function formatValue(val, type) {
  if (val === '' || val === null || val === undefined) return 'NULL';

  if (type === 'BIGINT' || type === 'INT' || type === 'FLOAT') return val;

if (type === 'DATE') {
  const d = new Date(val);
  if (isNaN(d.getTime())) return 'NULL';
  const yyyy = d.getFullYear();
  const mm = ('0' + (d.getMonth() + 1)).slice(-2);
  const dd = ('0' + d.getDate()).slice(-2);
  const hh = ('0' + d.getHours()).slice(-2);
  const mi = ('0' + d.getMinutes()).slice(-2);
  const ss = ('0' + d.getSeconds()).slice(-2);
  return `'${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}'`; // YYYY-MM-DD HH:MM:SS format
}


  // Escape single quotes for strings
  return `'${val.toString().replace(/'/g, "''")}'`;
}

// Sanitize names for SQL
function sanitizeSQLName(name) {
  return name.toString().replace(/[^\w]/g, '_');
}
