module.exports = (sequelize, DataTypes) =>{

    const TecnicosType = sequelize.define("TecnicosType",{

        Nome :{
            type: DataTypes.STRING,
            allowNull:false
        }
    });

    TecnicosType.associate = (models) => {
        TecnicosType.hasMany(models.Tecnicos, {
            onDelete: "cascade",
        });
    };

    return TecnicosType
}