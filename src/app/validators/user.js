const User = require("../models/User");
const Recipe = require("../models/Recipe");

function checkAllFields(body) {
  const keys = Object.keys(body);
  for (key of keys) {
    if (body[key] == "")
      return {
        user: body,
        error: "Please fill out all fields.",
      };
  }
}

async function post(req, res, next) {
  let user = await User.findOne({ where: { id: req.session.userId } });
  console.log("linha 21 - user validator", user);
  // This is only for the admininstrator to create a users.
  if (user.is_admin !== true)
    return res.render("admin/profile/show-logged-user", {
      user: user,
      error: "You do not have permission to take this action!",
    });

  const needToCompleteAllFields = checkAllFields(req.body);

  if (needToCompleteAllFields) {
    return res.render("admin/users/create-user", needToCompleteAllFields);
  }

  let { email } = req.body;
  console.log(req.body);

  user = await User.findOne({
    where: { email },
  });

  if (user)
    return res.render("admin/users/create-user", {
      user: req.body,
      error: "Email already exists!",
    });

  next();
}

async function put(req, res, next) {
  const { email } = req.body;
  try {
    const needToCompleteAllFields = checkAllFields(req.body);
    if (needToCompleteAllFields) {
      return res.render("admin/users/edit-user", needToCompleteAllFields);
    }

    const user = await User.findOne({ where: { email } });

    if (!user)
      return res.render("admin/users/edit-user", {
        user: req.body,
        error: "User not found! Please verify if email is correct!",
      });

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
  }
}

async function remove(req, res, next) {
  try {
   
    const { id } = req.body
    //console.log('id usario a ser deletado', id)
   // This is only for the admininstrators.
    const user = await User.findOne({ where: { id: req.session.userId } });
    //console.log(user);
   
    //console.log('req sessin', req.session.userId)
    if(user.is_admin !== true || id == req.session.userId)
      return res.render("admin/profile/show-logged-user", {
        user: user,
        error: "You do not have permission to take this action!",
      })

      next()

  } catch (err) {
    console.error(err);
  }


}

module.exports = { post, checkAllFields, put, remove };
