const mongoose = require('mongoose');
require('dotenv').config();
async function cleanupDB() {
  try {
    console.log('[Cleanup] Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    console.log('[Cleanup] Conectado exitosamente\n');
    const collections = await db.listCollections().toArray();
    console.log('[Cleanup] Colecciones encontradas:');
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    console.log('');
    const collectionsToDelete = ['usuarios', 'logs'];
    for (const colName of collectionsToDelete) {
      const exists = collections.some(col => col.name === colName);
      if (exists) {
        console.log(`[Cleanup] Eliminando colección: ${colName}`);
        await db.collection(colName).drop();
        console.log(`✓ ${colName} eliminada\n`);
      } else {
        console.log(`[Cleanup] No existe: ${colName}\n`);
      }
    }
    console.log('[Cleanup] Verificando colecciones correctas...');
    const correctCollections = ['Usuarios', 'Logs'];
    const updatedCollections = await db.listCollections().toArray();
    correctCollections.forEach(colName => {
      const exists = updatedCollections.some(col => col.name === colName);
      console.log(`  ${exists ? '✓' : '✗'} ${colName}`);
    });
    console.log('\n[Cleanup] Cleanup completado');
    process.exit(0);
  } catch (error) {
    console.error('[Cleanup] Error:', error.message);
    process.exit(1);
  }
}
cleanupDB();
