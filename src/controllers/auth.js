import { login, register, refreshUserSession,logout} from '../services/auth.js';

const setupSession = (res, session) => {

  const {_id,refreshToken,refreshTokenValidUntil} = session;

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
  await register(req.body);
  const { name } = req.body;
  res.status(201).json({
    status: 201,
    message: `Successfully registred ${name}`,
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


export const logoutController = async (req,res)=>{
  const sessionId = req.cookies.sessionId;
  if(sessionId) {
    await logout (sessionId);
 }
 res.clearCookie("sessionId");
 res.clearCookie("refreshToken");

 res.status(204).send();
}
