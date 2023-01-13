import crypto from "crypto";
import { UserModel } from "../Models/User.js";
import jwt from 'jsonwebtoken';

export default async function loginForm(req, res) {
  const { email, password } = req.body;

  function renderError(errorHeader, errorMessage) {
    res.render("login", {
      errorHeader,
      errorMessage,
      email,
    });
  }

  if (email === "") {
    renderError("Email", "Email required");
    return;
  }
  if (password === "") {
    renderError("Password", "Password required");
    return;
  }
  const user = await UserModel.findOne({ email: email });
  if (user === null) {
    renderError("Email not found", "This email could not be found");
    return;
  }

  // Check if password is valid
  // Hash received password 
  const { APP_SECRET } = process.env;
  const sha256Hasher = crypto.createHmac("sha256", APP_SECRET);
  const hashedPassword = sha256Hasher.update(password).digest("hex");
  const hashesMatch = hashedPassword === user.password;
  if (hashesMatch === false) {
    renderError("Password", "Incorrect password");
    return;
  }

  // Everything ok, proceed to create token in session and redirect
  // to dashboard.
  req.session.token = jwt.sign(
    { email: email },
    APP_SECRET,
    { expiresIn: '24h' }
  );

  console.log("loginForm.js req.session : ", req.session);
  res.redirect("/dashboard");
}
