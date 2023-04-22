const express = require('express')
const router = express.Router()
const { Jogadores } = require('../models')

router.get("/", async (req, res) =>{
    const listOfPost = await Jogadores.findAll();
    res.json(listOfPost);
});

router.post("/", async (req, res) =>{
    const cc = req.body;
    await Jogadores.create(cc);
    res.json(cc);
})

module.exports = router