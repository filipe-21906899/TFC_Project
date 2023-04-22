module.exports = (sequelize, DataTypes) =>{

    const UsersType = sequelize.define("UsersType",{

        Nome :{
            type: DataTypes.STRING,
            allowNull:false
        }
    });

    UsersType.associate = (models) => {
        UsersType.hasMany(models.Users, {
            onDelete: "cascade",
        });
    };
    return UsersType
}