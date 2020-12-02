const User = require('../models/User')
const { createRandomPassword } = require('../../lib/utils')

module.exports = {

create(req, res ){

  return res.render('admin/users/create-user')
}, 

async post(req, res){


  const keys = Object.keys(req.body)
    for(key of keys){
      if(req.body[key]== "") return res.send('Please fill out all fields!')

    }


    let { name, email, is_admin } =  req.body;

    const user =  await User.findOne({
      where:{email}
    })
    
    if(user) return res.render('admin/users/create-user',{
      user: req.body,
      error: "Email already exists!"
    })

    
    // This is only for the admininstrator to create a users.    
    
    // create a random password and send it to user's email address
    
    let password = createRandomPassword(20)
    console.log(password)

    req.body.password = password;
    console.log(req.body)

    const userPromise = await User.create(req.body)
    const userId = await Promise.all(userPromise)

    const userData = await User.findOne({ 
      where: {userId}
    })
   
    await mailer.sendMail({
      to: userData.email, 
      from: "no-reply@foodfy.com.br", 
      subject: "Password to your first login to Foodfy",
      html: `
      
          <h2>This is your password ${userData.password}.</h2>
          <p>Please click on the login link below to access Foodfy.</p>
          
          <p>
            
            <a href="http://localhost:3000/admin/users/login" target="_blank">login</a>
          
          </p>
      `
    })

    return res.send("teste")
}


}