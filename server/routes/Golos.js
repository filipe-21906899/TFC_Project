const express = require('express')
const router = express.Router()
const { Golos } = require('../models')

router.get("/", async (req, res) =>{
    const listOfPost = await Golos.findAll();
    res.json(listOfPost);
});

router.post("/", async (req, res) =>{
    const cc = req.body;
    await Golos.create(cc);
    res.json(cc);
})

module.exports = router