// Definición de Rutas API REST de BioAR
const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

const authController = require('../controllers/authController');
const blockController = require('../controllers/blockController');
const designController = require('../controllers/designController');
const publicController = require('../controllers/publicController');
const uploadController = require('../controllers/uploadController');

// Rutas Públicas de Autenticación
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Ruta Pública de perfil de usuario
router.get('/public/:slug', publicController.getPublicProfile);

// Rutas Protegidas (Dashboard)
router.get('/auth/me', authenticateToken, authController.getMe);

// Gestor de Bloques
router.get('/dashboard/blocks', authenticateToken, blockController.getUserBlocks);
router.post('/dashboard/blocks', authenticateToken, blockController.createBlock);
router.put('/dashboard/blocks/reorder', authenticateToken, blockController.reorderBlocks);
router.put('/dashboard/blocks/:id', authenticateToken, blockController.updateBlock);
router.delete('/dashboard/blocks/:id', authenticateToken, blockController.deleteBlock);

// Gestor de Diseño y Perfil / SEO
router.get('/dashboard/design', authenticateToken, designController.getDesignSettings);
router.put('/dashboard/design', authenticateToken, designController.updateDesignSettings);
router.put('/dashboard/profile', authenticateToken, designController.updateProfileAndSeo);
router.post('/dashboard/upgrade-plan', authenticateToken, designController.upgradePlan);

// Carga de Archivos e Imágenes (Multer / Hostinger compatible)
router.post('/dashboard/upload', authenticateToken, uploadMiddleware.single('file'), uploadController.uploadImage);

module.exports = router;
