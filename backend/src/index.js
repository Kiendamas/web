
import sequelize, { syncModels, testConnection } from '../sequelize.js';
import app from './app.js';

const PORT = process.env.PORT || 3001;
const env = process.env.NODE_ENV || 'development';

async function startServer() {
  try {
    // Testear conexión
    await testConnection();
    
    // Sincronizar modelos sin force (alter: true para preservar datos)
    await syncModels(false); // force = false para no borrar datos
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${env}`);
      console.log(`� Database synchronized (data preserved)`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

startServer();
