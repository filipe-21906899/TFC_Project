const express = require('express')
const router = express.Router()
const { EquipaJogadores } = require('../models')

router.get("/", async (req, res) =>{
    const listOfPost = await EquipaJogadores.findAll();
    res.json(listOfPost);
});

router.post("/", async (req, res) =>{
    const cc = req.body;
    await EquipaJogadores.create(cc);
    res.json(cc);
})

module.exports = router