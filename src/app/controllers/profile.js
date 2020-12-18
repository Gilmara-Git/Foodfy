const User = require('../models/User')


module.exports = {
  async index(req, res) {
    const { userId } = req.session;
    //console.log("userId do req.session", userId);

    try {
      const user = await User.findOne({ 
          where: { id: userId } });

      if (!user)
        return res.render("admin/users/create-user", {
          error: "User not found!",
        });

      return res.render("admin/profile/show-logged-user", { user });
    } catch (err) {
      console.error(err);
    }
  },

 async put(req, res) {
    //console.log('req body no profile controller', req.body);
    const {user} = req // This is coming from the Profile Validator

    //console.log('user no profile controller', user)
    
    try{

        let { name, email} = req.body // password is only updated when user request password change
        await User.update( user.id, {name, email})

        
        return res.render("admin/profile/show-logged-user", {
        
        user: req.body,
        success: 'Profile has been successfully updated.'
        
        });

    } catch(err) {
        
        console.error(err)
        return res.render('admin/profile/show-logged-user', {
            user: req.body,
            error: "Something went wrong."
        })
    
    }

    
  },
};