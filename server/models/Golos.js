module.exports = (sequelize, DataTypes) =>{

    const Golos = sequelize.define("Golos",{

        TempoJogo :{
            type: DataTypes.TIME,
            allowNull:false
        },
        Nome :{
            type: DataTypes.STRING,
            allowNull:false
        },
    })
    return Golos
}