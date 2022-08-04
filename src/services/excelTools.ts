import fileUpload from "express-fileupload";
import Excel from "exceljs";

export function isAllowableExcelType(file: fileUpload.UploadedFile) {
  const excelAllowableTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  return excelAllowableTypes.includes(file.mimetype);
}

export const badDataError = "Bad Excel Data" as const;

export async function parseExcelForGrades(excelFile: fileUpload.UploadedFile) {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(excelFile.data);
  
    const worksheet = workbook.worksheets[0];
  
    // get columns, check if columns have required fields:  need grade and student id.
  
    const idRegex = /id/i;
    const gradeRegex = /grade/i;
  
    const headers = worksheet.getRow(1).values as Excel.CellValue[];
    const lastRow = worksheet.lastRow?.number;
  
    if (!lastRow || lastRow < 2) {
      throw new Error(badDataError);
    }
  
    let idColumn = 0;
    let gradeColumn = 0;
  
    let hasRequiredHeaders = false;
  
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
  
      if (header) {
        if (!idColumn) {
          idColumn = header.toString().match(idRegex) ? i : 0;
        }
  
        if (!gradeColumn) {
          gradeColumn = header.toString().match(gradeRegex) ? i : 0;
        }
  
        if (idColumn && gradeColumn) {
          hasRequiredHeaders = true;
          break;
        }
      }
    }
  
    if (!hasRequiredHeaders) {
      throw new Error(badDataError);
    }
  
    // now, loop through the columns and add them to an array to match the Google Sheets format.
  
    const rows: string[][] = [
      ["", headers[idColumn]!.toString(), headers[gradeColumn]!.toString()],
    ];
  
    // check the second row to see if the user has already calculated the raw grade themselves, or if it's in the format earned/total.
  
    const secondRow = worksheet.getRow(2).values as Excel.CellValue[];
  
    // need to rewrite without forced coercion.

    if (secondRow.length === 0) {
      throw new Error(badDataError);
    }
  
    const rawGradeCalculated = secondRow[gradeColumn]!.toString().includes("/")
      ? false
      : true;
  
    for (let i = 2; i <= lastRow; i++) {
      const row = worksheet.getRow(i).values as Excel.CellValue[];

      if (row.length === 0) {
        break;
      }
  
      // need someway to check if the number is there, or if it's zero.
  
      if (row[idColumn]) {
  
        rows.push(["", row[idColumn]!.toString(), row[gradeColumn]!.toString()]);
      }
    };

    console.log(rows);

    if (rows[0].length === 0) {
      // if nothing in the very first row, then clearly the user passed through a blank spreadsheet
      throw new Error(badDataError);
    }
  
    return {
        rows: rows,
        rawGradeCalculated: rawGradeCalculated
    }
  };


  export const studentUploadExcelParseError = "Parsing Error" as const;

  export async function parseExcelForStudentUpload(excelFile: fileUpload.UploadedFile) {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(excelFile.data);
  
    const worksheet = workbook.worksheets[0];

    // make sure that the file is in fact a student upload file by checking the header.

    const headers = worksheet.getRow(1).values as Excel.CellValue[];
    const lastRow = worksheet.lastRow?.number;

    if (!lastRow || lastRow < 2) {
        throw new Error(studentUploadExcelParseError);
      }

    const requiredHeaders = ["Last Name:", "First Name:", "ID:", "Courses: (if in multiple courses, separate by commas)."];

    for (let i = 0; i < 4; i++) {
        const header = headers[i+1];
        const requiredHeader = requiredHeaders[i];

        console.log(header?.toString());
        console.log(requiredHeader);

        if (header?.toString() !== requiredHeader) {
            throw new Error(studentUploadExcelParseError)
        }
    }

    // parse the sheet to be acceptable into the parseRosterSheetRows function

    const rows : string[][] = [];

    for (let i = 2; i < lastRow; i++) {
        const row = worksheet.getRow(i).values as Excel.CellValue[];
        
        if (row.length === 0) {
          break;
        }
        const lastName = row[1]!.toString();
        const firstName = row[2]!.toString();
        const id = row[3]!.toString()!;
        const courses = row[4]!.toString();
    
          rows.push([lastName, firstName, id, courses]);
    }

    return rows;
  }
  