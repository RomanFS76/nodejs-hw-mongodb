import {
  login,
  register,
  refreshUserSession,
  logout,
  requestResetToken,
  resetPassword,
} from '../services/auth.js';

const setupSession = (res, session) => {
  const { _id, refreshToken, refreshTokenValidUntil } = session;

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });
  res.cookie('sessionId', _id, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });
};

export const registerController = async (req, res) => {
  const data = await register(req.body);
  const { name } = req.body;
  res.status(201).json({
    status: 201,
    message: `Successfully registred ${name}`,
    data,
  });
};

export const loginController = async (req, res) => {
  const session = await login(req.body);

  setupSession(res, session);

  res.status(200).json({
    status: 200,
    message: `Successfully loged`,
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshSessionController = async (req, res) => {
  const session = await refreshUserSession(req.cookies);

  setupSession(res, session);

  res.status(200).json({
    status: 200,
    message: `Successfully refreshed a session!`,
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (sessionId) {
    await logout(sessionId);
  }
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

export const requestResetEmailController = async (req, res) => {
  const { email } = req.body;
  await requestResetToken(email);

  res.json({
    message: 'Reset password email was successfully sent!',
    status: 200,
    data: {},
  });
};

export const resetPasswordController  = async (req,res) => {
  // const {token} = req.query;
  // const {password} = req.body;
  await resetPassword (req.body);

  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};

