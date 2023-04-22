module.exports = (sequelize, DataTypes) =>{

    const Golos = sequelize.define("Golos",{

        TempoJogo :{
            type: DataTypes.TIME,
            allowNull:false
        }
    })
    return Golos
}