const{ compare } = require('bcryptjs') // descriptografar a senha
const User = require('../models/User')
const { checkAllFields} = require('./user')

async function put(req, res, next){

    const needToCompleteAllFields = checkAllFields(req.body)

    if(needToCompleteAllFields){
        return res.render('admin/profile/show-logged-user', needToCompleteAllFields)
    }

    const { password , email} = req.body;
    console.log(req.body)

    const user = await User.findOne({ where: {email}})
    console.log('usuario vindo do banco de dados', user)
    if(!user) return res.render('admin/profile/show-logged-user', {
        user: req.body,
        error: 'User not found.'
    })
         
  

    if(!password) return res.render('admin/profile/show-logged-user', {
        user: req.body,
        error: 'Please type your password to update your profile.'
    })

    //    // password compare

    //     const passwordMatch = await compare( password, user.password)
    //     if(!passwordMatch) return res.render('admin/profile/show-logged-user', {
    //         user: req.body,
    //         error: 'Incorrect password.'
    //     })

        /// acredito que terei que fzer somente o req. session aqui e o resto no validator
    //&& user.is_admin === true || user.id === req.session.userId

        req.user = user
       
        next()

}



module.exports = { put }