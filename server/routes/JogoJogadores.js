const express = require('express')
const router = express.Router()
const { JogoJogadores } = require('../models')

router.get("/", async (req, res) =>{
    const listOfPost = await JogoJogadores.findAll();
    res.json(listOfPost);
});

router.post("/", async (req, res) =>{
    const cc = req.body;
    await JogoJogadores.create(cc);
    res.json(cc);
})

module.exports = router