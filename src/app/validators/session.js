const { compare } = require("bcryptjs")
const User = require('../models/User')
const { dateInTimeStamp} = require('../../lib/utils')

async function login(req, res, next){

    const { email, password} = req.body

    try{ 

// check if user EXISTS
const user = await User.findOne({ where: {email} })

if(!user) return res.render('admin/session/login', {

    user: req.body,
    errorOnPageWithoutHeader: "User does not exist. Click on sign in to login"

})

//check if password matches

const passwordMatch = await compare( password, user.password)
        if(!passwordMatch) return res.render('admin/session/login', {
            user: req.body,
            errorOnPageWithoutHeader: 'Incorrect password.'
        })



req.user  = user


next()

    }catch(err){ 
        
        console.error(err)
    }

}


async function forgotPassword(req, res, next){

        const { email } = req.body
    try{

        // verify if email/user exists
        const user = await User.findOne({ where: {email}})
        
        if(!user) return res.render('admin/session/forgot-password', {
            user: req.body,
            errorOnPageWithoutHeader: "Email does not exist on the system!"})


            req.user = user
            next()

    }catch(err){ 

        console.error(err)
    }


    }


async function resetPassword(req, res, next) {
  const { email, password, passwordRepeat, token } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    //console.log(user);
    if (!user)
      return res.render("admin/session/reset-password", {
        user: req.body,
        errorOnPageWithoutHeader: "User not found.",
      });

    //verify if password match

    if (password !== passwordRepeat)
      return res.render("admin/session/reset-password", {
        user: req.body,
        token,
        errorOnPageWithoutHeader: "Passwords do not match. Please try again.",
      });

    // verify if there is a token available and if user is not trying to reset his password with somebody else's token
    if (!token || token != user.reset_token)
      return res.render("admin/session/reset-password", {
        user: req.body,
        token,
        errorOnPageWithoutHeader:
          "Token not valid. Make sure you typed the correct email, or request another password reset.",
      });

    // verify if token did not expire
        let now = new Date();
        now.setHours(now.getHours() - 5 );


   console.log(now)
    console.log(user.reset_token_expires)
    //console.log(dateInTimeStamp(now))
  

    if (now > user.reset_token_expires)
      return res.render("admin/session/reset-password", {
        token,  
        user: req.body,
        errorOnPageWithoutHeader: "Token expired, please request another password reset.",
      });

    req.user = user;
    // conferir que fiz tudo que precisava e fazer o update no banco.

    next()

  } catch (err) {
    console.error(err);
  }
}



module.exports = { 

    login,
    forgotPassword,
    resetPassword
}