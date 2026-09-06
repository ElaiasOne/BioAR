<template>
  <svg 
    :width="size" 
    :height="size" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    class="social-brand-icon"
  >
    <!-- Spotify -->
    <g v-if="normalizedName === 'spotify'">
      <circle cx="12" cy="12" r="10" fill="#1DB954"/>
      <path d="M16.8 15.6c-.2.3-.5.4-.8.2-2.3-1.4-5.2-1.7-8.6-.9-.3.1-.6-.1-.7-.4-.1-.3.1-.6.4-.7 3.7-.8 7-.5 9.5 1 .3.2.4.5.2.8zm1.2-2.5c-.2.4-.7.5-1.1.3-2.6-1.6-6.6-2.1-9.7-1.1-.4.1-.9-.1-1-.5-.1-.4.1-.9.5-1 3.5-1.1 7.9-.5 10.9 1.3.4.2.5.7.4 1zm.1-2.6c-3.1-1.9-8.3-2-11.3-1.1-.5.1-1-.2-1.1-.7-.1-.5.2-1 .7-1.1 3.5-1.1 9.2-.9 12.8 1.3.4.2.6.8.3 1.3-.2.4-.8.6-1.4.3z" fill="#FFFFFF"/>
    </g>

    <!-- Instagram -->
    <g v-else-if="normalizedName === 'instagram'">
      <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#ig-grad)"/>
      <rect x="6" y="6" width="12" height="12" rx="3.5" stroke="#FFFFFF" stroke-width="1.8"/>
      <circle cx="12" cy="12" r="3.2" stroke="#FFFFFF" stroke-width="1.8"/>
      <circle cx="16.5" cy="7.5" r="1.2" fill="#FFFFFF"/>
      <defs>
        <linearGradient id="ig-grad" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FFD600"/>
          <stop offset="25%" stop-color="#FF7A00"/>
          <stop offset="50%" stop-color="#FF0069"/>
          <stop offset="75%" stop-color="#D300C5"/>
          <stop offset="100%" stop-color="#7638FA"/>
        </linearGradient>
      </defs>
    </g>

    <!-- YouTube -->
    <g v-else-if="normalizedName === 'youtube'">
      <path d="M21.6 7.2c-.2-1-.9-1.8-1.9-2-1.7-.5-8.7-.5-8.7-.5s-7 0-8.7.5c-1 .2-1.7 1-1.9 2C0 8.9 0 12 0 12s0 3.1.4 4.8c.2 1 .9 1.8 1.9 2 1.7.5 8.7.5 8.7.5s7 0 8.7-.5c1-.2 1.7-1 1.9-2 .4-1.7.4-4.8.4-4.8s0-3.1-.4-4.8z" fill="#FF0000"/>
      <path d="M9.6 15.6l6.2-3.6-6.2-3.6v7.2z" fill="#FFFFFF"/>
    </g>

    <!-- TikTok -->
    <g v-else-if="normalizedName === 'tiktok'">
      <rect width="24" height="24" rx="5" fill="#000000"/>
      <path d="M16.6 8.2c-1.1-.8-1.8-2-1.9-3.4h-2.5v11.4c0 1.5-1.2 2.7-2.7 2.7-1.5 0-2.7-1.2-2.7-2.7 0-1.5 1.2-2.7 2.7-2.7.3 0 .6.1.9.2V11c-.3 0-.6-.1-.9-.1-3 0-5.4 2.4-5.4 5.4s2.4 5.4 5.4 5.4 5.4-2.4 5.4-5.4V9.6c1.1.8 2.5 1.3 4 1.3V8.4c-1.5-.1-2.9-.6-4-1.5z" fill="#25F4EE"/>
      <path d="M16.1 7.7c-1.1-.8-1.8-2-1.9-3.4h-2.5v11.4c0 1.5-1.2 2.7-2.7 2.7-1.5 0-2.7-1.2-2.7-2.7 0-1.5 1.2-2.7 2.7-2.7.3 0 .6.1.9.2V10.5c-.3 0-.6-.1-.9-.1-3 0-5.4 2.4-5.4 5.4s2.4 5.4 5.4 5.4 5.4-2.4 5.4-5.4V9.1c1.1.8 2.5 1.3 4 1.3V7.9c-1.5-.1-2.9-.6-4-1.5z" fill="#FE2C55"/>
      <path d="M16.3 7.9c-1.1-.8-1.8-2-1.9-3.4h-2.5v11.4c0 1.5-1.2 2.7-2.7 2.7-1.5 0-2.7-1.2-2.7-2.7 0-1.5 1.2-2.7 2.7-2.7.3 0 .6.1.9.2V10.7c-.3 0-.6-.1-.9-.1-3 0-5.4 2.4-5.4 5.4s2.4 5.4 5.4 5.4 5.4-2.4 5.4-5.4V9.3c1.1.8 2.5 1.3 4 1.3V8.1c-1.5-.1-2.9-.6-4-1.5z" fill="#FFFFFF"/>
    </g>

    <!-- WhatsApp -->
    <g v-else-if="normalizedName === 'whatsapp'">
      <circle cx="12" cy="12" r="10" fill="#25D366"/>
      <path d="M17.5 14.3c-.3-.2-1.7-.8-1.9-.9-.3-.1-.5-.2-.7.2s-.7.9-.9 1.1c-.2.2-.4.2-.7.1-.3-.1-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.7.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4-.1-.5s-.7-1.7-1-2.3c-.3-.6-.6-.5-.8-.5h-.7c-.2 0-.7.1-1.1.5-.4.4-1.4 1.4-1.4 3.4s1.5 3.9 1.7 4.2c.2.3 2.9 4.4 7 6.2 1 .4 1.8.7 2.4.9 1 .3 1.9.3 2.6.2.8-.1 2.5-1 2.8-2 .4-1 .4-1.8.3-2-.1-.2-.3-.3-.6-.5z" fill="#FFFFFF"/>
    </g>

    <!-- Facebook -->
    <g v-else-if="normalizedName === 'facebook'">
      <circle cx="12" cy="12" r="10" fill="#1877F2"/>
      <path d="M14 12.5h-1.5V18h-2.5v-5.5H8.7v-2.1h1.3V8.9c0-1.3.8-2.4 2.3-2.4h1.7v2.1h-1.2c-.6 0-.8.3-.8.7v1.1h2L14 12.5z" fill="#FFFFFF"/>
    </g>

    <!-- Twitter / X -->
    <g v-else-if="normalizedName === 'twitter' || normalizedName === 'x'">
      <rect width="24" height="24" rx="5" fill="#000000"/>
      <path d="M18.2 4h2.9l-6.4 7.3 7.5 9.9H16.3l-4.6-6-5.3 6H3.5l6.9-7.9L3.2 4h6l4.2 5.5L18.2 4zm-1 15.5h1.6L7.1 5.6H5.4l11.8 13.9z" fill="#FFFFFF"/>
    </g>

    <!-- LinkedIn -->
    <g v-else-if="normalizedName === 'linkedin'">
      <rect width="24" height="24" rx="5" fill="#0A66C2"/>
      <path d="M6.5 8.5h2.5V17.5h-2.5V8.5zM7.8 5.5c.8 0 1.4.6 1.4 1.4s-.6 1.4-1.4 1.4-1.4-.6-1.4-1.4.6-1.4 1.4-1.4zM11.5 8.5H14v1.2c.4-.7 1.2-1.4 2.5-1.4 2.7 0 3.2 1.8 3.2 4.1v5.1h-2.5v-4.5c0-1.1 0-2.5-1.5-2.5s-1.7 1.2-1.7 2.4v4.6h-2.5V8.5z" fill="#FFFFFF"/>
    </g>

    <!-- Twitch -->
    <g v-else-if="normalizedName === 'twitch'">
      <rect width="24" height="24" rx="5" fill="#9146FF"/>
      <path d="M5 4l-1 3v12h4v3l3-3h3l5-5V4H5zm13 9l-2.5 2.5H12l-2 2v-2H7.5V5.5h10.5V13z" fill="#FFFFFF"/>
      <path d="M14.5 8h1.5v4h-1.5V8zm-4 0h1.5v4H10.5V8z" fill="#FFFFFF"/>
    </g>

    <!-- Mail / Email -->
    <g v-else-if="normalizedName === 'mail' || normalizedName === 'email'">
      <circle cx="12" cy="12" r="10" fill="#EA4335"/>
      <path d="M6.5 8.5h11c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1h-11c-.6 0-1-.4-1-1v-7c0-.6.4-1 1-1zm5.5 4.5l5.5-3.5h-11l5.5 3.5zm0 1.2L6.5 10.7v5.8h11v-5.8l-5.5 3.5z" fill="#FFFFFF"/>
    </g>

    <!-- Web / Globe -->
    <g v-else>
      <circle cx="12" cy="12" r="10" fill="#6366F1"/>
      <path d="M12 4a8 8 0 100 16 8 8 0 000-16zM5.5 12a6.5 6.5 0 011.6-4.2h9.8a6.5 6.5 0 010 8.4H7.1A6.5 6.5 0 015.5 12z" stroke="#FFFFFF" stroke-width="1.2"/>
      <ellipse cx="12" cy="12" rx="3.5" ry="7" stroke="#FFFFFF" stroke-width="1.2"/>
    </g>
  </svg>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: { type: String, default: 'globe' },
  size: { type: [Number, String], default: 20 }
});

const normalizedName = computed(() => {
  if (!props.name) return 'globe';
  return props.name.toLowerCase().trim();
});
</script>
