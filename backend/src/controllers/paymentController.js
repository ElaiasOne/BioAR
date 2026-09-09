// Controlador de Pagos con Mercado Pago (Pesos Argentinos - ARS)
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const { getModels } = require('../models');

// Inicializar cliente Mercado Pago
function getMercadoPagoClient() {
  const accessToken = (process.env.MERCADOPAGO_ACCESS_TOKEN || '').trim();
  if (!accessToken) {
    throw new Error('MERCADOPAGO_ACCESS_TOKEN no está configurado en las variables de entorno.');
  }
  return new MercadoPagoConfig({ accessToken });
}

// Mapa de Precios y Títulos en Pesos Argentinos (ARS)
const PLAN_DETAILS = {
  plus: {
    title: 'Plan PLUS - BioAR',
    price: 4999,
    description: 'Suscripción mensual Plan PLUS BioAR (Bloques ilimitados, estilos pro, sin marca BioAR, analíticas avanzadas)'
  }
};

// Crear Preferencia de Pago en Mercado Pago
async function createPreference(req, res) {
  try {
    const { targetPlan } = req.body;
    const userId = req.user.id;
    const userEmail = req.user.email;

    if (!PLAN_DETAILS[targetPlan]) {
      return res.status(400).json({ error: 'Plan no válido para pago.' });
    }

    const planInfo = PLAN_DETAILS[targetPlan];
    const client = getMercadoPagoClient();
    const preference = new Preference(client);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';

    const preferenceData = {
      body: {
        items: [
          {
            id: targetPlan,
            title: planInfo.title,
            description: planInfo.description,
            quantity: 1,
            unit_price: planInfo.price,
            currency_id: 'ARS'
          }
        ],
        payer: {
          email: userEmail
        },
        back_urls: {
          success: `${frontendUrl}/dashboard?payment=success&plan=${targetPlan}`,
          failure: `${frontendUrl}/dashboard?payment=failure`,
          pending: `${frontendUrl}/dashboard?payment=pending`
        },
        external_reference: JSON.stringify({ userId, targetPlan }),
        notification_url: `${backendUrl}/api/payments/webhook`
      }
    };

    const response = await preference.create(preferenceData);

    return res.json({
      preferenceId: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point
    });
  } catch (error) {
    console.error('Error al crear preferencia de Mercado Pago:', error);
    return res.status(500).json({ error: 'Error al generar el checkout de Mercado Pago.' });
  }
}

// Webhook / Notificación IPN de Mercado Pago
async function handleWebhook(req, res) {
  try {
    const { topic, type, 'data.id': dataId } = req.query;
    const bodyData = req.body || {};

    const actionType = type || topic || bodyData.type || bodyData.topic;
    const paymentId = dataId || req.query.id || (bodyData.data && bodyData.data.id) || bodyData.id;

    if (actionType === 'payment' && paymentId) {
      const client = getMercadoPagoClient();
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: paymentId });

      if (paymentInfo && paymentInfo.status === 'approved' && paymentInfo.external_reference) {
        let referenceData;
        try {
          referenceData = JSON.parse(paymentInfo.external_reference);
        } catch (e) {
          referenceData = null;
        }

        if (referenceData && referenceData.userId && referenceData.targetPlan) {
          const { User } = getModels();
          const user = await User.findByPk(referenceData.userId);
          if (user) {
            user.plan = referenceData.targetPlan;
            await user.save();
            console.log(`Plan del usuario ID ${user.id} actualizado a ${referenceData.targetPlan} tras pago exitoso.`);
          }
        }
      }
    }

    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Error al procesar webhook de Mercado Pago:', error);
    return res.status(200).json({ status: 'error_handled' });
  }
}

module.exports = {
  createPreference,
  handleWebhook
};
