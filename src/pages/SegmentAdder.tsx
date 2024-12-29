import React, { ChangeEvent, useEffect, useState } from 'react';
import Button from '../components/ui/Button';
import FieldTextInput from '../components/ui/FieldTextInput';
import Cross from '../images/cross.png';
import PageHeader from '../components/layouts/PageHeader';
import { useSelector } from 'react-redux';
import { RootState } from '../utils/store/rootStore';
import { Hl7FieldInfoObj } from '../utils/store/slicers/Hl7MessageSlicer';
import { electron } from 'process';
import Dropdown from '../components/ui/Dropdown';
import { ValueObjProps } from '../utils/store/slicers/Hl7MessageSlicer';
import { Link } from 'react-router-dom';

type RowDetail = {
  segmentName: string;
  fieldIndexInput: string;
  fieldDescInput: string;
  fieldOptionalityInput: string;
  fieldRepeatabilityInput: string;
};

type NewFields = {
  version: string;
  fieldInfo: Hl7FieldInfoObj;
};

const SegmentAdder = () => {
  const [error, setError] = useState({ isOccurred: false, text: '' });
  const hl7SegmentList: string[] = useSelector(
    (state: RootState) => state.hl7.segmentList,
  );
  const hl7FieldInfo = useSelector((state: RootState) => state.hl7.fieldInfo);
  const selectedHl7Version: string = useSelector(
    (state: RootState) => state.hl7.selectedVersion.value,
  );
  const headerArr = [
    'Segment Name',
    'Field Index',
    'Field Definition',
    'Optionality',
    'Repeatability',
    'Action',
  ];

  const [rows, setRows] = useState<RowDetail[]>([
    {
      segmentName: '',
      fieldIndexInput: '',
      fieldDescInput: '',
      fieldOptionalityInput: '',
      fieldRepeatabilityInput: '',
    },
  ]);
  const [currentRow, setCurrentRow] = useState<RowDetail>({
    segmentName: '',
    fieldIndexInput: '',
    fieldDescInput: '',
    fieldOptionalityInput: '',
    fieldRepeatabilityInput: '',
  });

  const updateState =
    (index: number, fieldName: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newArray = rows.map((item, i) => {
        if (index === i) {
          let value;
          if (
            fieldName === 'fieldRepeatabilityInput' ||
            fieldName === 'fieldOptionalityInput'
          ) {
            value = (e as unknown as ValueObjProps).value;
          }
          if (fieldName === 'segmentName') {
            value = e.target.value.toUpperCase();
          } else {
            value = e.target.value;
          }
          setCurrentRow({ ...item, [fieldName]: value });
          return { ...item, [fieldName]: value };
        } else {
          return item;
        }
      });
      setRows(newArray);
    };

  const hasDuplicates = (arr: RowDetail[]): boolean => {
    const seenCombinations = new Set();

    for (const obj of arr) {
      const combination = `${obj.segmentName}.${obj.fieldIndexInput}`;
      if (seenCombinations.has(combination)) {
        return true;
      }
      seenCombinations.add(combination);
    }

    return false;
  };

  const isNewField = (row: RowDetail) => {
    if (row.segmentName && row.fieldIndexInput) {
      if (hl7SegmentList.includes(row.segmentName)) {
        if (
          Object.keys(hl7FieldInfo[row.segmentName]).includes(
            `${row.segmentName}.${row.fieldIndexInput}`,
          )
        ) {
          return '3px red solid';
        }
        return '3px green solid';
      }
      return '3px green solid';
    }
    return '1px solid #e5e5e5b5';
  };

  useEffect(() => {
    if (currentRow.segmentName && currentRow.fieldIndexInput) {
      if (rows.length !== 0) {
        if (hl7SegmentList.includes(currentRow.segmentName)) {
          if (
            Object.keys(hl7FieldInfo[currentRow.segmentName]).includes(
              `${currentRow.segmentName}.${currentRow.fieldIndexInput}`,
            )
          ) {
            setError({
              isOccurred: true,
              text: 'This form has field(s) which already in dictionary.',
            });
          } else {
            setError({ isOccurred: false, text: '' });
          }
        } else {
          setError({ isOccurred: false, text: '' });
        }
      } else {
        setError({
          isOccurred: true,
          text: 'Please remove empty rows.',
        });
      }
      if (
        !currentRow.segmentName &&
        !currentRow.fieldIndexInput &&
        !currentRow.fieldDescInput &&
        !currentRow.fieldOptionalityInput &&
        !currentRow.fieldRepeatabilityInput
      ) {
        setError({ isOccurred: true, text: 'All fields must be filled.' });
      }
      if (hasDuplicates(rows))
        setError({
          isOccurred: true,
          text: 'Same field was occurred more than once.',
        });
    } else {
      setError({
        isOccurred: true,
        text: 'You need to add at least one field.',
      });
    }
  }, [currentRow, rows]);

  // const { ipcRenderer } = window.require('electron');

  const addNewFields = () => {
    let newFieldList: Hl7FieldInfoObj = {};
    let newSegmentArr = hl7SegmentList;

    rows.forEach((row) => {
      if (!newSegmentArr.includes(row.segmentName)) {
        newSegmentArr = [...newSegmentArr, row.segmentName];
      }

      if (!Object.keys(newFieldList).includes(row.segmentName)) {
        newFieldList[row.segmentName] = {};
      }

      if (
        !Object.keys(newFieldList[row.segmentName]).includes(
          `${row.segmentName}.${row.fieldIndexInput}`,
        )
      ) {
        newFieldList[row.segmentName][
          `${row.segmentName}.${row.fieldIndexInput}`
        ] = {
          name: '',
          required: '',
          repeat: '',
        };
      }

      newFieldList[row.segmentName][
        `${row.segmentName}.${row.fieldIndexInput}`
      ].name = row.fieldDescInput;
      newFieldList[row.segmentName][
        `${row.segmentName}.${row.fieldIndexInput}`
      ].required = row.fieldOptionalityInput;
      newFieldList[row.segmentName][
        `${row.segmentName}.${row.fieldIndexInput}`
      ].repeat = row.fieldRepeatabilityInput;
    });

    const additionalFieldsInfo: NewFields = {
      version: selectedHl7Version,
      fieldInfo: newFieldList,
    };

    window.electron.addNewFields(additionalFieldsInfo);

    let fieldAddResult;

    if (fieldAddResult && (fieldAddResult as string).includes('successfully')) {
      setRows([
        {
          segmentName: '',
          fieldIndexInput: '',
          fieldDescInput: '',
          fieldOptionalityInput: '',
          fieldRepeatabilityInput: '',
        },
      ]);
      setCurrentRow({
        segmentName: '',
        fieldIndexInput: '',
        fieldDescInput: '',
        fieldOptionalityInput: '',
        fieldRepeatabilityInput: '',
      });
    }

    alert(fieldAddResult);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div className="flex flex-row self-center mt-6">
        <Link to="/" className="mr-2 ml-2">
          <p>Return to HL7 Parser</p>
        </Link>
      </div>
      <PageHeader name="Segment/Field Adder" />

      <table
        style={{
          marginTop: '8em',
          width: '30vw',
          alignSelf: 'center',
          marginRight: 'auto',
          marginLeft: 'auto',
        }}
      >
        <thead>
          <tr style={{ width: '5vw' }}>
            {headerArr.map((header) => {
              return <th style={{ border: '1px solid black' }}>{header}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            return (
              <tr id={`${row.segmentName}.${row.fieldIndexInput}`}>
                <td>
                  <FieldTextInput
                    style={{
                      width: '5em',
                      height: '20px',
                      padding: '1rem',
                      border: isNewField(row),
                    }}
                    inputType="text"
                    maxInputLength={3}
                    inputName="segmentName"
                    onChange={updateState(index, 'segmentName')}
                    value={row.segmentName.toUpperCase()}
                  />
                </td>
                <td>
                  <FieldTextInput
                    style={{
                      width: '5em',
                      height: '20px',
                      padding: '1rem',
                      border: isNewField(row),
                    }}
                    inputType="number"
                    maxInputLength={2}
                    inputName="fieldIndexInput"
                    onChange={updateState(index, 'fieldIndexInput')}
                    value={row.fieldIndexInput}
                  />
                </td>
                <td>
                  <FieldTextInput
                    style={{
                      width: '20em',
                      height: '20px',
                      padding: '1rem',
                      border: isNewField(row),
                    }}
                    inputName="fieldDescInput"
                    onChange={updateState(index, 'fieldDescInput')}
                    value={row.fieldDescInput}
                  />
                </td>
                <td>
                  {/* <FieldTextInput
                    style={{
                      width: '7em',
                      padding: '1rem',
                      border: isNewField(row),
                    }}
                    inputName="fieldOptionalityInput"
                    onChange={updateState(index)}
                    value={row.fieldOptionalityInput}
                  />
∞ */}
                  <Dropdown
                    options={[
                      { value: '', label: 'Select' },
                      { value: 'O', label: 'O' },
                      { value: 'R', label: 'R' },
                      { value: 'B', label: 'B' },
                    ]}
                    isSearchable={false}
                    onChange={
                      updateState(index, 'fieldOptionalityInput') as any
                    }
                    placeHolder="Select"
                    isMulti={false}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignSelf: 'center',
                      width: '150px',
                      border: isNewField(row),
                    }}
                  />
                </td>
                <td>
                  {/* <FieldTextInput
                    style={{
                      width: '7em',
                      padding: '1rem',
                      border: isNewField(row),
                    }}
                    inputName="fieldRepeatabilityInput"
                    onChange={updateState(index, 'fieldRepeatabilityInput')}
                    value={row.fieldRepeatabilityInput}
                  /> */}
                  <Dropdown
                    options={[
                      { value: '', label: 'Select' },
                      { value: '-', label: '-' },
                      { value: '*', label: '*' },
                    ]}
                    isSearchable={false}
                    onChange={
                      updateState(index, 'fieldRepeatabilityInput') as any
                    }
                    placeHolder="Select"
                    isMulti={false}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignSelf: 'center',
                      width: '150px',
                      border: isNewField(row),
                    }}
                  />
                </td>
                <td className="flex justify-center">
                  <Button
                    text={
                      <img src={Cross} width="32" height="32" alt="cross" />
                    }
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      backgroundColor: 'red',
                      width: '40px',
                      height: '30px',
                      marginTop: '5px',
                    }}
                    onClick={() => {
                      const newArr = [...rows];
                      newArr.splice(index, 1);
                      setRows(newArr);
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex flex-row justify-between">
        <Button
          text="Add More Row"
          style={{
            marginTop: '1em',
            marginRight: '1em',
            paddingTop: '10px',
          }}
          onClick={() => {
            setRows([
              ...rows,
              {
                segmentName: '',
                fieldIndexInput: '',
                fieldDescInput: '',
                fieldOptionalityInput: '',
                fieldRepeatabilityInput: '',
              },
            ]);
          }}
        />

        <Button
          text="Save"
          style={{
            marginTop: '1em',
            marginLeft: '1em',
            paddingTop: '10px',
          }}
          onClick={() => {
            if (error.isOccurred) {
              alert(error.text);
            } else {
              addNewFields();
            }
          }}
        />
      </div>
    </div>
  );
};

export default SegmentAdder;
