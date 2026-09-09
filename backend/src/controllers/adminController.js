// Controlador de Administración de Usuarios y Asignación Manual de Planes (BioAR)
const { Op } = require('sequelize');
const { getModels } = require('../models');

// Middleware para restringir acceso únicamente al usuario Administrador EliasFigueroa
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'No autenticado.' });
  }

  const slug = (req.user.custom_slug || '').toLowerCase();
  const email = (req.user.email || '').toLowerCase();

  if (slug === 'eliasfigueroa' || email === 'eliasfigueroa@bioar.me' || email === 'eliasjosefigueroa2018@gmail.com') {
    return next();
  }


  return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de Administrador.' });
}

// Obtener lista de usuarios registrados con buscador
async function getUsers(req, res) {
  try {
    const search = (req.query.search || '').trim().toLowerCase();
    const { User } = getModels();

    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { email: { [Op.like]: `%${search}%` } },
          { display_name: { [Op.like]: `%${search}%` } },
          { custom_slug: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: ['id', 'email', 'custom_slug', 'display_name', 'plan', 'created_at'],
      order: [['created_at', 'DESC']]
    });

    return res.json({ users });
  } catch (error) {
    console.error('Error al obtener lista de usuarios admin:', error);
    res.status(500).json({ error: 'Error al obtener usuarios.' });
  }
}

// Alternar / cambiar plan manualmente (Toggle Free / Plus)
async function toggleUserPlan(req, res) {
  try {
    const targetUserId = parseInt(req.params.id, 10);
    const { targetPlan } = req.body;

    if (!['free', 'plus', 'pro'].includes(targetPlan)) {
      return res.status(400).json({ error: 'Plan no válido.' });
    }

    const { User } = getModels();
    const user = await User.findByPk(targetUserId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    user.plan = targetPlan;
    await user.save();

    console.log(`[ADMIN] Usuario ${user.email} (ID ${user.id}) cambiado a plan ${targetPlan.toUpperCase()} por EliasFigueroa.`);

    return res.json({
      message: `Plan del usuario ${user.custom_slug} actualizado a ${targetPlan.toUpperCase()} exitosamente.`,
      user: {
        id: user.id,
        email: user.email,
        custom_slug: user.custom_slug,
        display_name: user.display_name,
        plan: user.plan
      }
    });
  } catch (error) {
    console.error('Error al cambiar plan desde admin:', error);
    res.status(500).json({ error: 'Error al cambiar plan del usuario.' });
  }
}

module.exports = {
  requireAdmin,
  getUsers,
  toggleUserPlan
};
