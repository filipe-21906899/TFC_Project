const express = require('express');
const router = express.Router();
const {EquipaTecnica} = require('../models');

router.get("/", async (req, res) =>{
    const listOfPost = await EquipaTecnica.findAll();
    res.json(listOfPost);
});

router.post("/", async (req, res) =>{
    const cc = req.body;
    await EquipaTecnica.create(cc);
    res.json(cc);
})

// New route to get all JogadoreId values with given EquipaId
router.get("/check", async (req, res) => {
    try {
        const equipaId = req.query.equipaId;

        // Perform database query to retrieve all JogadoreId values with given EquipaId
        const tecnicosData = await EquipaTecnica.findAll({
            where: {
                EquipaId: equipaId
            },
            attributes: ['TecnicoId'] // Only fetch the JogadoreId column
        });

        const tecnicosIds = tecnicosData.map(item => item.TecnicoId);
        
        if (tecnicosIds.length > 0) {
            res.json(tecnicosIds);
        } else {
            res.json({ equipaId: null });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router