module.exports = (sequelize, DataTypes) =>{

    const JogoJogadores = sequelize.define("JogoJogadores",{

        Nome :{
            type: DataTypes.STRING,
            allowNull:false
        },
        Clube :{
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
        Escalao :{
            type: DataTypes.STRING,
            allowNull:false
        },
        EscalaoId :{
            type: DataTypes.STRING,
            allowNull:false
        },
    })

    return JogoJogadores
}