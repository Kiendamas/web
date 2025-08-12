import { DataTypes, Model } from 'sequelize';
import sequelize from '../../sequelize.js';

class Categoria extends Model {}

Categoria.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  sequelize,
  modelName: 'Categoria',
});



export default Categoria;
