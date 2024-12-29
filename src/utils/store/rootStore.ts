import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import hl7Reducer from './slicers/Hl7MessageSlicer';
import excelExporterReducer from './slicers/ExcelExportSlicer';

const rootReducer = {
  hl7: hl7Reducer,
  excelExporter: excelExporterReducer,
};

const rootStore = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootStore.getState>;
export type AppDispatch = typeof rootStore.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export default rootStore;
