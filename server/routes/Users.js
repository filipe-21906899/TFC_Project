const express = require('express');
const router = express.Router();
const { Users, Clubes } = require('../models');
const bcrypt = require("bcrypt");
//const {validateToken} = require('../middlewares/AuthMiddleware');
const {sign} = require('jsonwebtoken');

router.get("/:usersTypeId", async (req, res) =>{
    const usersTypeId = req.params.usersTypeId;
    const users = await Users.findAll({ where: { UsersTypeId: usersTypeId}});
    return res.json(users); 
});

router.post("/", async (req, res) =>{
    const {Username, Password, UsersTypeId} = req.body;

    bcrypt.hash(Password, 10).then((hash) => {
        Users.create({
            Username: Username,
            Password: hash,
            UsersTypeId: UsersTypeId
        });
        return res.json("SUCCESS");
    });
});

router.post("/login", async (req, res) => {
    const { Username, Password } = req.body;
  
    const lowercaseUsername = Username.toLowerCase(); // Convert the username to lowercase
  
    const user = await Users.findOne({
      where: { Username: lowercaseUsername },
      include: [Clubes]
    });
  
    if (!user) return res.json({ error: "Utilizador não existe" });
  
    bcrypt.compare(Password, user.Password).then((match) => {
      if (!match) return res.json({ error: "Palavra-passe errada" });
  
      let clubId = null;
      let clubName = null;
  
      if (user.Clube && user.Clube.id) {
        clubId = user.Clube.id;
        clubName = user.Clube.Nome;
      }
  
      const accessToken = sign(
        {
          username: user.Username,
          id: user.id,
          UsersTypeId: user.UsersTypeId,
          clubId: clubId,
          clubName: clubName
        },
        "importantsecret"
      );
  
      return res.json({
        accessToken: accessToken,
        username: user.Username,
        id: user.id,
        UsersTypeId: user.UsersTypeId,
        clubId: clubId,
        clubName: clubName
      });
    });
  });

module.exports = router