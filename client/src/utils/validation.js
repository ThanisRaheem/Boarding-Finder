export const nameLettersOnly = (v) => /^[A-Za-z\s]+$/.test(String(v).trim());

export const gmailValid = (v) =>
  /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(String(v).trim());

export const phoneValid = (v) => /^07\d{8}$/.test(String(v).trim());

export const nicValid = (v) => /^(\d{9}[Vv]|\d{10})$/.test(String(v).trim());

export const positiveInt = (v) => {
  const n = Number(v);
  return Number.isInteger(n) && n > 0;
};
