const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  //split the bearer token
  const idToken = authHeader.split(' ')[1]; 
  
  if (!idToken) {
    return res.status(401).json({ message: 'ID token not provided' });
  }

  try {
    // verifies the 'aud', 'exp', and 'iss' claims
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    
    // manually verify domain is valid
    const domain = payload['hd'];
    if (domain != "seas.upenn.edu"){
      return req.status(403).json({message: 'Invalid email domain'})
    }
    // add the payload as req.user
    req.user = payload;
    // move to next route handler if there are no errors
    next();
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return res.status(401).json({ message: 'Invalid ID token' });
  }
};

module.exports = verifyToken;