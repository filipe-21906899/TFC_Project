module.exports = (sequelize, DataTypes) =>{

    const Torneio = sequelize.define("Torneio",{

        Ano :{
            type: DataTypes.INTEGER,
            allowNull:false
        },
        
    })
    Torneio.associate = (models) => {
        Torneio.hasMany(models.Jogo, {
            onDelete: "cascade",
        });
    };
    return Torneio
}