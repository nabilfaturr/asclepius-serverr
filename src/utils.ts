export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
};

export const generateDate = () => {
  return new Date().toISOString();
};
