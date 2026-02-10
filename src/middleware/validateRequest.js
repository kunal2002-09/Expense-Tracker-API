const isValidDate = (value) => !Number.isNaN(new Date(value).getTime());

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email, and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'password must be at least 6 characters long' });
  }
  return next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }
  return next();
};

const validateExpensePayload = (req, res, next) => {
  const { title, amount, category, date } = req.body;
  if (!title || amount === undefined || !category) {
    return res.status(400).json({ message: 'title, amount, and category are required' });
  }

  if (Number.isNaN(Number(amount)) || Number(amount) < 0) {
    return res.status(400).json({ message: 'amount must be a positive number' });
  }

  if (date && !isValidDate(date)) {
    return res.status(400).json({ message: 'date must be a valid date string' });
  }

  return next();
};

const validateExpenseQuery = (req, res, next) => {
  const { startDate, endDate, minAmount, maxAmount } = req.query;

  if (startDate && !isValidDate(startDate)) {
    return res.status(400).json({ message: 'startDate must be a valid date string' });
  }

  if (endDate && !isValidDate(endDate)) {
    return res.status(400).json({ message: 'endDate must be a valid date string' });
  }

  if (minAmount && Number.isNaN(Number(minAmount))) {
    return res.status(400).json({ message: 'minAmount must be a number' });
  }

  if (maxAmount && Number.isNaN(Number(maxAmount))) {
    return res.status(400).json({ message: 'maxAmount must be a number' });
  }

  return next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateExpensePayload,
  validateExpenseQuery,
};
