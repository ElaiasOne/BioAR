<template>
  <div class="admin-layout bg-slate-950 min-h-screen text-slate-100 p-4 lg:p-8">
    <!-- Contenedor Principal Centrado -->
    <div class="max-w-6xl mx-auto space-y-6">
      
      <!-- Navbar / Encabezado del Panel -->
      <header class="glass-panel p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="p-2.5 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-xl text-white shadow-lg">
            <ShieldCheckIcon class="w-7 h-7" />
          </div>
          <div>
            <h1 class="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Panel de Administración
              <span class="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                ADMIN
              </span>
            </h1>
            <p class="text-xs text-slate-400">Gestión de usuarios y asignación manual de Plan PLUS (EliasFigueroa)</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <router-link to="/dashboard" class="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5">
            <LayoutDashboardIcon class="w-4 h-4" />
            Ir a mi Dashboard
          </router-link>
          <button @click="logout" class="btn-danger text-xs py-2 px-3 flex items-center gap-1.5" title="Cerrar Sesión">
            <LogOutIcon class="w-4 h-4" />
            Salir
          </button>
        </div>
      </header>

      <!-- Mensajes de Notificación / Alerta -->
      <div v-if="alertMessage" 
        class="p-4 rounded-xl text-xs flex items-center justify-between transition-all"
        :class="alertType === 'success' ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-200' : 'bg-rose-500/20 border border-rose-500/40 text-rose-200'"
      >
        <div class="flex items-center gap-2">
          <CheckCircle2Icon v-if="alertType === 'success'" class="w-4 h-4 text-emerald-400" />
          <AlertCircleIcon v-else class="w-4 h-4 text-rose-400" />
          <span>{{ alertMessage }}</span>
        </div>
        <button @click="alertMessage = ''" class="font-bold text-sm">✕</button>
      </div>

      <!-- Tarjetas de Estadísticas Rápidas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="glass-panel p-4 flex items-center gap-4">
          <div class="p-3 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
            <UsersIcon class="w-6 h-6" />
          </div>
          <div>
            <span class="text-xs text-slate-400 block font-medium">Total de Usuarios</span>
            <span class="text-2xl font-black text-white">{{ users.length }}</span>
          </div>
        </div>

        <div class="glass-panel p-4 flex items-center gap-4">
          <div class="p-3 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
            <ZapIcon class="w-6 h-6" />
          </div>
          <div>
            <span class="text-xs text-slate-400 block font-medium">Usuarios Plan PLUS</span>
            <span class="text-2xl font-black text-rose-400">{{ plusUsersCount }}</span>
          </div>
        </div>

        <div class="glass-panel p-4 flex items-center gap-4">
          <div class="p-3 bg-slate-800 text-slate-400 rounded-xl border border-slate-700">
            <UserCheckIcon class="w-6 h-6" />
          </div>
          <div>
            <span class="text-xs text-slate-400 block font-medium">Usuarios Plan FREE</span>
            <span class="text-2xl font-black text-slate-300">{{ freeUsersCount }}</span>
          </div>
        </div>
      </div>

      <!-- Sección Principal: Tabla con Buscador -->
      <div class="glass-panel p-6 space-y-4">
        
        <!-- Buscador -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div class="relative w-full md:w-96">
            <SearchIcon class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              v-model="searchQuery"
              @input="handleSearch"
              type="text"
              placeholder="Buscar por email, slug o nombre..."
              class="glass-input pl-9 text-xs w-full"
            />
            <button v-if="searchQuery" @click="clearSearch" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs">
              ✕
            </button>
          </div>

          <span class="text-xs text-slate-400 font-medium">
            Mostrando {{ filteredUsers.length }} usuarios
          </span>
        </div>

        <!-- Cargando -->
        <div v-if="loading" class="text-center py-12 text-slate-400 text-xs flex items-center justify-center gap-2">
          <div class="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          Cargando usuarios registrados...
        </div>

        <!-- Lista Vacía -->
        <div v-else-if="filteredUsers.length === 0" class="text-center py-12 text-slate-400 text-xs">
          No se encontraron usuarios coincidentes con "{{ searchQuery }}".
        </div>

        <!-- Tabla de Usuarios -->
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-300">
            <thead class="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-900/60 border-b border-slate-800">
              <tr>
                <th class="py-3 px-4">Usuario / Email</th>
                <th class="py-3 px-4">Slug (Enlace)</th>
                <th class="py-3 px-4">Fecha Registro</th>
                <th class="py-3 px-4">Plan Actual</th>
                <th class="py-3 px-4 text-right">Otorgar Plan PLUS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              <tr 
                v-for="user in filteredUsers" 
                :key="user.id"
                class="hover:bg-slate-900/40 transition-colors"
              >
                <td class="py-3.5 px-4 font-medium text-white">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 shrink-0 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 font-black uppercase text-xs border border-slate-700 shadow-sm">
                      {{ (user.display_name || user.custom_slug || 'U').charAt(0) }}
                    </div>
                    <div>
                      <span class="block text-xs font-bold text-white">{{ user.display_name || user.custom_slug }}</span>
                      <span class="block text-[11px] text-slate-400">{{ user.email }}</span>
                    </div>
                  </div>
                </td>

                <td class="py-3.5 px-4">
                  <a 
                    :href="`/bio/${user.custom_slug}`" 
                    target="_blank" 
                    class="text-sky-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                  >
                    bioar.me/{{ user.custom_slug }}
                  </a>
                </td>

                <td class="py-3.5 px-4 text-slate-400">
                  {{ formatDate(user.created_at) }}
                </td>

                <td class="py-3.5 px-4">
                  <span 
                    class="plan-badge text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md"
                    :class="user.plan === 'plus' || user.plan === 'pro' ? 'plus' : 'free'"
                  >
                    {{ (user.plan === 'pro' ? 'PLUS' : user.plan).toUpperCase() }}
                  </span>
                </td>

                <!-- Botón Toggle PLUS Interactivo -->
                <td class="py-3.5 px-4 text-right">
                  <button 
                    @click="togglePlan(user)"
                    :disabled="togglingId === user.id"
                    class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-end gap-2 ml-auto shadow-md"
                    :class="user.plan === 'plus' || user.plan === 'pro' 
                      ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white hover:from-rose-500 hover:to-amber-500 border border-rose-400/40' 
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600'"
                  >
                    <!-- Switch Indicador Visual -->
                    <span 
                      class="relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border border-slate-400/30 transition-colors duration-200"
                      :class="user.plan === 'plus' || user.plan === 'pro' ? 'bg-emerald-400' : 'bg-slate-950'"
                    >
                      <span 
                        class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition duration-200"
                        :class="user.plan === 'plus' || user.plan === 'pro' ? 'translate-x-4' : 'translate-x-0'"
                      />
                    </span>

                    <span v-if="togglingId === user.id">Guardando...</span>
                    <span v-else-if="user.plan === 'plus' || user.plan === 'pro'" class="flex items-center gap-1 text-white">
                      <ZapIcon class="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                      <span>PLUS Activo (Desactivar)</span>
                    </span>
                    <span v-else class="flex items-center gap-1 text-slate-200">
                      <span>Dar Plan PLUS Gratis</span>
                    </span>
                  </button>
                </td>

              </tr>
            </tbody>
          </table>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { api } from '../services/api';

