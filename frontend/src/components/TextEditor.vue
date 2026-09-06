<template>
  <div class="glass-panel p-4 mb-4">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <FileTextIcon class="w-5 h-5 text-blue-400" />
        <h3 class="text-lg font-bold text-white">Bloque: Párrafo de Texto</h3>
      </div>
      <button v-if="blockId" @click="$emit('delete', blockId)" class="btn-danger text-xs">
        Eliminar
      </button>
    </div>

    <div>
      <label class="block text-xs font-semibold text-gray-400 mb-1">Contenido del Texto / Mensaje</label>
      <textarea 
        v-model="textContent.text" 
        @input="emitChange"
        rows="3"
        placeholder="Escribe tu mensaje, aviso o descripción aquí..."
        class="glass-input resize-none"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';
import { FileText as FileTextIcon } from 'lucide-vue-next';

const props = defineProps({
  blockId: [Number, String],
  initialContent: {
    type: Object,
    default: () => ({ text: '' })
  }
});

const emit = defineEmits(['update', 'delete']);

const textContent = reactive({ ...props.initialContent });

watch(() => props.initialContent, (newVal) => {
  Object.assign(textContent, newVal);
}, { deep: true });

let timeout = null;
function emitChange() {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    emit('update', { id: props.blockId, content: { ...textContent } });
  }, 300);
}
</script>
