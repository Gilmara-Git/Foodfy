const User = require('../models/User')
const Recipe = require('../models/Recipe')
const File = require('../models/File')
const { createRandomPassword } = require('../../lib/utils')
const mailer = require('../../lib/mailer')
const fs = require('fs')

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
      
          <h2>Below is your password</h2>
          <p>${userData.password}</p>
          <p>Please click on the login link below to access Foodfy.</p>          
          <p>            
            <a href="http://localhost:3000/admin/users/login" target="_blank">login</a>          
          </p>
      `
    })

    return res.render('admin/users/create-user', {

      success: 'An email has been sent to user.'
    })

},

async list(req, res){

  req.session.userId
  const loggedUser = await User.findOne({ where: { id:req.session.userId}})
 
  if(loggedUser.is_admin !==  true) return res.render('admin/profile/show-logged-user', {       
      user:loggedUser,
      error:'You do not have permission to take this action.'
  })
  


  let results = await User.findAll()
  const users =  results.rows



  return res.render('admin/users/users-index', {users, loggedUser})

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

  try{ 
  
  const {id} = req.body
  console.log(id)

  //verify if user has recipes
    // get recipes
  let results = await Recipe.findIfUserRecipes(id)
  const recipes = results.rows
  //console.log('linha 153', recipes)

  const allFilesPromise = recipes.map(recipe=>{
    return  File.all(recipe.id)
  })

 
  let promiseResults = await Promise.all(allFilesPromise)
  //console.log(JSON.stringify(promiseResults, null, 2))

  promiseResults.map(results=>
    results.rows.map(file => 
     File.delete(file.file_id))
  )
  
  promiseResults.map(results=>
    results.rows.map(file => 
     fs.unlinkSync(file.path))
  )
 
  
 
    await User.delete(id) // This deletes the user and recipes in CASCADE
    req.session.destroy


    return res.redirect('/admin/users')

  }catch(err){ 
    
    
    console.error(err)}

  }


}


