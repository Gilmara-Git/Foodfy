const User = require('../models/User')


module.exports = {

loginForm(req, res ){

  return res.render('admin/session/login', {

    success: "Por favor preencher os dados para logar no sistema."

  })
}, 

logout(req, res){

req.session.destroy()

return res.redirect('/admin/users/profile')

}

}
