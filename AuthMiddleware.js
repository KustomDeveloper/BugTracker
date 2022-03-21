const jwt = require('jsonwebtoken');
const config = require('./config');

const { auth: { token_secret } } = config;

function authenticateToken(req, res, next) {
  let token;

  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      jwt.verify(token, token_secret, (err) => {
        if (err) return res.sendStatus(403)

        next()
      })
    } catch(err) {
      console.log(err)
      if (err) return res.sendStatus(403)

        next()
      }
  } else {
    res.status(401).json({
      authenticated: false
    })
  }
}

module.exports = authenticateToken;