const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const asyncHandler = require('../middleware/asyncHandler');
const buildExpenseFilter = require('../utils/buildExpenseFilter');

const createExpense = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    user: req.user._id,
  };

  const expense = await Expense.create(payload);
  return res.status(201).json(expense);
});

const getExpenses = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id, ...buildExpenseFilter(req.query) };
  const expenses = await Expense.find(filter).sort({ date: -1 });
  return res.status(200).json(expenses);
});

const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });

  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }

  return res.status(200).json(expense);
});

const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }

  return res.status(200).json(expense);
});

const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }

  return res.status(200).json({ message: 'Expense deleted successfully' });
});

const getExpenseSummary = asyncHandler(async (req, res) => {
  const match = { user: new mongoose.Types.ObjectId(req.user._id), ...buildExpenseFilter(req.query) };

  const [monthlyTotals, categoryTotals, overallTotal] = await Promise.all([
    Expense.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
    Expense.aggregate([
      { $match: match },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ]),
    Expense.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
  ]);

  return res.status(200).json({
    monthlyTotals: monthlyTotals.map((item) => ({
      year: item._id.year,
      month: item._id.month,
      total: item.total,
    })),
    categoryTotals: categoryTotals.map((item) => ({
      category: item._id,
      total: item.total,
    })),
    overallTotal: overallTotal[0]?.total || 0,
  });
});

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
};
