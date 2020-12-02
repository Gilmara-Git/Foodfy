const nodemailer = require('nodemailer')
// we are going to user mailtrap for inbox tests


module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "e5be60456f0019",
      pass: "597d70e94b67fb"
    }
  });
