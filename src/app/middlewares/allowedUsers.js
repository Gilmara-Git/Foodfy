


function permissionToUpdate(req, res, next){

    
    if(req.session.userId ){

        next()


    }


  
    //verificar se user esta logado, se esta logado , existe no banco
    //deixar somente este usuarios ter acesso as rotas administrativas

    // verificar se esta logado e se e ou nao admin
    

}


module.exports = {

    permissionToUpdate
}