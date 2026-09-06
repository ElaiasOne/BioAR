// Servicio de cliente HTTP para comunicar con la API REST de BioAR
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const BACKEND_BASE = API_URL.replace('/api', '');

function getHeaders(isFormData = false) {
  const token = localStorage.getItem('bioar_token');
  const headers = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function request(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData;
  const config = {
    ...options,
    headers: {
      ...getHeaders(isFormData),
      ...(options.headers || {})
    }
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error || 'Ocurrió un error en la solicitud.');
    error.status = response.status;
    error.requiresUpgrade = data.requiresUpgrade || false;
    throw error;
  }

  return data;
}

export function resolveImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('/uploads/')) {
    return `${BACKEND_BASE}${url}`;
  }
  return url;
}

export const api = {
  // Autenticación
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (email, password, slug, displayName) => request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, slug, displayName }) }),
  getMe: () => request('/auth/me'),

  // Bloques
  getBlocks: () => request('/dashboard/blocks'),
  createBlock: (type, content) => request('/dashboard/blocks', { method: 'POST', body: JSON.stringify({ type, content }) }),
  updateBlock: (id, content) => request(`/dashboard/blocks/${id}`, { method: 'PUT', body: JSON.stringify({ content }) }),
  reorderBlocks: (orderedIds) => request('/dashboard/blocks/reorder', { method: 'PUT', body: JSON.stringify({ orderedIds }) }),
  deleteBlock: (id) => request(`/dashboard/blocks/${id}`, { method: 'DELETE' }),

  // Diseño y Configuración
  getDesign: () => request('/dashboard/design'),
  updateDesign: (designData) => request('/dashboard/design', { method: 'PUT', body: JSON.stringify(designData) }),
  updateProfile: (profileData) => request('/dashboard/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
  upgradePlan: (targetPlan) => request('/dashboard/upgrade-plan', { method: 'POST', body: JSON.stringify({ targetPlan }) }),

  // Carga de Archivos
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/dashboard/upload', { method: 'POST', body: formData });
  },

  // Perfil Público
  getPublicProfile: (slug) => request(`/public/${slug}`)
};
