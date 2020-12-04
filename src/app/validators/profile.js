const{ compare } = require('bcryptjs') // descriptografar a senha
const User = require('../models/User')
const { checkAllFields} = require('./user')

async function put(req, res, next){

    const needToCompleteAllFields = checkAllFields(req.body)

    if(needToCompleteAllFields){
        return res.render('admin/profile/show-logged-user', needToCompleteAllFields)
    }

    const { password , email} = req.body;
    //console.log(req.body)

    const user = await User.findOne({ where: {email}})
    //console.log('usuario vindo do banco de dados', user)
    if(!user) return res.render('admin/profile/show-logged-user', {
        user: req.body,
        error: 'User not found.'
    })
         
  

    if(!password) return res.render('admin/profile/show-logged-user', {
        user: req.body,
        error: 'Please type your password to update your profile.'
    })

    //    // password compare  - Habilitar depois que fizer o forgot password
    //     const passwordMatch = await compare( password, user.password)
    //     if(!passwordMatch) return res.render('admin/profile/show-logged-user', {
    //         user: req.body,
    //         error: 'Incorrect password.'
    //     })

    // Verifying if user is allowed to update
    if(user.is_admin === !true || user.id === !req.session.userId){

        return res.render('admin/profile/show-logged-user',{   
                
            error: "You do not have permission to take this action." })
    }
   

        req.user = user
       
        next()

}



module.exports = { put }