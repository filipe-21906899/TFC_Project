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

router.get("/:id", async (req, res) => {
    try {
      const jogoId = req.params.id;
      const listOfCartoes = await Cartoes.findAll({
        where: {
          JogoId: jogoId
        }
      });
      res.json(listOfCartoes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

module.exports = router