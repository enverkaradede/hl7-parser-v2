import { renderToString } from 'react-dom/server';
// import { useDispatch } from "react-redux";
// import { setTableData } from "../utils/store/slicers/ExcelExportSlicer";
// import { useSelector } from "react-redux";

const useTableData = (
  tableComponent: JSX.Element,
): { tableDataHtml: string } => {
  const tableDataHtml: string = renderToString(tableComponent).replace(
    '#',
    '&num;',
  );
  return { tableDataHtml };
};

export { useTableData };
