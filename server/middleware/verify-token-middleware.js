const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Specify your Google Client ID here

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  //split the bearer token
  const idToken = authHeader.split(' ')[1]; 
  
  if (!idToken) {
    return res.status(401).json({ message: 'ID token not provided' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID, // Specify your Google Client ID here
    });
    const payload = ticket.getPayload();
    req.user = payload;
    next();
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return res.status(401).json({ message: 'Invalid ID token' });
  }
};

module.exports = verifyToken;