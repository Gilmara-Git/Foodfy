function hasSessionUserId(req, res, next) {
  try {
    if (req.session.userId) {
      req = req.session.userId;
      //console.log("linha 5 no hasSession", req);

      next();
    } else {
      return res.render("admin/session/login", {
        errorOnPageWithoutHeader: "Please login.",
      });
    }
  } catch (err) {
    console.error(err);
  }
}

module.exports = {

    hasSessionUserId
}