const has_role = (role) => (req, res, next) => {
  if (req.user.role === role) {
    next();
  } else {
    res.status(403).json("Forbidden");
  }
};

module.exports = has_role;
