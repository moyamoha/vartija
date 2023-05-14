export const randomPass = () => {
  return (Math.random() + 1).toString(36).substring(2);
};
