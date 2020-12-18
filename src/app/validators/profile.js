const{ compare } = require('bcryptjs') // descriptografar a senha
const User = require('../models/User')


async function put(req, res, next){

    console.log(req.body)
     

        if(req.body.password == ""){

            return res.render('admin/profile/show-logged-user', {

                user: req.body,
                error: "Please type your password for your changes to take effect."
            })

        }

    const { password , email} = req.body;
    //console.log(req.body)

    const user = await User.findOne({ where: {email}})
    //console.log('usuario vindo do banco de dados', user)
    if(!user) return res.render('admin/profile/show-logged-user', {
        user: req.body,
        error: 'User not found. Please check if email is correct.'
    })

    if(!password) return res.render('admin/profile/show-logged-user', {
        user: user,
        error: 'Please type your password to update your profile.'
    })



       // password compare  - Habilitar depois que fizer o forgot password
        const passwordMatch = await compare( password, user.password)
        if(!passwordMatch) return res.render('admin/profile/show-logged-user', {
            user: req.body,
            error: 'Incorrect password.'
        })

    // Verifying if user is allowed to update
    if(user.id !== req.session.userId && user.is_admin !== true){

        return res.render('admin/profile/show-logged-user',{   
                
            error: "You do not have permission to take this action." })
    }
   


        req.user = user
       
        next()

}



module.exports = { put }