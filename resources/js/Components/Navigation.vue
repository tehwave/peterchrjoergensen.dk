<script setup>
    import { computed } from 'vue';
    import NavigationItem from '@/Components/NavigationItem.vue';
</script>

<template>
    <header class="relative z-50 flex flex-none flex-col">
        <div class="top-0 z-10 h-16 pt-6">
            <nav>
                <ul class="flex rounded-full bg-white/90 px-3 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
                    <NavigationItem :href="'/'">About</NavigationItem>
                    <NavigationItem :href="'/articles'">Articles</NavigationItem>
                    <NavigationItem :href="'/projects'">Projects</NavigationItem>
                </ul>
            </nav>
        </div>
    </header>
</template>
