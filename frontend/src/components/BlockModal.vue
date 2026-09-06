<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content glass-panel p-5 max-w-md w-full">
      <div class="flex items-center justify-between mb-4 pb-2 border-b border-slate-700">
        <h3 class="text-base font-bold text-white flex items-center gap-2">
          <PlusCircleIcon class="w-5 h-5 text-blue-400" />
          Agregar Nuevo Bloque
        </h3>
        <button @click="$emit('close')" class="text-slate-400 hover:text-white font-bold">
          ✕
        </button>
      </div>

      <div class="grid grid-cols-2 gap-3 mb-4">
        <!-- Enlace Destacado / Novedad -->
        <button 
          @click="selectType('featured_card')"
          class="block-option-btn"
        >
          <SparklesIcon class="w-6 h-6 text-purple-400 mb-1" />
          <span class="block-option-title">Enlace Destacado</span>
          <span class="block-option-desc">Portada, título y botón de acción</span>
        </button>

        <!-- Redes Sociales -->
        <button 
          @click="selectType('social_links')"
          class="block-option-btn"
        >
          <Share2Icon class="w-6 h-6 text-emerald-400 mb-1" />
          <span class="block-option-title">Redes Sociales</span>
          <span class="block-option-desc">Grid con accesos a tus redes</span>
        </button>

        <!-- Texto Libre -->
        <button 
          @click="selectType('text')"
          class="block-option-btn"
        >
          <FileTextIcon class="w-6 h-6 text-blue-400 mb-1" />
          <span class="block-option-title">Párrafo de Texto</span>
          <span class="block-option-desc">Mensajes, avisos o descripciones</span>
        </button>

        <!-- Imagen Destacada -->
        <button 
          @click="selectType('image')"
          class="block-option-btn"
        >
          <ImageIcon class="w-6 h-6 text-amber-400 mb-1" />
          <span class="block-option-title">Imagen / Banner</span>
          <span class="block-option-desc">Fotos de producto o promocionales</span>
        </button>
      </div>

      <button @click="$emit('close')" class="btn-secondary w-full justify-center text-xs">
        Cancelar
      </button>
    </div>
  </div>
</template>

<script setup>
import { 
  PlusCircle as PlusCircleIcon, 
  Sparkles as SparklesIcon, 
  Share2 as Share2Icon, 
  FileText as FileTextIcon, 
  Image as ImageIcon 
} from 'lucide-vue-next';

defineProps({
  isOpen: { type: Boolean, default: false }
});

const emit = defineEmits(['close', 'add']);

function selectType(type) {
  let content = {};
  if (type === 'featured_card' || type === 'song_info') {
    content = {
      title: 'Proyecto Destacado',
      subtitle: 'Novedades 2026',
      coverUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
      description: 'Haz clic para acceder al contenido principal.',
      actionUrl: 'https://bioar.me',
      actionText: 'Ver Más Información'
    };
  } else if (type === 'social_links') {
    content = [
      { id: '1', platform: 'instagram', title: 'Instagram', url: 'https://instagram.com', icon: 'Instagram' },
      { id: '2', platform: 'youtube', title: 'YouTube', url: 'https://youtube.com', icon: 'Youtube' }
    ];
  } else if (type === 'text') {
    content = { text: '¡Bienvenido a mi página oficial de BioAR!' };
  } else if (type === 'image') {
    content = { imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', caption: 'Imagen promocional' };
  }

  emit('add', { type, content });
  emit('close');
}
</script>
