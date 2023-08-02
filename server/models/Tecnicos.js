module.exports = (sequelize, DataTypes) => {
    const Tecnicos = sequelize.define('Tecnicos', {
      Nome: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Clube: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Morada: {
        type: DataTypes.STRING,
        allowNull: false
      },
      CodigoPostal: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Contacto: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      DataNascimento: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      Email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      CCTecnico: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Reside: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      Imagem: {
        type: DataTypes.TEXT('long'),
        allowNull: false
      }
    });
  
    Tecnicos.associate = (models) => {
      Tecnicos.hasOne(models.EquipaTecnica, {
        onDelete: 'cascade'
      });
    };
  
    return Tecnicos;
  };
  