const express = require('express')
const { credentialSchema, UserActivityModel } = require('../utils/dbSetUp')
const router = express.Router()

router.get('/getUserActivity', async (req, res) => {
  const userId = req.query.id
  const userActivity = await UserActivityModel.findOne({ id: userId }).lean()
  return res.status(200).json({ userActivity: userActivity || null })
})

router.post('/saveUserActivity', async (req, res) => {
  const { userId, items, statuses } = req.body
  const userActivity = await UserActivityModel.findOne({ id: userId })
  try {
    if (userActivity) {
      userActivity.overwrite({ id: userId, items, statuses })
      await userActivity.save()
    } else {
      const userActivityData = new UserActivityModel({
        id: userId,
        items,
        statuses,
      })
      await userActivityData.save()
    }
    console.log('User activity saved')
  } catch (error) {
    console.log('Error with User Activity collection', error)
  }
})

module.exports = router
