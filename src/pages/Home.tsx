/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../utils/store/rootStore';
import PageFooter from '../components/layouts/PageFooter';
import PageHeader from '../components/layouts/PageHeader';
import HL7TextInput from '../components/ui/HL7TextInput';
import useHL7Splitter from '../hooks/useHL7Splitter';
import Table from '../components/ui/Table';
import Dropdown from '../components/ui/Dropdown';
import { useTableData } from '../hooks/useTableDataHtml';
import {
  HL7FieldInfo,
  Hl7FieldInfoObj,
  setHl7FieldInfo,
  setHl7SegmentList,
  setHl7VersionList,
  setParseType,
  setSelectedHl7Version,
} from '../utils/store/slicers/Hl7MessageSlicer';
import CodeblockViewer from '../components/ui/CodeblockViewer';
import useHL7Segmenter from '../hooks/useHL7Segmenter';
import {
  NameObjProps,
  ValueObjProps,
} from '../utils/store/slicers/Hl7MessageSlicer';

function Home() {
  const hl7Message: string = useSelector(
    (state: RootState) => state.hl7.message,
  );
  const hl7MessageType: string = useSelector(
    (state: RootState) => state.hl7.messageType,
  );
  const parseType: ValueObjProps = useSelector(
    (state: RootState) => state.hl7.parseType,
  );
  const hl7VersionList: string[] = useSelector(
    (state: RootState) => state.hl7.versionList,
  );
  const hl7SegmentList: string[] = useSelector(
    (state: RootState) => state.hl7.segmentList,
  );
  const selectedHl7Version: ValueObjProps = useSelector(
    (state: RootState) => state.hl7.selectedVersion,
  );

  const [versionListOps, setVersionListOps] = useState<ValueObjProps[]>([]);
  const [tableType, setTableType] = useState<ValueObjProps>({
    value: '',
    label: 'Select a Table Type',
  });
  const dispatch = useAppDispatch();

  const getHl7VersionList = async (): Promise<void> => {
    const result: string[] = await window.electron.getHl7Versions();

    const versionList: ValueObjProps[] = [
      { value: '', label: 'Select a HL7 Version' },
      ...result.map((version: string) => {
        return { value: version, label: version };
      }),
    ];

    setVersionListOps(versionList);
    dispatch(setHl7VersionList(result));
  };

  const getHl7SegmentList = async (): Promise<void> => {
    const result: string[] = await window.electron.getHl7Segments(
      selectedHl7Version.value,
    );

    dispatch(setHl7SegmentList(result));
  };

  const getHl7FieldInfo = async (): Promise<void> => {
    const result: Hl7FieldInfoObj = await window.electron.getHl7FieldInfo(
      selectedHl7Version.value,
    );

    dispatch(setHl7FieldInfo(result));
  };

  useEffect(() => {
    getHl7VersionList();
    getHl7SegmentList();
    getHl7FieldInfo();

    return () => {};
  }, [selectedHl7Version]);

  const headerArr: string[] = [
    'Segment',
    'Segment Definition',
    'Sample Data',
    'Optionality',
    'Repeatability',
  ];

  const parseOps: ValueObjProps[] = [
    { value: '', label: 'Select a Parser' },
    { value: 'phl7', label: 'Parse HL7' },
    { value: 'shl7', label: 'Segmentize HL7' },
  ];

  const tableOps: ValueObjProps[] = [
    { value: '', label: 'Select a Table Type' },
    { value: 'tbl', label: 'Table' },
    { value: 'mdtbl', label: 'MarkDown Table' },
  ];

  const { detailedFieldArr, mdTable } = useHL7Splitter();
  const { segmentedMessage } = useHL7Segmenter();
  const { tableDataHtml } = useTableData(
    <Table
      messageType={hl7MessageType}
      data={detailedFieldArr}
      headerArr={headerArr}
    />,
  );

  return (
    <>
      <PageHeader name="HL7 Parser" />
      <div className="flex flex-row self-center">
        <span className="self-center mr-2">HL7 Version: </span>
        <Dropdown
          options={versionListOps}
          isSearchable={false}
          onChange={(value: ValueObjProps | ValueObjProps[] | NameObjProps) => {
            if (!Array.isArray(value))
              dispatch(setSelectedHl7Version(value as ValueObjProps));
          }}
          placeHolder="Select a HL7 Version"
          defaultValue={selectedHl7Version}
          isMulti={false}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignSelf: 'center',
            width: '200px',
          }}
        />
      </div>
      <HL7TextInput inputRow="5" inputName="hl7-input" />
      <Dropdown
        options={parseOps}
        isSearchable={false}
        onChange={(value: ValueObjProps | ValueObjProps[] | NameObjProps) => {
          if (!Array.isArray(value))
            dispatch(setParseType(value as ValueObjProps));
        }}
        placeHolder="Select a Parser"
        isMulti={false}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignSelf: 'center',
          marginBottom: '1em',
        }}
      />
      {parseType.value === 'phl7' ? (
        <Dropdown
          options={tableOps}
          isSearchable={false}
          onChange={(value: ValueObjProps | ValueObjProps[] | NameObjProps) => {
            if (!Array.isArray(value)) setTableType(value as ValueObjProps);
          }}
          placeHolder="Select a Table Type"
          isMulti={false}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignSelf: 'center',
            marginBottom: '1em',
          }}
        />
      ) : (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <></>
      )}

      {hl7Message !== '' && parseType.value !== '' ? (
        parseType.value === 'phl7' && tableType.value === 'tbl' ? (
          <Table
            messageType={hl7MessageType}
            headerArr={headerArr}
            data={detailedFieldArr}
            content={tableDataHtml}
            message={hl7Message}
          />
        ) : parseType.value === 'phl7' && tableType.value === 'mdtbl' ? (
          <pre
            style={{
              textAlign: 'left',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {mdTable}
          </pre>
        ) : parseType.value === 'shl7' ? (
          <CodeblockViewer codeblock={segmentedMessage} />
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
      <PageFooter />
    </>
  );
}

export default Home;
