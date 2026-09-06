// Middleware de carga de imágenes y audio (MP3, WAV, M4A) por carpeta de usuario
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userFolder = (req.user && (req.user.custom_slug || `usr_${req.user.id}`)) || 'general';
    const userUploadDir = path.join(__dirname, '../../public/uploads', userFolder);

    if (!fs.existsSync(userUploadDir)) {
      fs.mkdirSync(userUploadDir, { recursive: true });
    }

    cb(null, userUploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    const isAudio = file.mimetype.startsWith('audio/');
    const prefix = isAudio ? 'audio-' : 'img-';
    cb(null, prefix + uniqueSuffix + ext);
  }
});

function fileFilter(req, file, cb) {
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const allowedAudioTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/x-m4a', 'audio/aac'];

  if (allowedImageTypes.includes(file.mimetype) || allowedAudioTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato no soportado. Solo se permiten imágenes (JPG, PNG, WEBP) o archivos de audio (MP3, WAV, M4A, OGG).'), false);
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 } // Límite de 15MB para audios de adelanto
});

module.exports = upload;
