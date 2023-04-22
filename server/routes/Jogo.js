const express = require('express')
const router = express.Router()
const { Jogo } = require('../models')

router.get("/", async (req, res) =>{
    const listOfPost = await Jogo.findAll();
    res.json(listOfPost);
});

router.post("/", async (req, res) =>{
    const cc = req.body;
    await Jogo.create(cc);
    res.json(cc);
})

module.exports = router