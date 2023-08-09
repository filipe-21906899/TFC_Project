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

// New route to get all JogadoreId values with given EquipaId
router.get("/check", async (req, res) => {
    try {
        const equipaId = req.query.equipaId;

        // Perform database query to retrieve all JogadoreId values with given EquipaId
        const jogadoresData = await EquipaJogadores.findAll({
            where: {
                EquipaId: equipaId
            },
            attributes: ['JogadoreId'] // Only fetch the JogadoreId column
        });

        const jogadoresIds = jogadoresData.map(item => item.JogadoreId);
        
        if (jogadoresIds.length > 0) {
            res.json(jogadoresIds);
        } else {
            res.json({ equipaId: null });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router