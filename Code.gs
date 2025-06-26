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

  let createTableSQL = `CREATE TABLE ${tableName} (\n`;
  headers.forEach((header, i) => {
    createTableSQL += `  ${sanitizeSQLName(header)} ${types[i]}`;
    createTableSQL += (i < headers.length - 1) ? ',\n' : '\n';
  });
  createTableSQL += ');\n\n';

  let insertSQL = '';
  rows.forEach(row => {
    const values = row.map((val, i) => formatValue(val, types[i])).join(', ');
    insertSQL += `INSERT INTO ${tableName} (${headers.map(h => sanitizeSQLName(h)).join(', ')}) VALUES (${values});\n`;
  });

  return createTableSQL + insertSQL;
}

function guessSQLType(values) {
  let isInt = true;
  let isFloat = true;
  let maxLength = 0;
  let hasDate = false;

  for (const val of values) {
    if (val === '' || val === null || val === undefined) continue;
    const strVal = val.toString();

    if (isInt && !/^[-+]?\d+$/.test(strVal)) isInt = false;
    if (isFloat && !/^[-+]?\d+(\.\d+)?$/.test(strVal)) isFloat = false;

    if (strVal.length > maxLength) maxLength = strVal.length;

    if (!hasDate) {
      const d = new Date(val);
      if (!isNaN(d.getTime())) hasDate = true;
    }
  }

  if (isInt) return 'INT';
  if (isFloat) return 'FLOAT';
  if (hasDate) return 'DATETIME';
  return `VARCHAR(${Math.min(Math.max(maxLength, 1), 255)})`;
}

function formatValue(val, type) {
  if (val === '' || val === null || val === undefined) return 'NULL';

  if (type === 'INT' || type === 'FLOAT') {
    return val;
  }
  if (type === 'DATETIME') {
    const d = new Date(val);
    if (isNaN(d.getTime())) return 'NULL';
    const yyyy = d.getFullYear();
    const mm = ('0' + (d.getMonth() + 1)).slice(-2);
    const dd = ('0' + d.getDate()).slice(-2);
    const hh = ('0' + d.getHours()).slice(-2);
    const mi = ('0' + d.getMinutes()).slice(-2);
    const ss = ('0' + d.getSeconds()).slice(-2);
    return `'${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}'`;
  }

  return `'${val.toString().replace(/'/g, "''")}'`;
}

function sanitizeSQLName(name) {
  return name.toString().replace(/[^\w]/g, '_');
}
