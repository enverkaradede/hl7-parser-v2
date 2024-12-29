import { useDispatch, useSelector } from 'react-redux';
//TODO: I'm gonna use "SELECT segment_name FROM segments WHERE version=$version" from hl7.db to get the same result as segmentInfoArr
// import segmentInfoArr from '../utils/store/dictionaries/segment_dictionary';
import replacer from '../utils/pure/replacer';
import { RootState } from '../utils/store/rootStore';

const useHL7Segmenter = (): { segmentedMessage: string } => {
  const hl7Message: string = useSelector(
    (state: RootState) => state.hl7.message,
  );
  const hl7SegmentList: string[] = useSelector(
    (state: RootState) => state.hl7.segmentList,
  );

  let segmentedMessage: string = hl7Message;
  hl7SegmentList.forEach((segmentHeader: string) => {
    segmentedMessage = replacer(
      segmentedMessage,
      `${segmentHeader}\\|`,
      `\n${segmentHeader}\|`,
    );
  });

  return { segmentedMessage };
};

export default useHL7Segmenter;
