<script setup>
    import { computed } from 'vue';
    import Card from '@/Components/Card.vue';

    const props = defineProps({
        href: {
            type: String,
            required: true,
        },
    });
</script>

<template>
    <a :href="href">
        <Card :class="'scale-100 motion-safe:hover:scale-[1.01] transition-all duration-250 focus:outline focus:outline-2 focus:outline-red-500'">
            <slot />
        </Card>
    </a>
</template>
