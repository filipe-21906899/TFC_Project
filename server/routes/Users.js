const express = require('express');
const router = express.Router();
const { Users } = require('../models');
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
    const {Username, Password} = req.body;

    const user = await Users.findOne({ where: {Username: Username}});

    if(!user) return res.json({error: "User Doesn't Exist"});

    bcrypt.compare(Password, user.Password).then((match)=>{
        if(!match) return res.json({error: "Wrong Username And Password Combination"});
        
        const accessToken = sign(
            {username: user.Username, id: user.id, UsersTypeId: user.UsersTypeId},
            "importantsecret"
        );

        return res.json({accessToken: accessToken, username: user.Username, id: user.id, UsersTypeId: user.UsersTypeId});
    });
});

module.exports = router