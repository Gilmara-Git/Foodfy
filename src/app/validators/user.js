const User = require('../models/User')

function checkAllFields(body){

    const keys = Object.keys(body)
        for(key of keys){ 

            if(body[key]== "") 
            return {
                user: body,
                error: 'Please fill out all fields.'
              }

        }
   
}

async function post(req, res, next){

    const needToCompleteAllFields = checkAllFields(req.body)

    if(needToCompleteAllFields){
        return res.render('admin/users/create-user', needToCompleteAllFields)
    }

    let { name, email, is_admin } =  req.body;

    const user =  await User.findOne({
      where:{email}
    })
    
    if(user) return res.render('admin/users/create-user',{
      user: req.body,
      error: "Email already exists!"
    })


    next()
}




module.exports = { post, checkAllFields}