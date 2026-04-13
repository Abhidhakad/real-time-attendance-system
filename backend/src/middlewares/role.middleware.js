export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      const err = new Error('Authentication required');
      err.statusCode = 401;
      return next(err);
    }

    if (!roles.includes(req.user.role)) {
      const err = new Error('Access denied');
      err.statusCode = 403;
      return next(err);
    }

    next();
  };
};

export const isAdmin = authorize('admin');
export const isManager = authorize('manager', 'admin');
export const isManagerOrAdmin = authorize('manager', 'admin');
export const isEmployee = authorize('employee', 'manager', 'admin');