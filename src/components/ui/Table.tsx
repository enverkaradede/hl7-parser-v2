import React from 'react';

// import { openUrlPopup } from '../../utils/electron/windowHelper';
import Button from './Button';

// Use destructuring for cleaner code
// const { dialog, ipcRenderer } = window.require('electron');

type TableData = string[][];

interface TableProps {
  messageType: string;
  message?: string;
  headerArr: string[];
  data: TableData[] | unknown[];
  content?: string;
}

interface SendTableDataProps {
  // filePath: string;
  messageType: string;
  tableData: TableData[] | unknown[];
  headerData: string[];
}

function Table({
  messageType,
  /*message,*/ headerArr,
  data,
  content,
}: TableProps) {
  let isUnknown = false;

  const sendTableData = ({
    // filePath,
    messageType,
    tableData,
    headerData,
  }: SendTableDataProps) => {
    window.electron.exportToExcel({
      // filePath,
      messageType,
      tableData,
      headerData,
    });
  };

  // ipcRenderer.on("send-file-name", (event, arg) => {
  //   console.log(arg);
  // });

  return (
    <div className="self-center items-center">
      {data ? (
        <>
          <table id="parsed" style={{ margin: '2em' }}>
            <thead>
              <tr>
                {headerArr.map((header) => {
                  return (
                    <th
                      style={
                        data.length === 0 ? {} : { border: '1px solid black' }
                      }
                    >
                      {header}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody
              style={data.length === 0 ? {} : { border: '1px solid black' }}
            >
              {(data as TableData[]).map((row, rowIndex) =>
                row.map((cell, cellIndex) => {
                  if (cell === undefined) return;
                  if (cell[2] === 'Unknown Field Name') isUnknown = true;

                  return (
                    <tr key={`${rowIndex}-${cellIndex}`}>
                      <td style={{ border: '1px solid black' }}>{cell[0]}</td>
                      <td style={{ border: '1px solid black' }}>{cell[2]}</td>
                      <td style={{ border: '1px solid black' }}>{cell[1]}</td>
                      <td style={{ border: '1px solid black' }}>{cell[3]}</td>
                      <td style={{ border: '1px solid black' }}>{cell[4]}</td>
                    </tr>
                  );
                }),
              )}
            </tbody>
          </table>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}
          >
            <Button
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}
              text="Export to Excel"
              // onClick={() =>
              //   dialog
              //     .showSaveDialog({
              //       title: 'Save Mapped Table',
              //       filters: [
              //         {
              //           name: 'Excel',
              //           extensions: ['xlsx'],
              //         },
              //       ],
              //     })
              //     .then((file: any) => {
              //       //TODO: find the correct type for this
              //       if (file.filePath !== '' && file.filePath !== undefined) {
              //         sendTableData({
              //           filePath: file.filePath.toString(),
              //           messageType: messageType,
              //           tableData: data,
              //           headerData: headerArr,
              //         });
              //       }
              //     })
              // }
              onClick={() => {
                window.electron.exportToExcel({
                  messageType: messageType,
                  tableData: data,
                  headerData: headerArr,
                });
              }}
            />
            {/* <Button
              text="Open in Separate Window"
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}
              onClick={() => {
                if (data.length === 0) {
                  alert(
                    'Nothing to show. Please enter a valid HL7 message first.',
                  );
                } else {
                  openUrlPopup({
                    message,
                    messageType,
                    content,
                  });
                }
              }}
            /> */}
            {isUnknown && (
              <Button
                text="Add Unknown Field(s)"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}
                onClick={() => (window.location.href = '#/add_segment')}
              />
            )}
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Table;
