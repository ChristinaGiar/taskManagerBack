const express = require('express')
const { UserActivityModel } = require('../utils/dbSetUp')
const router = express.Router()

router.get('/getUserActivity', async (req, res, next) => {
  try {
    const userId = req.query.id
    const userActivity = await UserActivityModel.findOne({
      userId: userId,
    }).lean()
    return res.status(200).json({
      userActivity: userActivity || null,
    })
  } catch (err) {
    if (!err.status) {
      err.status = 500
    }
    next(err)
  }
})

router.post('/saveUserActivity', async (req, res) => {
  const { userId, items, statuses, themeColor } = req.body
  try {
    const userActivity = await UserActivityModel.findOne({ userId: userId })
    if (userActivity) {
      userActivity.items = items
      userActivity.statuses = statuses
      userActivity.themeColor = themeColor
      await userActivity.save()
    } else {
      const newUserActivity = new UserActivityModel({
        id: userId,
        items,
        statuses,
        themeColor,
        userId: userId,
      })
      await newUserActivity.save()
    }
  } catch (err) {
    if (!err.status) {
      err.status = 500
    }
    next(err)
  }
})

module.exports = router
