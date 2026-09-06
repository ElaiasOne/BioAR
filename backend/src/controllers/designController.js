// Controlador de Diseño y Configuración con Sequelize ORM
const { getModels } = require('../models');

// Obtener diseño del usuario
async function getDesignSettings(req, res) {
  try {
    const userId = req.user.id;
    const { UserSetting } = getModels();

    let settings = await UserSetting.findByPk(userId);
    if (!settings) {
      settings = await UserSetting.create({ user_id: userId });
    }

    return res.json({ settings });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener diseño.' });
  }
}

// Actualizar diseño
async function updateDesignSettings(req, res) {
  try {
    const userId = req.user.id;
    const {
      background_color,
      background_type,
      text_color,
      button_style,
      button_color,
      button_text_color,
      font_family,
      show_branding
    } = req.body;

    const { UserSetting } = getModels();
    let settings = await UserSetting.findByPk(userId);

    if (!settings) {
      settings = await UserSetting.create({ user_id: userId });
    }

    settings.background_color = background_color || settings.background_color;
    settings.background_type = background_type || settings.background_type;
    settings.text_color = text_color || settings.text_color;
    settings.button_style = button_style || settings.button_style;
    settings.button_color = button_color || settings.button_color;
    settings.button_text_color = button_text_color || settings.button_text_color;
    settings.font_family = font_family || settings.font_family;
    if (show_branding !== undefined) settings.show_branding = show_branding;

    await settings.save();

    return res.json({ message: 'Diseño actualizado con éxito.', settings });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar diseño.' });
  }
}

// Actualizar perfil y SEO
async function updateProfileAndSeo(req, res) {
  try {
    const userId = req.user.id;
    const { display_name, avatar_url, bio_text, custom_slug, seo_title, seo_description } = req.body;

    const { User } = getModels();
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    if (custom_slug) {
      const cleanSlug = custom_slug.toLowerCase().replace(/[^a-z0-9_-]/g, '');
      if (cleanSlug !== user.custom_slug) {
        const checkSlug = await User.findOne({ where: { custom_slug: cleanSlug } });
        if (checkSlug && checkSlug.id !== userId) {
          return res.status(400).json({ error: 'El slug ya pertenece a otro usuario.' });
        }
        user.custom_slug = cleanSlug;
      }
    }

    if (display_name !== undefined) user.display_name = display_name;
    if (avatar_url !== undefined) user.avatar_url = avatar_url;
    if (bio_text !== undefined) user.bio_text = bio_text;
    if (seo_title !== undefined) user.seo_title = seo_title;
    if (seo_description !== undefined) user.seo_description = seo_description;

    await user.save();

    return res.json({ message: 'Perfil y SEO actualizados exitosamente.', user });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar perfil y SEO.' });
  }
}

// Simulación de Upgrade de Plan
async function upgradePlan(req, res) {
  try {
    const userId = req.user.id;
    const { targetPlan } = req.body;

    if (!['free', 'pro', 'plus'].includes(targetPlan)) {
      return res.status(400).json({ error: 'Plan no válido.' });
    }

    const { User } = getModels();
    const user = await User.findByPk(userId);
    if (user) {
      user.plan = targetPlan;
      await user.save();
    }

    return res.json({ message: `¡Plan actualizado con éxito a ${targetPlan.toUpperCase()}!`, plan: targetPlan });
  } catch (error) {
    res.status(500).json({ error: 'Error al cambiar de plan.' });
  }
}

module.exports = { getDesignSettings, updateDesignSettings, updateProfileAndSeo, upgradePlan };
