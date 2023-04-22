module.exports = (sequelize, DataTypes) =>{

    const Escalao = sequelize.define("Escalao",{

        Nome :{
            type: DataTypes.STRING,
            allowNull:false
        }
    });

    Escalao.associate = (models) => {
        Escalao.hasMany(models.Equipas, {
            onDelete: "cascade",
        });
        Escalao.hasOne(models.Torneio, {
            onDelete: "cascade",
        });
        Escalao.hasMany(models.Jogadores, {
            onDelete: "cascade",
        });
        Escalao.hasMany(models.Tecnicos, {
            onDelete: "cascade",
        });
    };

    return Escalao
}