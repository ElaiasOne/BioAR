<template>
  <div class="dashboard-layout bg-slate-950 min-h-screen text-slate-100">
    <!-- Panel Izquierdo: Editor y Gestión -->
    <div class="dashboard-sidebar flex flex-col h-full border-r border-slate-800">
      <!-- Navbar Superior -->
      <header class="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div class="flex items-center gap-3">
          <h1 class="text-xl font-extrabold tracking-tight">
            <span class="brand-logo-text text-xl">Bio<span class="brand-logo-accent">AR</span></span>
          </h1>
          <span class="plan-badge" :class="authStore.userPlan">
            {{ authStore.userPlan.toUpperCase() }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <a 
            :href="`/bio/${bioStore.userProfile.custom_slug || 'demo'}`" 
            target="_blank" 
            class="btn-secondary text-xs"
          >
            <ExternalLinkIcon class="w-3.5 h-3.5" />
            Ver Página
          </a>
          <button @click="openUpgrade" class="btn-primary text-xs py-1.5 px-3">
            <ZapIcon class="w-3.5 h-3.5" />
            Planes
          </button>
          <button @click="logout" class="btn-danger text-xs p-1.5" title="Cerrar Sesión">
            <LogOutIcon class="w-4 h-4" />
          </button>
        </div>
      </header>

      <!-- Pestañas de Navegación del Editor -->
      <nav class="dashboard-tabs-nav">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="editor-nav-tab"
          :class="{ active: activeTab === tab.id }"
        >
          {{ tab.name }}
        </button>
      </nav>

      <!-- Área de Edición Contenido -->
      <main class="flex-1 overflow-y-auto p-4 space-y-4">
        <!-- Pestaña: Mi Bio & Bloques -->
        <div v-if="activeTab === 'content'" class="space-y-4">
          <!-- Editor del Perfil / Cabecera -->
          <HeaderEditor 
            :initialProfile="bioStore.userProfile" 
            @update="bioStore.updateProfile" 
          />

          <!-- Lista de Bloques del Usuario -->
          <div v-for="block in bioStore.blocks" :key="block.id">
            <SongInfoEditor 
              v-if="block.type === 'featured_card' || block.type === 'song_info'"
              :blockId="block.id"
              :initialContent="block.content"
              @update="bioStore.updateBlock($event.id, $event.content)"
              @delete="bioStore.deleteBlock"
            />
            <SocialLinksEditor 
              v-else-if="block.type === 'social_links'"
              :blockId="block.id"
              :initialContent="block.content"
              @update="bioStore.updateBlock($event.id, $event.content)"
              @delete="bioStore.deleteBlock"
            />
            <TextEditor 
              v-else-if="block.type === 'text'"
              :blockId="block.id"
              :initialContent="block.content"
              @update="bioStore.updateBlock($event.id, $event.content)"
              @delete="bioStore.deleteBlock"
            />
            <ImageEditor 
              v-else-if="block.type === 'image'"
              :blockId="block.id"
              :initialContent="block.content"
              @update="bioStore.updateBlock($event.id, $event.content)"
              @delete="bioStore.deleteBlock"
            />
          </div>

          <!-- Botón de Agregar Bloque -->
          <button @click="showAddBlockModal = true" class="btn-primary w-full justify-center py-3">
            <PlusIcon class="w-4 h-4" />
            Agregar Bloque de Contenido
          </button>
        </div>

        <!-- Pestaña: Redes Sociales -->
        <div v-else-if="activeTab === 'social'" class="space-y-4">
          <div v-if="socialBlock">
            <SocialLinksEditor 
              :blockId="socialBlock.id"
              :initialContent="socialBlock.content"
              @update="bioStore.updateBlock($event.id, $event.content)"
              @delete="bioStore.deleteBlock"
            />
          </div>
          <div v-else class="text-center py-8 glass-panel">
            <Share2Icon class="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <p class="text-xs text-slate-400 mb-3">Aún no has agregado un bloque de redes sociales.</p>
            <button @click="createSocialBlock" class="btn-primary text-xs mx-auto">
              + Crear Bloque de Redes Sociales
            </button>
          </div>
        </div>

        <!-- Pestaña: Diseño -->
        <div v-else-if="activeTab === 'design'">
          <DesignEditor 
            :userPlan="authStore.userPlan"
            :initialDesign="bioStore.designSettings"
            @update="bioStore.updateDesign"
            @requestUpgrade="openUpgradeWithReason"
          />
        </div>

        <!-- Pestaña: Configuración & SEO -->
        <div v-else-if="activeTab === 'settings'">
          <SettingsEditor 
            :initialSlug="bioStore.userProfile.custom_slug"
            :initialSeoTitle="bioStore.userProfile.seo_title"
            :initialSeoDesc="bioStore.userProfile.seo_description"
            @update="bioStore.updateProfile"
          />
        </div>
      </main>
    </div>

    <!-- Panel Derecho: Vista Previa Móvil en Tiempo Real -->
    <div class="dashboard-preview hidden lg:flex">
      <div class="phone-mockup">
        <div class="phone-notch"></div>
        <div class="phone-screen">
          <LivePreview 
            :profile="bioStore.userProfile"
            :design="bioStore.designSettings"
            :blocks="bioStore.blocks"
          />
        </div>
      </div>
    </div>

    <!-- Modales -->
    <BlockModal 
      :isOpen="showAddBlockModal"
      @close="showAddBlockModal = false"
      @add="handleAddBlock"
    />

    <PlanManagerModal 
      :isOpen="bioStore.showUpgradeModal"
      :currentPlan="authStore.userPlan"
      :reason="bioStore.upgradeModalReason"
      @close="bioStore.showUpgradeModal = false"
      @upgrade="handleUpgrade"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useBioStore } from '../stores/bioStore';

