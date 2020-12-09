const User = require('../models/User')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')
const{ hash } = require('bcryptjs')
const { dateInTimeStamp} = require('../../lib/utils')


module.exports = {


loginForm(req, res ){

  return res.render('admin/session/login')
}, 

logout(req, res){

req.session.destroy()

return res.render('admin/session/login', { 

    success: "You have logged out successfully!"
})


}, 

login(req, res) {

  const {user} = req
// put user in req.session
req.session.userId = req.user.id

try{

  return res.render('admin/profile/show-logged-user', {
    user,
    success: `Welcome to Foodfy ${user.name}!`
  })

}catch(err) { 
  
  console.error(err)}



},

forgotForm(req, res){

return res.render('admin/session/forgot-password')

},

async forgotPassword(req, res){

  const {user} = req

  try{

    const token = crypto.randomBytes(20).toString('hex')

    let now = new Date();
    let nowtest = new Date(); 
    now.setHours(now.getHours() + 1)
    console.log('now', now)
    nowtest.setHours(nowtest.getHours() - 5)
    console.log('notest', nowtest)


    await User.update(user.id, {

      reset_token: token,
      reset_token_expires: now
    
    })


    await mailer.sendMail({

      to: user.email,
      from: "no-reply@foodfy.com.br",
      subject: `Forgot you password, ${user.name}?`,
      html: `<h2>Click on the link below to reset password!</h2>
             <p>You have 1 hour to reset your password.</p>
             <p>
                <a href="http://localhost:3000/admin/users/reset-password?token=${token}" target="_blank">
                New Password
                </a>
             </p>
      
      `
    })

    return res.render('admin/session/login', {      
      users: req.body,
      success: "Email has been sent to your mailbox."
    })


  }catch(err){ 
    
    console.error(err)}
    return res.render('admin/session/forgot-password',{
      user: req.body,
      error: "Unexpected error" 
    })

},

resetForm(req, res){
  const { token } = req.query
  //console.log(token)
  return res.render("admin/session/reset-password", { token})
}, 

async resetPassword(req, res){
  const { user } = req
 const { password } = req.body

 try {

  const newPassword = await hash(password, 8)

  await User.update(user.id, {     
    password: newPassword, 
    reset_token: "", 
    reset_token_expires: ""

  })

  return res.render('admin/session/login', {
    
    users: req.body,
    success: "Password has been reset. Please login!"
    })


 } catch(err){

    console.error(err)
    return res.render('admin/session/reset-password', {

      user: req.body,
      error: "Unexpected error. Try again."
    })
 }

}

}
