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

    let { email} =  req.body;
    console.log(req.body)

    const user =  await User.findOne({
      where:{email}
    })
    
    if(user) return res.render('admin/users/create-user',{
      user: req.body,
      error: "Email already exists!"
    })

    

    next()
}

async function put(req, res, next){

  const { email } = req.body 
  try{
    const needToCompleteAllFields = checkAllFields(req.body)
    if(needToCompleteAllFields){
        return res.render('admin/users/edit-user', needToCompleteAllFields)
    }

    const user = await User.findOne( { where: { email  }})
   
    if(!user) return res.render('admin/users/edit-user', { 
      
      user: req.body,
      error: "User not found! Please verify if email is correct!" })

      req.user = user
      next()
  


  } catch(err){ 
    
    console.error(err) }


}

async function remove(req, res, next){

  console.log(req.body)

  next()

}


module.exports = { post, checkAllFields, put, remove }