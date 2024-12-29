const fs = require('fs');

const extractFileName = (
  filePath: string,
  defaultFileName?: string,
): string => {
  const fileLocationArr: string[] = filePath.split('/');
  const fileName: string =
    fileLocationArr.pop() !== undefined
      ? (fileLocationArr.pop() as string)
      : defaultFileName
        ? defaultFileName
        : '';

  return fileName;
};

const saveToFile = (filePath: string, content: string): string => {
  fs.writeFileSync(filePath, content);

  return extractFileName(filePath);
};

export { saveToFile, extractFileName };
