import crypto from "crypto";
import { UserModel } from "../Models/User.js";

export default async function homeForm(req, res) {
  const {
    firstName,
    lastName,
    email,
    password,
    password_confirm
  } = req.body;

  function renderError(errorHeader, errorMessage) {
    // Render form with error messages,
    // with all form field values already entered, except passwords.
    res.render("home", {
      errorHeader,
      errorMessage,
      firstName,
      lastName,
      email,
    });
  }

  // Check if a field is empty, if email already used,
  // or if form passwords don't match.

  if (firstName === "") {
    renderError("First name", "First name required");
    return;
  }
  if (lastName === "") {
    renderError("Last name", "Last name required");
    return;
  }
  if (email === "") {
    renderError("Email", "Email required");
    return;
  }
  if (await UserModel.findOne({ email: email })) {
    renderError("Email already used", "This email is already used");
    return;
  }
  if (password === "") {
    renderError("Password", "Password required");
    return;
  }
  if (password_confirm === "") {
    renderError("PasswordConfirm", "PasswordConfirm required");
    return;
  }
  if (password !== password_confirm) {
    renderError("PasswordConfirm", "Passwords have to be the same.");
    return;
  }

  // If no errors, proceed to user creation.

  // Hash password 
  const { APP_SECRET } = process.env;
  const sha256Hasher = crypto.createHmac("sha256", APP_SECRET);
  const hashedPassword = sha256Hasher.update(password).digest("hex");

  // Save user in database
  const user = new UserModel({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashedPassword,
  });

  try {
    const doc = await user.save();
    console.log(doc);
    // Redirect to login page
    res.redirect("/login");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error." });
  }
}
