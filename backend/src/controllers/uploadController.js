// Controlador de Subida de Archivos / Imágenes con organización por carpeta de usuario
function uploadImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha adjuntado ningún archivo.' });
    }

    // Carpeta del usuario (slug o usr_id)
    const userFolder = (req.user && (req.user.custom_slug || `usr_${req.user.id}`)) || 'general';
    
    // Retorna la URL estática relativa servida por Express: /uploads/{userFolder}/{filename}
    const fileUrl = `/uploads/${userFolder}/${req.file.filename}`;

    return res.json({
      message: 'Imagen subida exitosamente',
      url: fileUrl,
      userFolder,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({ error: 'Error interno al procesar la imagen.' });
  }
}

module.exports = { uploadImage };
