const isConnectedToInternet = (): boolean => {
  return navigator.onLine;
};

export { isConnectedToInternet };
