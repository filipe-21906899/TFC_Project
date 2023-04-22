module.exports = (sequelize, DataTypes) =>{

    const Clubes = sequelize.define("Clubes",{

        Nome :{
            type: DataTypes.STRING,
            allowNull:false
        },
    })

    Clubes.associate = (models) => {
        Clubes.hasMany(models.Equipas, {
            onDelete: "cascade",
        });
    };

    return Clubes
}