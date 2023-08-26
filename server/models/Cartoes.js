module.exports = (sequelize, DataTypes) =>{

    const Cartoes = sequelize.define("Cartoes",{

        Tipo :{
            type: DataTypes.STRING,
            allowNull:false
        },
        Nome :{
            type: DataTypes.STRING,
            allowNull:false
        },
    })
    return Cartoes
}