const jwt = require('jsonwebtoken');
const config = require('./config');

const { auth: { token_secret } } = config;

function authenticateToken(req, res, next) {
  var token = req.body.token;
  if (token) {
      jwt.verify(token, token_secret, (err) => {
          console.log(err)
          if (err) return res.sendStatus(403)

          next()
      })
   
  } else {
      res.status(401).json({
        authenticated: false
      })
  }
}

module.exports = authenticateToken;