const express = require('express')
const router = express.Router()
const { Clubes } = require('../models')

router.get("/:userId", async (req, res) =>{
    const userId = req.params.userId;
    const clubes = await Clubes.findAll({ where: { UserId: userId}});
    res.json(clubes); 
});

router.post("/", async (req, res) =>{
    const cc = req.body;
    await Clubes.create(cc);
    res.json(cc);
})

module.exports = router