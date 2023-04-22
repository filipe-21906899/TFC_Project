module.exports = (sequelize, DataTypes) =>{

    const Equipas = sequelize.define("Equipas",{
        Pontos :{
            type: DataTypes.INTEGER,
            allowNull:false
        },
    })

    Equipas.associate = (models) => {
        Equipas.hasMany(models.EquipaJogadores, {
            onDelete: "cascade",
        });
        Equipas.hasMany(models.EquipaTecnica, {
            onDelete: "cascade",
        });
    };
    return Equipas
}