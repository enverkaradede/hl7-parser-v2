// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

type HL7FieldDetail = { name: string; required: string; repeat: string };
type HL7FieldInfo = { [key: string]: HL7FieldDetail };
type Hl7FieldInfoObj = { [key: string]: HL7FieldInfo };
type NewFields = {
  version: string;
  fieldInfo: Hl7FieldInfoObj;
};

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  getHl7Versions: () => ipcRenderer.invoke('getVersions'),
  getHl7Segments: (version: string) =>
    ipcRenderer.invoke('getSegments', { version }),
  getHl7FieldInfo: (version: string) =>
    ipcRenderer.invoke('getFieldInfo', { version }),
  exportToExcel: ({
    // filePath,
    messageType,
    tableData,
    headerData,
  }: {
    // filePath: string;
    messageType: string;
    tableData: string[][][] | unknown[];
    headerData: string[];
  }) => {
    ipcRenderer.invoke('get-table-data', {
      // filePath,
      messageType,
      tableData,
      headerData,
    });
  },
  exportToXml: (content: string) => {
    ipcRenderer.invoke('save-to-file', { content });
  },
  copyToClipboard: (content: string) => {
    ipcRenderer.invoke('clipboard-copy', { content });
  },
  addNewFields: (newFieldInfo: NewFields) => {
    ipcRenderer.invoke('add-new-fields', newFieldInfo);
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
export type { HL7FieldDetail, HL7FieldInfo, Hl7FieldInfoObj, NewFields };
