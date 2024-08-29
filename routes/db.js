const express = require('express')
const { credentialSchema, UserActivityModel } = require('../utils/dbSetUp')
const router = express.Router()

router.get('/getUserActivity', async (req, res) => {
  const userId = req.query.id
  const userActivity = await UserActivityModel.findOne({ id: userId }).lean()
  return res.status(200).json({ userActivity: userActivity || null })
})

router.post('/saveUserActivity', async (req, res) => {
  const { userId, items, statuses, themeColor } = req.body
  try {
    const userActivity = await UserActivityModel.findOne({ id: userId })
    if (userActivity) {
      userActivity.overwrite({ id: userId, items, statuses, themeColor })
      await userActivity.save()
    } else {
      const userActivityData = new UserActivityModel({
        id: userId,
        items,
        statuses,
      })
      await userActivityData.save()
    }
  } catch (error) {
    console.log('Error with User Activity collection', error)
  }
})

module.exports = router
