const express = require('express')
const router = express.Router()
const { Golos } = require('../models')

router.get("/", async (req, res) =>{
    const listOfPost = await Golos.findAll();
    res.json(listOfPost);
});

router.post("/", async (req, res) =>{
    const cc = req.body;
    await Golos.create(cc);
    res.json(cc);
})

router.get("/:id", async (req, res) => {
    try {
      const jogoId = req.params.id;
      const listOfGolos = await Golos.findAll({
        where: {
          JogoId: jogoId
        }
      });
      res.json(listOfGolos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

module.exports = router