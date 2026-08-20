const crypto = require("crypto");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// never send the password hash or reset fields back to the client.
function publicUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    company: user.company,
    phone: user.phone,
    profileImage: user.profileImage,
  };
}

// POST /api/auth/register
async function register(req, res) {
  const { name, email, password, role, company, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  if (role && !["admin", "exhibitor", "attendee"].includes(role)) {
    return res.status(400).json({ message: "Role must be admin, exhibitor or attendee" });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(400).json({ message: "An account with that email already exists" });
  }

  const user = await User.create({ name, email, password, role, company, phone });

  res.status(201).json({
    token: generateToken(user._id),
    user: publicUser(user),
  });
}

// POST /api/auth/login
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // password is select:false on the schema, so ask for it explicitly
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({
    token: generateToken(user._id),
    user: publicUser(user),
  });
}

// POST /api/auth/forgot-password
async function forgotPassword(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  // same response either way so the endpoint can't be used to discover which emails exist.
  const genericResponse = {
    message: "If that email is registered, a password reset link has been sent",
  };

  if (!user) {
    return res.json(genericResponse);
  }

  // the raw token goes to the user; only its hash is stored, so a leaked DB row is not usable.
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
  await user.save();

  // no mail service is wired up yet, so in development the link is returned directly.
  if (process.env.NODE_ENV === "production") {
    return res.json(genericResponse);
  }

  res.json({
    ...genericResponse,
    resetToken,
    resetUrl: `${process.env.CLIENT_URL}/reset-password/${resetToken}`,
  });
}

// POST /api/auth/reset-password/:token
async function resetPassword(req, res) {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "New password is required" });
  }

  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Reset link is invalid or has expired" });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({
    token: generateToken(user._id),
    user: publicUser(user),
  });
}

// GET /api/auth/me
async function getMe(req, res) {
  res.json({ user: publicUser(req.user) });
}

module.exports = { register, login, forgotPassword, resetPassword, getMe };
