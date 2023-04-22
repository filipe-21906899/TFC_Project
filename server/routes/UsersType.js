const express = require('express')
const router = express.Router()
const { UsersType } = require('../models')

router.get("/", async (req, res) =>{
    const listOfPost = await UsersType.findAll();
    return res.json(listOfPost);
});

router.post("/", async (req, res) =>{
    const cc = req.body;
    await UsersType.create(cc);
    return res.json(cc);
})

module.exports = router