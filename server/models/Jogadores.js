module.exports = (sequelize, DataTypes) =>{

    const Jogadores = sequelize.define("Jogadores",{

        Nome :{
            type: DataTypes.STRING,
            allowNull:false
        },
        Clube :{
            type: DataTypes.STRING,
            allowNull:false
        },
        Morada :{
            type: DataTypes.STRING,
            allowNull:false
        },
        CodigoPostal :{
            type: DataTypes.STRING,
            allowNull:false
        },
        Contacto :{
            type: DataTypes.INTEGER,
            allowNull:false
        },
        DataNascimento :{
            type: DataTypes.DATEONLY,
            allowNull:false
        },
        Email :{
            type: DataTypes.STRING,
            allowNull:false
        },
        CCJogador :{
            type: DataTypes.STRING,
            allowNull:false
        },
        CCGuardiao :{
            type: DataTypes.STRING,
            allowNull:false
        },
        Reside :{
            type: DataTypes.BOOLEAN,
            allowNull:false
        },
        Castigado :{
            type: DataTypes.BOOLEAN,
            allowNull:false
        },
        NCartao :{
            type: DataTypes.INTEGER,
            allowNull:false
        },
        Imagem :{
            type: DataTypes.TEXT('long'),
            allowNull:false
        },
        File :{
            type: DataTypes.TEXT('long'),
            allowNull:false
        },

    })
    Jogadores.associate = (models) => {
       Jogadores.hasMany(models.Cartoes, {
            onDelete: "cascade",
        });
        Jogadores.hasMany(models.Golos, {
            onDelete: "cascade",
        });
        Jogadores.hasOne(models.EquipaJogadores, {
            onDelete: "cascade",
        });
    };

    return Jogadores
}