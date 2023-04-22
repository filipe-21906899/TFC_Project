const express = require('express');
const router = express.Router();
const {EquipaTecnica} = require('../models');

router.get("/", async (req, res) =>{
    const listOfPost = await EquipaTecnica.findAll();
    res.json(listOfPost);
});

router.post("/", async (req, res) =>{
    const cc = req.body;
    await EquipaTecnica.create(cc);
    res.json(cc);
})

module.exports = router