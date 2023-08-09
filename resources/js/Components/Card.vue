<script setup>
    import { computed } from 'vue';
</script>

<template>
    <div class="p-6 bg-white dark:bg-gray-800/80 dark:bg-gradient-to-bl from-gray-700/50 via-transparent dark:ring-1 dark:ring-inset dark:ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 dark:shadow-none flex">
        <slot />
    </div>
</template>
