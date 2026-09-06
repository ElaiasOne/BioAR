<template>
  <div class="glass-panel p-4 mb-4">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <Share2Icon class="w-5 h-5 text-emerald-400" />
        <h3 class="text-lg font-bold text-white">Bloque: Redes Sociales</h3>
      </div>
      <button v-if="blockId" @click="$emit('delete', blockId)" class="btn-danger text-xs">
        Eliminar Bloque
      </button>
    </div>

    <div class="space-y-3 mb-4">
      <div 
        v-for="(card, index) in cards" 
        :key="card.id || index"
        class="bg-slate-900/80 p-3 rounded-lg border border-slate-700 space-y-2 relative"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <SocialIcon :name="card.icon || card.platform" size="18" />
            <span class="text-xs font-bold text-slate-300 uppercase tracking-wider">Tarjeta #{{ index + 1 }}</span>
          </div>
          <button @click="removeCard(index)" class="text-red-400 hover:text-red-300 text-xs font-semibold">
            Quitar
          </button>
        </div>

        <div class="grid grid-cols-3 gap-2">
          <div>
            <label class="block text-xs text-gray-400">Plataforma / Icono</label>
            <select v-model="card.icon" @change="emitChange" class="glass-input text-xs">
              <option value="Spotify">Spotify</option>
              <option value="Instagram">Instagram</option>
              <option value="Youtube">YouTube</option>
              <option value="TikTok">TikTok</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Facebook">Facebook</option>
              <option value="Twitter">Twitter / X</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Twitch">Twitch</option>
              <option value="Mail">Email</option>
              <option value="Globe">Sitio Web</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-gray-400">Texto Visible</label>
            <input v-model="card.title" @input="emitChange" type="text" placeholder="Ej: Instagram" class="glass-input text-xs" />
          </div>
          <div>
            <label class="block text-xs text-gray-400">URL Destino</label>
            <input v-model="card.url" @input="emitChange" type="text" placeholder="https://..." class="glass-input text-xs" />
          </div>
        </div>
      </div>
    </div>

    <button @click="addCard" class="btn-secondary w-full justify-center text-xs">
      + Agregar Tarjeta Social
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Share2 as Share2Icon } from 'lucide-vue-next';
import SocialIcon from './SocialIcon.vue';

const props = defineProps({
  blockId: [Number, String],
  initialContent: {
    type: Array,
    default: () => [
      { id: '1', platform: 'instagram', title: 'Instagram', url: 'https://instagram.com', icon: 'Instagram' },
      { id: '2', platform: 'youtube', title: 'YouTube', url: 'https://youtube.com', icon: 'Youtube' }
    ]
  }
});

const emit = defineEmits(['update', 'delete']);

const cards = ref([...props.initialContent]);

watch(() => props.initialContent, (newVal) => {
  cards.value = [...newVal];
}, { deep: true });

function addCard() {
  cards.value.push({
    id: String(Date.now()),
    platform: 'web',
    title: 'Mi Web',
    url: 'https://',
    icon: 'Globe'
  });
  emitChange();
}

function removeCard(index) {
  cards.value.splice(index, 1);
  emitChange();
}

let timeout = null;
function emitChange() {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    emit('update', { id: props.blockId, content: [...cards.value] });
  }, 300);
}
</script>
