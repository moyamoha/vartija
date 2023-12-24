import * as ExcelJs from 'exceljs';
import { EntryDocument } from 'src/schemas/entry.schema';

const TITLE_ROW = [
  'Category',
  'Title',
  'Username',
  'Password',
  'Url',
  'Status',
];

export type UserDataForDownload = {
  name: string;
  items: EntryDocument[];
}[];
export function writeUserDataToExcel(userData: any): ExcelJs.Workbook {
  const rows = transformUserDataToExcelRows(userData);
  const wb = new ExcelJs.Workbook();
  wb.clearThemes();
  const sheet = wb.addWorksheet('User Data');
  setColumnWidths(sheet, [15, 25, 25, 25, 38, 10]);
  addTitleRow(sheet, rows[0]);
  sheet.addRows(rows.slice(1));
  return wb;
}

function setColumnWidths(sheet: ExcelJs.Worksheet, widths: number[]) {
  for (let i = 1; i <= widths.length; i++) {
    sheet.getColumn(i).width = widths[i - 1];
  }
}

function addTitleRow(sheet: ExcelJs.Worksheet, row) {
  const addedRow = sheet.addRow(row);
  addedRow.eachCell((cell: ExcelJs.Cell) => {
    cell.font = { bold: true };
  });
}

function transformUserDataToExcelRows(userData: any): string[][] {
  const result = [TITLE_ROW];
  for (const category of userData) {
    for (const entry of category.items) {
      const row = [];
      row.push(category.name);
      row.push(entry.title);
      row.push(entry.username);
      row.push(entry.password);
      row.push(entry.url);
      row.push(entry.status);
      result.push(row);
    }
  }
  return result;
}
