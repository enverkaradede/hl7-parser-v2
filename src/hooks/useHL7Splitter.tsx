import { useSelector } from 'react-redux';
import segmentSplitter from '../utils/pure/segmentSplitter';
import fieldSplitter from '../utils/pure/fieldSplitter';
import {
  setMessageType,
  setSelectedHl7Version,
} from '../utils/store/slicers/Hl7MessageSlicer';
//TODO: I'm gonna use "SELECT fields FROM segments WHERE version=$version" to get the same result as fieldInfoArr
// import fieldInfoArr from '../utils/store/dictionaries/field_dictionary';
import { RootState, useAppDispatch } from '../utils/store/rootStore';
import { useEffect, useRef } from 'react';

const useHL7Splitter = () => {
  const hl7 = useSelector((state: RootState) => state.hl7);
  const hl7FieldInfo = useSelector((state: RootState) => state.hl7.fieldInfo);
  const hl7VersionList = useSelector(
    (state: RootState) => state.hl7.versionList,
  );
  const selectedHl7Version = useSelector(
    (state: RootState) => state.hl7.selectedVersion,
  );
  const dispatch = useAppDispatch();
  let messageType: string = '';
  let messageHl7Version: string = '';
  let mdTable: string = '';

  if (!hl7) messageType = '';

  const segmentedMessage: string[] = segmentSplitter(hl7.message);

  const splitMessageArr: string[][] = segmentedMessage.map(
    (segment: string) => {
      const segmentArr: string[] = fieldSplitter(segment);

      if (segment.includes('MSH')) {
        segmentArr.splice(1, 0, '|');
        // eslint-disable-next-line prefer-destructuring
        messageType = segmentArr[9];
        // eslint-disable-next-line prefer-destructuring
        messageHl7Version = segmentArr[12];
      }

      return segmentArr;
    },
  );

  dispatch(setMessageType(messageType));

  mdTable +=
    `## ${messageType} \n` +
    '|Field Code|Field Name|Sample Value|\n' +
    '|:---|:---:|:---|\n';

  //TODO: find a better approach other than unknown[] type
  const detailedFieldArr: unknown[] = splitMessageArr.map(
    (segment: string[]) => {
      const segmentName: string = segment[0];

      let fieldName;

      return segment.map((field: string, fieldIndex: number) => {
        if (field === '' || fieldIndex === 0) return;
        const fieldIndicator: string = `${segmentName}.${fieldIndex}`;
        if (!(segmentName in hl7FieldInfo)) {
          fieldName = ['Unknown Field Name', '?', '?'];
        } else if (!(fieldIndicator in hl7FieldInfo[segmentName])) {
          fieldName = ['Unknown Field Name', '?', '?'];
        } else {
          fieldName = Object.values(hl7FieldInfo[segmentName][fieldIndicator]);
        }

        field === '|'
          ? (mdTable += `|${fieldIndicator}|${hl7FieldInfo?.[segmentName]?.[fieldIndicator]?.name}|\\${field}|\n`)
          : (mdTable += `|${fieldIndicator}|${hl7FieldInfo?.[segmentName]?.[fieldIndicator]?.name}|${field}|\n`);

        return [fieldIndicator, field, ...fieldName];
      });
    },
  );

  // dispatch(setParsedMessage(detailedFieldArr));

  return { detailedFieldArr, mdTable };
};

export default useHL7Splitter;
