module.exports = (sequelize, DataTypes) =>{

    const Torneio = sequelize.define("Torneio",{
        
    })
    Torneio.associate = (models) => {
        Torneio.hasMany(models.Jogo, {
            onDelete: "cascade",
        });
    };
    return Torneio
}