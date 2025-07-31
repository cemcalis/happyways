const otpMap = new Map();

export const saveOtpForEmail = (email, code) => {
  otpMap.set(email, {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });
};

export const getOtpForEmail = (email) => {
  return otpMap.get(email);
};

export const deleteOtpForEmail = (email) => {
  otpMap.delete(email);
};
