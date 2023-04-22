module.exports = (sequelize, DataTypes) =>{

    const JogoType = sequelize.define("JogoType",{

        Nome :{
            type: DataTypes.STRING,
            allowNull:false
        }
    });

    JogoType.associate = (models) => {
        JogoType.hasMany(models.Jogo, {
            onDelete: "cascade",
        });
    };

    return JogoType
}