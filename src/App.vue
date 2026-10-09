<script setup>
  import { useRoute } from 'vue-router'
  import Header from '@/components/Header/Header.vue'
  import SideBar from '@/components/SideBar/SideBar.vue'
  import { computed, ref } from 'vue'

  const route = useRoute()
  const isSidebarOpen = ref(false)
  const authRouteNames = new Set(['Login', 'SignUp', 'ForgotPassword', 'ResetPassword'])
  const isAuthRoute = computed(() => authRouteNames.has(route.name))
</script>

<template>
  <template v-if="isAuthRoute">
    <main>
      <router-view />
    </main>
  </template>

  <template v-else>
    <div class="app__wrap">
      <Header
        v-model:isOpen="isSidebarOpen"
      />
      <SideBar
        v-model:isOpen="isSidebarOpen"
      />
      <main class="app__main">
        <router-view />
      </main>
    </div>
  </template>
</template>