import { 
  ShieldCheck as ShieldCheckIcon, 
  Users as UsersIcon, 
  Zap as ZapIcon, 
  UserCheck as UserCheckIcon,
  Search as SearchIcon,
  LayoutDashboard as LayoutDashboardIcon,
  LogOut as LogOutIcon,
  CheckCircle2 as CheckCircle2Icon,
  AlertCircle as AlertCircleIcon
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const users = ref([]);
const filteredUsers = ref([]);
const searchQuery = ref('');
const loading = ref(true);
const togglingId = ref(null);
const alertMessage = ref('');
const alertType = ref('success');

const plusUsersCount = computed(() => users.value.filter(u => u.plan === 'plus' || u.plan === 'pro').length);
const freeUsersCount = computed(() => users.value.filter(u => u.plan === 'free').length);

onMounted(() => {
  fetchUsers();
});

async function fetchUsers(query = '') {
  loading.value = true;
  try {
    const res = await api.adminGetUsers(query);
    users.value = res.users || [];
    filteredUsers.value = res.users || [];
  } catch (err) {
    showAlert(err.message || 'Error al cargar usuarios.', 'error');
  } finally {
    loading.value = false;
  }
}

let searchTimeout = null;
function handleSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchUsers(searchQuery.value);
  }, 250);
}

function clearSearch() {
  searchQuery.value = '';
  fetchUsers();
}

async function togglePlan(user) {
  const currentIsPlus = user.plan === 'plus' || user.plan === 'pro';
  const targetPlan = currentIsPlus ? 'free' : 'plus';
  togglingId.value = user.id;

  try {
    const res = await api.adminTogglePlan(user.id, targetPlan);
    user.plan = targetPlan;
    showAlert(`¡Plan del usuario ${user.custom_slug} actualizado a ${targetPlan.toUpperCase()} con éxito!`, 'success');
  } catch (err) {
    showAlert(err.message || 'Error al modificar el plan.', 'error');
  } finally {
    togglingId.value = null;
  }
}

function showAlert(msg, type = 'success') {
  alertMessage.value = msg;
  alertType.value = type;
  setTimeout(() => {
    if (alertMessage.value === msg) alertMessage.value = '';
  }, 4000);
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-AR', { year: 'numeric', month: 'short', day: 'numeric' });
}

function logout() {
  authStore.logout();
  router.push('/login');
}
</script>
