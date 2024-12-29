/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  MessageBoxOptions,
  nativeImage,
  SaveDialogOptions,
  clipboard,
} from 'electron';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import {
  getFieldInfoList,
  getSegmentList,
  getVersionList,
  upsertFields,
} from '../electron/services/Database.service';
import excelExport from '../electron/utils/excelExporter';
import { NewFields } from './preload';
import { saveToFile } from '../electron/utils/fileSaver';

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

const appIcon = nativeImage.createFromPath(getAssetPath('icon.png'));

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const createWindow = async (url?: string) => {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1080,
    height: 900,
    icon: appIcon,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  // eslint-disable-next-line no-unused-expressions
  url
    ? mainWindow.loadURL(url)
    : mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((e) => {
    createWindow(e.url);
    return { action: 'deny' };
  });
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    ipcMain.handle('getVersions', async () => {
      return getVersionList();
    });
    ipcMain.handle('getSegments', async (_event, { version }) => {
      return getSegmentList(version);
    });
    ipcMain.handle('getFieldInfo', async (_event, { version }) => {
      return getFieldInfoList(version);
    });
    ipcMain.handle(
      'get-table-data',
      (_event, { messageType, tableData, headerData }) => {
        const saveDialogOptions: SaveDialogOptions = {
          title: 'Export to Excel',
          defaultPath: path.join(
            app.getPath('downloads'),
            'Mapping Table.xlsx',
          ),
          filters: [{ name: 'Excel', extensions: ['xlsx'] }],
        };

        dialog
          .showSaveDialog(
            BrowserWindow.getFocusedWindow() as BrowserWindow,
            saveDialogOptions,
          )
          .then(({ filePath, canceled }) => {
            if (filePath && !canceled) {
              const fileName = excelExport({
                filePath,
                messageType,
                tableData,
                headerData,
              });

              if (fileName) {
                const messageBoxOptions: MessageBoxOptions = {
                  type: 'none',
                  buttons: ['Okay'],
                  title: 'Info Message!',
                  icon: appIcon,
                  message: `Mapping table has been exported to ${filePath}`,
                };

                dialog.showMessageBox(
                  BrowserWindow.getFocusedWindow() as BrowserWindow,
                  messageBoxOptions,
                );
              }
            } else {
              dialog.showErrorBox(
                'Export Error',
                'Something went wrong during the export.',
              );
            }
          });
      },
    );
    ipcMain.handle('save-to-file', (_event, { content }) => {
      const saveDialogOptions: SaveDialogOptions = {
        title: 'Export to XML',
        defaultPath: path.join(
          app.getPath('downloads'),
          'Transformer Mapping.xml',
        ),
        filters: [{ name: 'XML', extensions: ['xml'] }],
      };

      dialog
        .showSaveDialog(
          BrowserWindow.getFocusedWindow() as BrowserWindow,
          saveDialogOptions,
        )
        .then(({ filePath, canceled }) => {
          if (filePath && !canceled) {
            const fileName = saveToFile(filePath, content);

            if (fileName) {
              const messageBoxOptions: MessageBoxOptions = {
                type: 'none',
                buttons: ['Okay'],
                title: 'Info Message!',
                icon: appIcon,
                message: `Transformer mapping has been exported to ${filePath}`,
              };

              dialog.showMessageBox(
                BrowserWindow.getFocusedWindow() as BrowserWindow,
                messageBoxOptions,
              );
            }
          } else {
            dialog.showErrorBox(
              'Export Error',
              'Something went wrong during the export.',
            );
          }
        });
    });
    ipcMain.handle('clipboard-copy', (_event, { content }) => {
      const mappingXml = Buffer.from(content).toString('utf8');

      clipboard.writeText(mappingXml);

      const messageBoxOptions: MessageBoxOptions = {
        type: 'none',
        buttons: ['Okay'],
        title: 'Info Message!',
        message: 'Copied!',
        icon: appIcon,
      };
      dialog.showMessageBox(
        BrowserWindow.getFocusedWindow() as BrowserWindow,
        messageBoxOptions,
      );
    });
    ipcMain.handle(
      'add-new-fields',
      (_event, { version, fieldInfo }: NewFields) => {
        const newSegments: string[] = Object.keys(fieldInfo);

        newSegments.forEach((segment: string) => {
          upsertFields(segment, fieldInfo[segment], version);
        });
      },
    );
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
