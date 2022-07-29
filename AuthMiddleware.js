const jwt = require('jsonwebtoken');
const config = require('./config');

const { auth: { token_secret } } = config;

function authenticateToken(req, res, next) {
  let token;

  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      jwt.verify(token, token_secret, (err) => {
        if (err) {
          console.log(err)
          return res.status(403).json({
            authenticated: false,
            message: "Error verifying token"
          });
        } else {
          next();
        }
      })
    } catch(err) {
      console.log(err)
      if (err) {
        return res.status(403).json({
          authenticated: false,
          message: "Try/catch error"
        });
      } else {
        next()
      }
    }
      
  } else {
    res.status(401).json({
      authenticated: false
    })
  }
}

module.exports = authenticateToken;