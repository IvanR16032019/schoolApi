const ncp = require('ncp').ncp;
const path = require('path');
const fs = require('fs');

// Carpeta de origen (donde están los archivos originales)
const sourceDir = path.resolve(__dirname, '../');  // Aquí toma la raíz del proyecto

// Carpeta de destino (donde se copiarán los archivos)
const destDir = path.resolve(__dirname, '../dist');  // Aquí se copiarán en 'dist'

// Verificar si la carpeta dist existe, si no, crearla
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copiar los archivos sin la carpeta dist dentro de sí misma
ncp(sourceDir, destDir, { filter: (file) => !file.includes('dist') }, function (err) {
  if (err) {
    return console.error('Error al copiar los archivos:', err);
  }
  console.log('Archivos copiados exitosamente a dist');
});
