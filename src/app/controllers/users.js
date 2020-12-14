const User = require('../models/User')
const { createRandomPassword } = require('../../lib/utils')
const mailer = require('../../lib/mailer')

module.exports = {

async create(req, res ){

  try { 
  const user = await User.findOne( { where: { id: req.session.userId}})
  console.log(user)
    // This is only for the admininstrator to create a users.   
  if(user.is_admin !== true) return res.render('admin/profile/show-logged-user', { 
    
    user: user,
    error: 'You do not have permission to take this action!'
  
  })

  return res.render('admin/users/create-user')

  } catch(err){

    console.error(err)
  }

  
}, 

async post(req, res){

    // create a random password and send it to user's email address
    
    let password = createRandomPassword(20)
    //console.log(password)

    req.body.password = password;
    //console.log(req.body)

   const userId = await User.create(req.body)
    //console.log(userId)

    //req.session.userId = userId; //colocar usario na sessao somente quando fizer login

   const userData = await User.findOne({ where: {id:userId} })
   //console.log(userData)
   
    
   await mailer.sendMail({
      to: userData.email, 
      from: "no-reply@foodfy.com.br", 
      subject: `Welcome to Foodfy ${userData.name}`,
      html: `
      
          <h2>This is your password ${userData.password}</h2>
          <p>Please click on the login link below to access Foodfy.</p>          
          <p>            
            <a href="http://localhost:3000/admin/users/login" target="_blank">login</a>          
          </p>
      `
    })

    return res.redirect("/admin/users")

},

async list(req, res){

  req.session.userId
  const user = await User.findOne({ where: { id:req.session.userId}})
  //console.log(req.session.userId)
  //console.log(user)

  if(user.is_admin !==  true) return res.render('admin/profile/show-logged-user', {       
      user:user,
      error:'You do not have permission to take this action.'
  })
  


  let results = await User.findAll()
  const users =  results.rows
  //console.log(users)


  return res.render('admin/users/users-index', {users})

},

async edit(req, res){

  let user = await User.findOne( { where: { id: req.session.userId}})
  console.log(user)
    // This is only for the admininstrator to create a users.   
  if(user.is_admin !== true) return res.render('admin/profile/show-logged-user', { 
    
    user: user,
    error: 'You do not have permission to take this action!'
  
  })

  const { userId }  = req.query
  
  user = await User.findOne({ where: {id: userId}})
  console.log(user)

  return res.render('admin/users/edit-user', {user})
},

async  put(req, res){

  console.log('user no put controller - linha 78', req.body)
  const { name, email, is_admin} = req.body

  const { user } = req

  try {

    await User.update(user.id, { 

      name,
      email,
      is_admin: is_admin || false
  
    })
  
    return res.render('admin/users/edit-user', { 
  
      user: req.body,
      success: "User updated successfully."
    })
  
  } catch(err) { 
    
    console.error(err)}
  
}, 

async delete(req, res){

  const user = await User.findOne( { where: { id: req.session.userId}})
  console.log(user)
    // This is only for the admininstrator to create a users.   
  if(user.is_admin !== true) return res.render('admin/profile/show-logged-user', { 
    
    user: user,
    error: 'You do not have permission to take this action!'
  
  })

  const {id} = req.body
  console.log('id linha 135 ',id)
  //verify if delete cascade will be necessary

  try{ 

    await User.delete(id)

  }catch(err){ 
    
    
    console.errror(err)}



  // Fazer um "if" se o usuario for admin encaminhar para alista de usuarios
  // Se o usuario nao for admin fazer session destroy e manda-lo para criar um novo usuario.



  return res.redirect('/admin/users')
}


}