module.exports = {

create(req, res ){

  return res.render('admin/users/create-user')
}, 

post(req, res){
  console.log(req.body)
  return res.send("teste")
}


}