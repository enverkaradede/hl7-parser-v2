const segmentSplitter = (hl7: string): string[] => {
  return hl7.split('\n').filter((item) => item !== '');
};

export default segmentSplitter;
