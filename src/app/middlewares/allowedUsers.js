


function permissionToUpdate(req, res, next){

    try {

        if(req.session.userId ){
            
            next()
    
        } else { 
    
            return res.render('admin/profile/show-logged-user',{   
                
                error: "You do not have permission to take this action." })
        
        }

    }catch(err){

        console.error(err)
    }

    


  
    //verificar se user esta logado, se esta logado , existe no banco
    //deixar somente este usuarios ter acesso as rotas administrativas

    // verificar se esta logado e se e ou nao admin
    

}


module.exports = {

    permissionToUpdate
}