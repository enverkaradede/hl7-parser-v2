const combineContentHtml = (
  messageContent: string,
  tableContent: string,
): string => {
  const combinedHtml: string = `<body>
        <h2>Original Message</h2>
        <pre style="text-align: left;">${messageContent}</pre>
        </br>
        </br>
        <h2>Mapping Table</h2>
        ${tableContent}
    </body>`;

  return combinedHtml;
};

export { combineContentHtml };
