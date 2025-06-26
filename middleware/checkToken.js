module.exports = function (req, res, next) {
    const checkToken = req.headers['x-check-token'];
  
    if (checkToken !== 'false') {
      return res.status(403).json({ error: 'Access denied: Invalid or missing X-Check-Token header.' });
    }
  
    next();
  };
  