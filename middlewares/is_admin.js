const is_admin = (role) => {
  return (req, res, next) => {
    if (req.user.role === role) {
      next();
    } else {
      res.status(403).json("Forbidden");
    }
  };
};

module.exports = is_admin;
