module.exports = (sequelize, DataTypes) =>{

    const Jogo = sequelize.define("Jogo",{

        Home :{
            type: DataTypes.STRING,
            allowNull:false
        },
        Away :{
            type: DataTypes.STRING,
            allowNull:false
        },
        HomeId :{
            type: DataTypes.STRING,
            allowNull:false
        },
        AwayId :{
            type: DataTypes.STRING,
            allowNull:false
        },
        DataJogo :{
            type: DataTypes.DATE,
            allowNull:false
        },
    })

    Jogo.associate = (models) => {
        Jogo.hasMany(models.Cartoes, {
            onDelete: "cascade",
        }),
        Jogo.hasMany(models.Golos, {
            onDelete: "cascade",
        });
    };

    return Jogo
}