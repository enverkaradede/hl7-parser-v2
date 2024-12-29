import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../style/ui/TextInput.css';
import { setHl7Text } from '../../utils/store/slicers/Hl7MessageSlicer';

type FieldTextInput = {
  inputType?: 'text' | 'number';
  maxInputLength?: number;
  inputName?: string;
  style?: { [key: string]: string };
  value?: string;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const FieldTextInput = ({
  inputType = 'text',
  maxInputLength = -1,
  inputName,
  style,
  value,
  className,
  onChange,
}: FieldTextInput) => {
  //TODO: Relocate the dispatch and textHandler functions here to create more generic TextInput component

  //   const hl7Message = useSelector((state) => state.hl7.message);
  //   const dispatch = useDispatch();

  // function handleChange(evt) {
  //   const value = evt.target.value;
  //   setState({
  //     ...state,
  //     [evt.target.name]: value,
  //   });
  // }

  return (
    <>
      <input
        type={inputType}
        maxLength={maxInputLength}
        name={inputName || 'defaultInput'}
        id={inputName || 'defaultInput'}
        onChange={onChange}
        value={value}
        className={`text-input ${className}`}
        style={style || {}}
      />
    </>
  );
};

export default FieldTextInput;
