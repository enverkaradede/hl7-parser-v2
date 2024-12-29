import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type HL7FieldDetail = { name: string; required: string; repeat: string };
type HL7FieldInfo = { [key: string]: HL7FieldDetail };
type Hl7FieldInfoObj = { [key: string]: HL7FieldInfo };

type ValueObjProps = {
  value: string;
  label: string;
};

type NameObjProps = {
  name: string;
  value: string;
};

type Hl7MessageProps = {
  message: string;
  messageType: string;
  parseType: ValueObjProps;
  mappingXml: string;
  versionList: string[];
  selectedVersion: ValueObjProps;
  segmentList: string[];
  fieldInfo: Hl7FieldInfoObj;
};

const initialState: Hl7MessageProps = {
  message: '',
  messageType: '',
  parseType: { value: '', label: '' },
  mappingXml: '',
  versionList: [],
  selectedVersion: { value: '2.4', label: '2.4' },
  segmentList: [],
  fieldInfo: {},
};

const hl7MessageSlice = createSlice({
  name: 'hl7',
  initialState,
  reducers: {
    setHl7Text: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    setMessageType: (state, action: PayloadAction<string>) => {
      state.messageType = action.payload;
    },
    setParseType: (state, action: PayloadAction<ValueObjProps>) => {
      state.parseType = action.payload;
    },
    setMappingXml: (state, action: PayloadAction<string>) => {
      state.mappingXml = action.payload;
    },
    setHl7VersionList: (state, action: PayloadAction<string[]>) => {
      state.versionList = action.payload;
    },
    setSelectedHl7Version: (state, action: PayloadAction<ValueObjProps>) => {
      state.selectedVersion = action.payload;
    },
    setHl7SegmentList: (state, action: PayloadAction<string[]>) => {
      state.segmentList = action.payload;
    },
    setHl7FieldInfo: (state, action: PayloadAction<Hl7FieldInfoObj>) => {
      state.fieldInfo = action.payload;
    },
  },
});

export type {
  HL7FieldInfo,
  Hl7FieldInfoObj,
  HL7FieldDetail,
  ValueObjProps,
  NameObjProps,
};
export const {
  setHl7Text,
  setMessageType,
  setParseType,
  setMappingXml,
  setHl7VersionList,
  setSelectedHl7Version,
  setHl7SegmentList,
  setHl7FieldInfo,
} = hl7MessageSlice.actions;
export default hl7MessageSlice.reducer;
