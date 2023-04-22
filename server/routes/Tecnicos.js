const express = require('express');
const router = express.Router();
const {Tecnicos} = require('../models');

router.get("/", async (req, res) =>{
    const listOfPost = await Tecnicos.findAll();
    res.json(listOfPost);
});

router.post("/", async (req, res) =>{
    const cc = req.body;
    await Tecnicos.create(cc);
    res.json(cc);
})

module.exports = router