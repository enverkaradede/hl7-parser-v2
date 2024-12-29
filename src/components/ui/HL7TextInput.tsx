import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../style/ui/TextInput.css';
import { setHl7Text } from '../../utils/store/slicers/Hl7MessageSlicer';
import { RootState } from '../../utils/store/rootStore';

type HL7TextInputProps = {
  inputRow?: string;
  inputColumn?: string;
  inputName?: string;
  style?: object;
};

function HL7TextInput({
  inputRow = '1',
  inputColumn = '20',
  inputName,
  style,
}: HL7TextInputProps) {
  // TODO: Relocate the dispatch and textHandler functions here to create more generic TextInput component

  const hl7Message = useSelector((state: RootState) => state.hl7.message);
  const dispatch = useDispatch();

  const textHandler: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    dispatch(setHl7Text(e.target.value));
  };

  return (
    <div>
      <textarea
        rows={parseInt(inputRow, 10)}
        cols={parseInt(inputColumn, 10)}
        name={inputName}
        id={inputName}
        onChange={textHandler}
        value={hl7Message}
        className="h-48 text-input mt-8 mb-8 p-4 resize-y self-center font-normal leading-relaxed"
        // style={{ ...style }}
      />
    </div>
  );
}

HL7TextInput.defaultProps = {
  inputRow: '10',
  inputColumn: '20',
  inputName: 'defaultInput',
  style: {
    height: '200px',
    resize: 'none',
    marginTop: '5em',
  },
};

export default HL7TextInput;
