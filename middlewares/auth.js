import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  // If there's no token, redirect to login page.
  console.log("auth.js req.session : ", req.session);
  if (!req.session.token) {
    return res.redirect("/login");
  }

  // If token is valid, continue...
  const { APP_SECRET } = process.env;
  try {
    jwt.verify(req.session.token, APP_SECRET);
    next();
  } catch (err) {
    // ...else, token is not valid, redirect to login page.
    console.error("auth.js err.message : ", err.message);
    res.redirect("/login");
  }
};