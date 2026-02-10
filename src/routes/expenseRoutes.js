const express = require('express');
const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
} = require('../controllers/expenseController');
const protect = require('../middleware/authMiddleware');
const { validateExpensePayload, validateExpenseQuery } = require('../middleware/validateRequest');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(validateExpensePayload, createExpense)
  .get(validateExpenseQuery, getExpenses);

router.get('/summary', validateExpenseQuery, getExpenseSummary);
router
  .route('/:id')
  .get(getExpenseById)
  .put(updateExpense)
  .delete(deleteExpense);

module.exports = router;
