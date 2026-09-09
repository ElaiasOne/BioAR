// Controlador de Autenticación refactorizado para usar Sequelize ORM
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getModels } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_bioar_2026';

// Registro de usuario con Sequelize
async function register(req, res) {
  try {
    const { email, password, slug, displayName } = req.body;
    if (!email || !password || !slug) {
      return res.status(400).json({ error: 'Email, contraseña y slug son obligatorios.' });
    }

    const { User, Block, UserSetting } = getModels();
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9_-]/g, '');

    // Verificar duplicados
    const existing = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [{ email }, { custom_slug: cleanSlug }]
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'El email o el slug personalizado ya están en uso.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password_hash: passwordHash,
      plan: 'free',
      custom_slug: cleanSlug,
      display_name: displayName || cleanSlug,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
      bio_text: 'Bienvenido a mi perfil de BioAR'
    });

    await UserSetting.create({ user_id: newUser.id });

    await Block.create({
      user_id: newUser.id,
      type: 'featured_card',
      position: 1,
      content_json: JSON.stringify({
        title: "Mi Proyecto Principal",
        subtitle: "Novedad 2026",
        coverUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
        description: "Haz clic para conocer mi contenido principal.",
        actionUrl: "https://bioar.me",
        actionText: "Ver Más Información"
      })
    });

    const token = jwt.sign({ id: newUser.id, email: newUser.email, plan: 'free', custom_slug: cleanSlug }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        plan: newUser.plan,
        custom_slug: newUser.custom_slug,
        display_name: newUser.display_name
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno al registrar usuario.' });
  }
}

// Login de usuario con Sequelize
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email o usuario y contraseña requeridos.' });
    }

    const { User, UserSetting } = getModels();
    const cleanInput = email.trim().toLowerCase();

    // Garantizar existencia y clave del usuario Admin EliasFigueroa (Guerrero42)
    if (cleanInput === 'eliasfigueroa' || cleanInput === 'eliasfigueroa@bioar.me') {
      let adminUser = await User.findOne({
        where: {
          [require('sequelize').Op.or]: [
            { email: 'eliasfigueroa@bioar.me' },
            { custom_slug: 'eliasfigueroa' }
          ]
        }
      });

      if (password === 'Guerrero42') {
        const passwordHash = await bcrypt.hash('Guerrero42', 10);
        if (!adminUser) {
          adminUser = await User.create({
            email: 'eliasfigueroa@bioar.me',
            password_hash: passwordHash,
            plan: 'plus',
            custom_slug: 'eliasfigueroa',
            display_name: 'Elias Figueroa',
            bio_text: 'Administrador Oficial BioAR'
          });
          await UserSetting.create({ user_id: adminUser.id });
        } else {
          adminUser.password_hash = passwordHash;
          adminUser.plan = 'plus';
          adminUser.custom_slug = 'eliasfigueroa';
          await adminUser.save();
        }
      }
    }


    // Buscar usuario por Email o por Slug
    const user = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { email: cleanInput },
          { custom_slug: cleanInput }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, plan: user.plan, custom_slug: user.custom_slug }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan,
        custom_slug: user.custom_slug,
        display_name: user.display_name,
        avatar_url: user.avatar_url,
        bio_text: user.bio_text
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno en inicio de sesión.' });
  }
}


// Obtener usuario autenticado con Sequelize
async function getMe(req, res) {
  try {
    const userId = req.user.id;
    const { User } = getModels();

    const user = await User.findByPk(userId, {
      attributes: ['id', 'email', 'plan', 'custom_slug', 'display_name', 'avatar_url', 'bio_text', 'seo_title', 'seo_description']
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    return res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario.' });
  }
}

module.exports = { register, login, getMe };
