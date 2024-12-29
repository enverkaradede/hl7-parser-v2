import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ExcelExporterProps = {
  tableData: string;
};

const initialState: ExcelExporterProps = {
  tableData: '',
};

const excelExporterSlice = createSlice({
  name: 'excelExporter',
  initialState,
  reducers: {
    setTableData: (state, action: PayloadAction<string>) => {
      state.tableData = action.payload;
    },
  },
});

export const { setTableData } = excelExporterSlice.actions;
export default excelExporterSlice.reducer;
