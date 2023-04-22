const express = require('express');
const router = express.Router();
const {TecnicosType} = require('../models');

router.get("/", async (req, res) =>{
    const listOfPost = await TecnicosType.findAll();
    res.json(listOfPost);
});

router.post("/", async (req, res) =>{
    const cc = req.body;
    await TecnicosType.create(cc);
    res.json(cc);
})

module.exports = router