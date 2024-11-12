import { login, register } from '../services/auth.js';

export const registerController = async (req, res) => {
  await register(req.body);
  const { name } = req.body;
  res.status(201).json({
    status: 201,
    message: `Successfully registred ${name}`,
  });
};

export const loginController = async (req, res) => {
  const { _id, accessToken, refreshToken, refreshTokenValidUntil } =
    await login(req.body);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });
  res.cookie('sessionId', _id, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });
  res.status(200).json({
    status: 200,
    message: `Successfully loged`,
    data: {
      accessToken,
    },
  });
};
