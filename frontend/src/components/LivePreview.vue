<template>
  <div 
    class="bio-preview-container flex-1 flex flex-col justify-between"
    :style="containerStyle"
  >
    <div class="bio-content space-y-4">
      <!-- Cabecera de Perfil -->
      <div class="text-center pt-4 pb-2">
        <div v-if="profile.avatar_url && profile.avatar_url.trim()" class="bio-avatar-wrapper">
          <div class="bio-avatar-ring">
            <img 
              :src="resolveImageUrl(profile.avatar_url)" 
              alt="Avatar"
              class="bio-avatar"
            />
          </div>
        </div>
        <h2 v-if="profile.display_name && profile.display_name.trim()" class="text-lg font-bold tracking-tight" :style="{ color: design.text_color }">
          {{ profile.display_name }}
        </h2>
        <p v-if="profile.bio_text && profile.bio_text.trim()" class="text-xs opacity-80 mt-1 max-w-[240px] mx-auto leading-relaxed" :style="{ color: design.text_color }">
          {{ profile.bio_text }}
        </p>
      </div>

      <!-- Renderizado Dinámico de Bloques -->
      <div v-for="block in blocks" :key="block.id" class="block-item">
        <!-- Bloque Enlace Destacado / Novedad (Tarjeta Glassmorphic) -->
        <div 
          v-if="block.type === 'featured_card' || block.type === 'song_info'"
          class="glass-card p-3.5 rounded-2xl border border-white/10 text-center space-y-2.5 relative overflow-hidden"
        >
          <div class="flex items-center justify-between mb-1">
            <span class="featured-badge">
              ⚡ DESTACADO
            </span>
          </div>

          <img 
            v-if="block.content.coverUrl && block.content.coverUrl.trim()" 
            :src="resolveImageUrl(block.content.coverUrl)" 
            alt="Portada" 
            class="bio-card-cover"
          />

          <div 
            v-if="(block.content.title && block.content.title.trim()) || (block.content.subtitle && block.content.subtitle.trim()) || (block.content.description && block.content.description.trim())" 
            class="space-y-1"
          >
            <h4 v-if="block.content.title && block.content.title.trim()" class="text-sm font-bold tracking-tight" :style="{ color: design.text_color }">
              {{ block.content.title }}
            </h4>
            <p v-if="block.content.subtitle && block.content.subtitle.trim()" class="text-[11px] opacity-75 font-medium" :style="{ color: design.text_color }">
              {{ block.content.subtitle }}
            </p>
            <p v-if="block.content.description && block.content.description.trim()" class="text-[10.5px] opacity-70 mt-1 leading-snug" :style="{ color: design.text_color }">
              {{ block.content.description }}
            </p>
          </div>

          <!-- Reproductor de Adelanto Audio 15s -->
          <BioAudioPlayer 
            v-if="block.content.audioUrl && block.content.audioUrl.trim()" 
            :src="block.content.audioUrl" 
            :max-seconds="15"
          />

          <!-- Botón Principal (Solo se renderiza si actionText NO está vacío) -->
          <a 
            v-if="block.content.actionText && block.content.actionText.trim()" 
            :href="block.content.actionUrl || '#'" 
            target="_blank"
            class="custom-btn w-full block text-center py-2.5 px-4 text-xs font-bold transition-all"
            :style="buttonStyle"
          >
            {{ block.content.actionText }}
          </a>
        </div>

        <!-- Bloque Redes Sociales -->
        <div 
          v-else-if="block.type === 'social_links' && Array.isArray(block.content)"
          class="grid grid-cols-2 gap-2"
        >
          <a 
            v-for="card in block.content" 
            :key="card.id || card.title"
            :href="card.url || '#'" 
            target="_blank"
            class="social-card flex items-center gap-2.5 p-2.5 rounded-xl border border-white/10 transition-all"
            :style="buttonStyle"
          >
            <SocialIcon :name="card.icon || card.platform" size="20" class="shrink-0" />
            <span v-if="card.title && card.title.trim()" class="text-xs font-semibold truncate">{{ card.title }}</span>
          </a>
        </div>

        <!-- Bloque Párrafo de Texto -->
        <div 
          v-else-if="block.type === 'text' && block.content && block.content.text && block.content.text.trim()"
          class="p-3.5 rounded-xl border border-white/10 text-xs leading-relaxed text-center glass-card"
          :style="{ color: design.text_color }"
        >
          {{ block.content.text }}
        </div>

        <!-- Bloque Imagen -->
        <div 
          v-else-if="block.type === 'image' && block.content && block.content.imageUrl && block.content.imageUrl.trim()"
          class="rounded-xl overflow-hidden border border-white/10 glass-card p-1"
        >
          <img :src="resolveImageUrl(block.content.imageUrl)" alt="Imagen" class="bio-block-image" />
          <p v-if="block.content.caption && block.content.caption.trim()" class="text-[10px] text-center py-1.5 opacity-75 font-medium" :style="{ color: design.text_color }">
            {{ block.content.caption }}
          </p>
        </div>
      </div>
    </div>

    <!-- Pie de página / Branding BioAR (Corregido espacio y gradiente) -->
    <div v-if="design.show_branding" class="text-center py-3 mt-4 border-t border-white/10">
      <a href="#" target="_blank" class="inline-flex items-center gap-1.5 text-xs font-semibold opacity-80 hover:opacity-100 transition-opacity" :style="{ color: design.text_color }">
        <span>⚡ Creado con </span>
        <span class="brand-logo-text text-xs">Bio<span class="brand-logo-accent">AR</span></span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { resolveImageUrl } from '../services/api';
import SocialIcon from './SocialIcon.vue';
import BioAudioPlayer from './BioAudioPlayer.vue';

const props = defineProps({
  profile: {
    type: Object,
    default: () => ({ display_name: '', avatar_url: '', bio_text: '' })
  },
  design: {
    type: Object,
    default: () => ({
      background_color: '#09090b',
      text_color: '#ffffff',
      button_style: 'rounded',
      button_color: '#18181b',
      button_text_color: '#ffffff',
      font_family: 'Inter',
      show_branding: true
    })
  },
  blocks: {
    type: Array,
    default: () => []
  }
});

const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80';

const containerStyle = computed(() => ({
  backgroundColor: props.design.background_color || '#09090b',
  fontFamily: props.design.font_family || 'Inter',
  color: props.design.text_color || '#ffffff'
}));

const buttonStyle = computed(() => {
  const style = {
    backgroundColor: props.design.button_color || '#18181b',
    color: props.design.button_text_color || '#ffffff'
  };

  const bType = props.design.button_style || 'rounded';

  if (bType === 'pill') {
    style.borderRadius = '9999px';
  } else if (bType === 'shadow') {
    style.borderRadius = '14px';
    style.boxShadow = `0 6px 22px ${props.design.button_color || '#3b82f6'}66`;
  } else if (bType === 'glass') {
    style.borderRadius = '14px';
    style.backgroundColor = 'rgba(255, 255, 255, 0.14)';
    style.backdropFilter = 'blur(12px)';
    style.border = '1px solid rgba(255, 255, 255, 0.25)';
  } else {
    style.borderRadius = '10px';
  }

  return style;
});
</script>
