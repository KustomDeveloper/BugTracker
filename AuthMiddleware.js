const jwt = require('jsonwebtoken');
require('dotenv');

const auth = process.env.TOKEN_SECRET;

function authenticateToken(req, res, next) {
  let token;

  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      jwt.verify(token, auth, (err) => {
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