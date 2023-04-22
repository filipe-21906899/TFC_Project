const express = require('express');
const router = express.Router();
const {CadernoEleitoral} = require('../models');

router.get("/", async (req, res) =>{
    const listOfPost = await CadernoEleitoral.findAll();
    res.json(listOfPost);
});

router.post("/", async (req, res) =>{
    const cc = req.body;
    await CadernoEleitoral.create(cc);
    res.json(cc);
})

module.exports = router