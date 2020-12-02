const User = require('../models/User')

module.exports = {

create(req, res ){

  return res.render('admin/users/create-user')
}, 

async post(req, res){
  const keys = Object.keys(req.body)
    for(key of keys){
      if(req.body[key]== "") return res.send('Please fill out all fields!')

    }

    console.log(req.body)

    // const user =  await User.findOne({where:{email}})
    // if(user) return res.render('admin/users/create-user',{
    //   user: req.body,
    //   error: "Email already exists!"
    // })
    // This is only for the admininstrator to create a users.
    // work on field is_admin ( if is_admin == "") is_admin =""
    
    // create a token so and send to new user's email address


    //const userPromise = await User.create(req.body)
  console.log(req.body)
  return res.send("teste")
}


}