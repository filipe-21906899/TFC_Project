module.exports = (sequelize, DataTypes) =>{

    const Users = sequelize.define("Users",{

        Username :{
            type: DataTypes.STRING,
            allowNull:false
        },
        Password :{
            type: DataTypes.STRING,
            allowNull:false
        }
    })

    Users.associate = (models) => {
        Users.hasOne(models.Clubes, {
            onDelete: "cascade",
        });
    };

    return Users
}