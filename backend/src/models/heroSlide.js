import { DataTypes, Model } from 'sequelize';
import sequelize from '../../sequelize.js';

class HeroSlide extends Model {}

HeroSlide.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subtitle: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  buttonText: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Más info',
  },
  buttonLink: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '#servicios',
  },
  mediaType: {
    type: DataTypes.ENUM('image', 'video'),
    allowNull: false,
    defaultValue: 'image',
  },
  mediaUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  posterUrl: {
    type: DataTypes.STRING,
    allowNull: true, // Solo para videos
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  sequelize,
  modelName: 'HeroSlide',
  tableName: 'hero_slides',
});

export default HeroSlide;
