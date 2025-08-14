import { DataTypes, Model } from 'sequelize';
import sequelize from '../../sequelize.js';
import PaqueteTuristico from './paqueteTuristico.js';

class Resena extends Model {}

Resena.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  texto: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  nombreCliente: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  emailCliente: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  media: {
    type: DataTypes.JSON, // Array de URLs (Cloudinary)
    allowNull: true,
  },
  rating: {
    type: DataTypes.INTEGER, // estrellas, avioncitos, etc
    allowNull: false,
    defaultValue: 5,
  },
  paqueteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PaqueteTuristico,
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'Resena',
});

Resena.belongsTo(PaqueteTuristico, { foreignKey: 'paqueteId' });
PaqueteTuristico.hasMany(Resena, { foreignKey: 'paqueteId' });

export default Resena;
