const replacer = (text: string, oldValue: string, newValue: string): string => {
  const allOccurrence = new RegExp(oldValue, 'g');

  return text.replace(allOccurrence, newValue);
};

export default replacer;
