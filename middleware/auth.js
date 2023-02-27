const jwt = require('jsonwebtoken')
const ExpressError = require('./expressError')
const SECRET_KEY = 'KEYBEYZ'

function authenticateJWT(req, res, next) {
   try {
      const tokenFromBody = req.body._token
      const payload = jwt.verify(tokenFromBody, SECRET_KEY)
      console.log('Your token is valid')
      req.user = payload;
      return next();
   } catch(e) {
      return next()      
   }
}

function ensureLoggedIn(req, res, next) {
   if (!req.user) {
      const err = new ExpressError('Unauthorized', 401)
      return next(err)
   } else{
      return next();
   }
}

module.exports = { authenticateJWT, ensureLoggedIn }