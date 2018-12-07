const router = require('express').Router();
const { Lines } = require('../db/models');
const moment = require('moment-timezone');

module.exports = router;

router.get('/', async (req, res, next) => {
  const today = moment().format('YYYY-MM-DD');
  try {
    const lines = await Lines.findAll({
      where: {
        date: today
      }
    })
    res.json(lines);
  } catch (err) {
    console.log(err);
  }
})