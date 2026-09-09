// Controlador de Bloques de Contenido con Sequelize y Plan Logic
const { getModels } = require('../models');

// Obtener todos los bloques del usuario autenticado
async function getUserBlocks(req, res) {
  try {
    const userId = req.user.id;
    const { Block } = getModels();

    const rawBlocks = await Block.findAll({
      where: { user_id: userId },
      order: [['position', 'ASC']]
    });

    const blocks = rawBlocks.map(b => ({
      id: b.id,
      user_id: b.user_id,
      type: b.type,
      position: b.position,
      content: typeof b.content_json === 'string' ? JSON.parse(b.content_json) : b.content_json
    }));

    return res.json({ blocks });
  } catch (error) {
    console.error('Error al obtener bloques:', error);
    res.status(500).json({ error: 'Error al obtener bloques.' });
  }
}

// Crear nuevo bloque con validación del límite por plan (Free max 3 bloques)
async function createBlock(req, res) {
  try {
    const userId = req.user.id;
    const { type, content } = req.body;

    if (!type || !content) {
      return res.status(400).json({ error: 'Tipo y contenido requeridos.' });
    }

    const { User, Block } = getModels();
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const blockCount = await Block.count({ where: { user_id: userId } });

    // Plan logic: Free max 3 bloques
    if (user.plan === 'free' && blockCount >= 3) {
      return res.status(403).json({
        error: 'Límite alcanzado. El plan Free permite un máximo de 3 bloques. Actualiza al Plan PLUS para agregar bloques ilimitados.',
        requiresUpgrade: true
      });
    }


    const nextPosition = blockCount + 1;
    const newBlock = await Block.create({
      user_id: userId,
      type,
      position: nextPosition,
      content_json: JSON.stringify(content)
    });

    return res.status(201).json({
      message: 'Bloque creado con éxito',
      block: {
        id: newBlock.id,
        user_id: userId,
        type: newBlock.type,
        position: newBlock.position,
        content
      }
    });
  } catch (error) {
    console.error('Error al crear bloque:', error);
    res.status(500).json({ error: 'Error al crear bloque.' });
  }
}

// Actualizar bloque existente
async function updateBlock(req, res) {
  try {
    const userId = req.user.id;
    const blockId = parseInt(req.params.id, 10);
    const { content } = req.body;

    const { Block } = getModels();
    const block = await Block.findOne({ where: { id: blockId, user_id: userId } });

    if (!block) {
      return res.status(404).json({ error: 'Bloque no encontrado.' });
    }

    block.content_json = JSON.stringify(content);
    await block.save();

    return res.json({ message: 'Bloque actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el bloque.' });
  }
}

// Reordenar bloques
async function reorderBlocks(req, res) {
  try {
    const userId = req.user.id;
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds debe ser un arreglo.' });
    }

    const { Block } = getModels();
    for (let i = 0; i < orderedIds.length; i++) {
      await Block.update(
        { position: i + 1 },
        { where: { id: orderedIds[i], user_id: userId } }
      );
    }

    return res.json({ message: 'Orden guardado exitosamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al reordenar bloques.' });
  }
}

// Eliminar bloque
async function deleteBlock(req, res) {
  try {
    const userId = req.user.id;
    const blockId = parseInt(req.params.id, 10);

    const { Block } = getModels();
    const deleted = await Block.destroy({ where: { id: blockId, user_id: userId } });

    if (!deleted) {
      return res.status(404).json({ error: 'Bloque no encontrado.' });
    }

    return res.json({ message: 'Bloque eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el bloque.' });
  }
}

module.exports = { getUserBlocks, createBlock, updateBlock, reorderBlocks, deleteBlock };