import HeaderEditor from '../components/HeaderEditor.vue';
import SongInfoEditor from '../components/SongInfoEditor.vue';
import SocialLinksEditor from '../components/SocialLinksEditor.vue';
import TextEditor from '../components/TextEditor.vue';
import ImageEditor from '../components/ImageEditor.vue';
import DesignEditor from '../components/DesignEditor.vue';
import SettingsEditor from '../components/SettingsEditor.vue';
import LivePreview from '../components/LivePreview.vue';
import BlockModal from '../components/BlockModal.vue';
import PlanManagerModal from '../components/PlanManagerModal.vue';

import { 
  ExternalLink as ExternalLinkIcon, 
  Zap as ZapIcon, 
  LogOut as LogOutIcon, 
  Plus as PlusIcon,
  Share2 as Share2Icon 
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const bioStore = useBioStore();

const activeTab = ref('content');
const showAddBlockModal = ref(false);

const tabs = [
  { id: 'content', name: 'Mi Bio & Bloques' },
  { id: 'social', name: 'Redes Sociales' },
  { id: 'design', name: 'Diseño' },
  { id: 'settings', name: 'Configuración & SEO' }
];

const socialBlock = computed(() => bioStore.blocks.find(b => b.type === 'social_links'));

onMounted(() => {
  bioStore.loadDashboardData();
});

function openUpgrade() {
  bioStore.upgradeModalReason = '';
  bioStore.showUpgradeModal = true;
}

function openUpgradeWithReason(reason) {
  bioStore.upgradeModalReason = reason;
  bioStore.showUpgradeModal = true;
}

async function handleAddBlock({ type, content }) {
  try {
    await bioStore.createBlock(type, content);
  } catch (err) {
    // Manejo en store
  }
}

async function createSocialBlock() {
  const content = [
    { id: '1', platform: 'instagram', title: 'Instagram', url: 'https://instagram.com', icon: 'Instagram' },
    { id: '2', platform: 'youtube', title: 'YouTube', url: 'https://youtube.com', icon: 'Youtube' }
  ];
  await handleAddBlock({ type: 'social_links', content });
}

async function handleUpgrade(targetPlan) {
  await authStore.upgradePlan(targetPlan);
  await bioStore.loadDashboardData();
}

function logout() {
  authStore.logout();
  router.push('/login');
}
</script>
