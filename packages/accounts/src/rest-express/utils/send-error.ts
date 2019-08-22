export const sendError = (res: any, err: any) =>
  res.status(400).json({
    message: err.message,
    loginInfo: err.loginInfo,
    errorCode: err.errorCode,
  });
