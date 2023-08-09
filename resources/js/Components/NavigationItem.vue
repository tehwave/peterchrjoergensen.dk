<script setup>
    import { computed } from 'vue';
    import { Link } from '@inertiajs/vue3'
    import { usePage } from '@inertiajs/vue3'

    const props = defineProps({
        href: {
            type: String,
            required: true,
        },
    });

    const page = usePage();

    const isActive = computed(() => page.url === props.href)
</script>

<template>
    <li>
        <Link
            :href="href"
            class="relative block px-3 py-2 transition"
            :class="{
                'text-red-500 dark:text-red-400': isActive,
                'hover:text-red-500 dark:hover:text-red-400': ! isActive,
            }"
        >
            <slot />
        </Link>
    </li>
</template>
