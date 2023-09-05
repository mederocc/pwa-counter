import * as XLSX from "xlsx";

export const downloadAsXLSX = (data, lotName) => {
  const orderedData = data.map((item) => {
    const { station, comments, date, ...rest } = item;

    // Sort other properties alphabetically
    const sortedProperties = Object.keys(rest).sort();

    // Reconstruct the object with the desired order
    return {
      station,
      date: new Date(date).toLocaleDateString("es-ES"),
      ...sortedProperties.reduce((obj, key) => {
        obj[key] = rest[key];
        return obj;
      }, {}),
      comments,
    };
  });

  // Create a workbook
  const wb = XLSX.utils.book_new();

  // Create a worksheet
  const ws = XLSX.utils.json_to_sheet(orderedData);

  XLSX.utils.book_append_sheet(wb, ws, "sheet1");
  XLSX.writeFile(wb, `${lotName}-${orderedData[0].date}.xlsx`);
};
