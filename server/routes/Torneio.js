const express = require('express')
const router = express.Router()
const { Torneio } = require('../models')

router.get("/", async (req, res) =>{
    const listOfPost = await Torneio.findAll();
    res.json(listOfPost);
});

router.post("/", async (req, res) =>{
    const cc = req.body;
    await Torneio.create(cc);
    res.json(cc);
})

module.exports = router