// Controlador para Resolución de Perfil Público con Sequelize ORM
const { getModels } = require('../models');

async function getPublicProfile(req, res) {
  try {
    const slug = req.params.slug.toLowerCase();
    const { User, Block, UserSetting } = getModels();

    const user = await User.findOne({
      where: { custom_slug: slug },
      attributes: ['id', 'email', 'plan', 'custom_slug', 'display_name', 'avatar_url', 'bio_text', 'seo_title', 'seo_description']
    });

    if (!user) {
      return res.status(404).json({ error: 'Perfil de BioAR no encontrado.' });
    }

    const rawBlocks = await Block.findAll({
      where: { user_id: user.id },
      order: [['position', 'ASC']]
    });

    const blocks = rawBlocks.map(b => ({
      id: b.id,
      user_id: b.user_id,
      type: b.type,
      position: b.position,
      content: typeof b.content_json === 'string' ? JSON.parse(b.content_json) : b.content_json
    }));

    let settingsObj = await UserSetting.findByPk(user.id);
    let settings = settingsObj ? settingsObj.toJSON() : {
      background_color: '#0f172a',
      background_type: 'solid',
      text_color: '#ffffff',
      button_style: 'rounded',
      button_color: '#3b82f6',
      button_text_color: '#ffffff',
      font_family: 'Inter',
      show_branding: true
    };

    // Plan Logic: En plan Free siempre se muestra la marca de agua BioAR
    if (user.plan === 'free') {
      settings.show_branding = true;
    }

    return res.json({
      user: {
        display_name: user.display_name,
        avatar_url: user.avatar_url,
        bio_text: user.bio_text,
        plan: user.plan,
        seo_title: user.seo_title || `${user.display_name || user.custom_slug} | BioAR`,
        seo_description: user.seo_description || `Página oficial de ${user.display_name || user.custom_slug}`
      },
      settings,
      blocks
    });
  } catch (error) {
    console.error('Error al resolver perfil público:', error);
    res.status(500).json({ error: 'Error al cargar perfil de BioAR.' });
  }
}

module.exports = { getPublicProfile };
