const express = require('express')
const router = express.Router()
const { Cartoes } = require('../models')

router.get("/", async (req, res) =>{
    const listOfPost = await Cartoes.findAll();
    res.json(listOfPost);
});

router.post("/", async (req, res) =>{
    const cc = req.body;
    await Cartoes.create(cc);
    res.json(cc);
})

module.exports = router