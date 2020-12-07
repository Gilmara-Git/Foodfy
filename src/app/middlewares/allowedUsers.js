


function hasSessionUserId(req, res, next){

    try {

        if(req.session.userId ){

            req = req.session.userId
            
            next()
    
        } else { 
    
            return res.render('admin/session/login',{   
                
                error: "You are not loggin. Please login." })
        
        }

    }catch(err){

        console.error(err)
    }



  }
    //verificar se user esta logado, se esta logado , existe no banco
    //deixar somente este usuarios ter acesso as rotas administrativas

    // verificar se esta logado e se e ou nao admin
    function isAdmin(req, res, next){

        try{

            

        } catch(err) {
            console.error(err)
        }

        next()

}


module.exports = {

    hasSessionUserId, isAdmin
}