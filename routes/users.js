const express = require("express")
const router = new express.Router()
const ExpressError = require("../middleware/expressError")
const db = require("../db.js")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { ensureLoggedIn }= require("../middleware/auth")

const SECRET_KEY = 'KEYBEYZ'

router.get("/", async function(req, res, next){
   try {
      const results = await db.query(`SELECT * FROM users`)
      return res.json(results.rows)
   } catch(e) {
      return next(e)
   }
})

router.post("/register", async function (req, res, next) {
   try {
      const { username, password} = req.body
      let hashedpass = await bcrypt.hash(password, 12)
      const results = await db.query(`INSERT INTO users (username, password) VALUES ($1, $2) RETURNING username`, [username, hashedpass])
      return res.json(results.rows[0])
   } catch(e) {
      return next(e)
   }
})

router.post("/login", async function (req, res, next) {
   try {
      const { username, password} = req.body
      if (! username || ! password) {
         throw new ExpressError('Username and password required', 400)
      }
      const results = await db.query(`
      SELECT username, password 
      FROM users WHERE username=$1`,
      [username])
      const user = results.rows[0]
      if(user){
         if (await bcrypt.compare(password, user.password)){
            const token = jwt.sign(user, SECRET_KEY)
            return res.json({messaged: 'Logged in!', token })
         }
      }
      throw new ExpressError('Invalid username or password', 400)
   } catch(e) {
      return next(e)
   }
})

router.get("/secret", ensureLoggedIn, async function (req, res, next) {
   try {
      return res.json({msg: "This one goes out to the one I dove."})
   } catch(e) {
      return next(e)
   }
})

router.get("/private", ensureLoggedIn, (req, res, next) => {
   return res.json({msg: `Welcome to my private fuck pad, ${req.user.username}`})
})

module.exports = router;


// logged user below for testing
// {
// 	"username": "dave1216",
// 	"password": "pass"
// }