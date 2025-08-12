import { DataTypes, Model } from 'sequelize';
import sequelize from '../../sequelize.js';
import Categoria from './categoria.js';

class Subcategoria extends Model {}

Subcategoria.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoriaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Categoria,
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'Subcategoria',
});

Subcategoria.belongsTo(Categoria, { foreignKey: 'categoriaId' });
Categoria.hasMany(Subcategoria, { foreignKey: 'categoriaId' });

export default Subcategoria;

