const express = require('express');
const router = express.Router();
const {TecnicosType} = require('../models');

router.get('/', async (req, res) => {
    const listOfTecnicosType = await TecnicosType.findAll();
    res.json(listOfTecnicosType);
  });

router.post("/", async (req, res) =>{
    const cc = req.body;
    await TecnicosType.create(cc);
    res.json(cc);
})

module.exports = router