import { DataTypes, Model } from 'sequelize';
import sequelize from '../../sequelize.js';
import Categoria from './categoria.js';
import Subcategoria from './subcategoria.js';

class PaqueteTuristico extends Model {}

PaqueteTuristico.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  campoVariable: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  moneda: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'ARS',
    validate: {
      isIn: [['ARS', 'USD']]
    }
  },
  imagenes: {
    type: DataTypes.JSON, // Array de URLs (Cloudinary)
    allowNull: true,
  },
  videos: {
    type: DataTypes.JSON, // Array de URLs (Cloudinary)
    allowNull: true,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  categoriaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Categoria,
      key: 'id',
    },
  },
  subcategoriaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Subcategoria,
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'PaqueteTuristico',
});

PaqueteTuristico.belongsTo(Categoria, { foreignKey: 'categoriaId' });
Categoria.hasMany(PaqueteTuristico, { foreignKey: 'categoriaId' });
PaqueteTuristico.belongsTo(Subcategoria, { foreignKey: 'subcategoriaId' });
Subcategoria.hasMany(PaqueteTuristico, { foreignKey: 'subcategoriaId' });

export default PaqueteTuristico;

