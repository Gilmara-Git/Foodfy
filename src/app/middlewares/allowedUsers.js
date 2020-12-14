function hasSessionUserId(req, res, next) {
  try {
    if (req.session.userId) {
      req = req.session.userId;
      console.log("linha 12 no hasSession", req);

      next();
    } else {
      return res.render("admin/session/login", {
        error: "Please login.",
      });
    }
  } catch (err) {
    console.error(err);
  }
}
    //verificar se user esta logado, se esta logado , existe no banco
    //deixar somente este usuarios ter acesso as rotas administrativas

//     // verificar se esta logado e se e ou nao admin
//     async function isAdminAndHasSession(req, res, next){

//         try{

//             req.session.userId
//             const user = await findOne({ where: { id:req.session.userId}})
//             console.log(req.session.userId)
//             console.log(user)

//             if(user.is_admin !==  true) return res.render('admin/profile/show-logged-user', { 
                
//                 user:user,
//                 error:'You do not have permission to take this action.'
//             })

//             next()
            

//         } catch(err) {
//             console.error(err)
//         }
 
 

// }


module.exports = {

    hasSessionUserId
}