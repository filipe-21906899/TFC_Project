module.exports = (sequelize, DataTypes) =>{

    const CadernoEleitoral = sequelize.define("CadernoEleitoral",{

        CC :{
            type: DataTypes.INTEGER,
            allowNull:false
        }
    })
    return CadernoEleitoral
}