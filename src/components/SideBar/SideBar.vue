<script setup>
  import { useRouter } from "vue-router";
  import { ref, onMounted } from "vue";
  import api from "@/services/api";
  import { clearAuthToken, getAuthToken } from "@/utils/cookies";
  import { OhVueIcon, addIcons } from "oh-vue-icons";
  import { IoClose, LaInstagram, CoFacebookF, RiUser3Fill, CoTwitter } from "oh-vue-icons/icons";

  addIcons(RiUser3Fill, CoFacebookF, LaInstagram, CoTwitter, IoClose);
  
  const props = defineProps({
    isOpen: Boolean
  });

  const emit = defineEmits(["update:isOpen"]);

  const router = useRouter();
  const userDetails = ref(null)

  const fetchUserProfile = async () => {
    const token = getAuthToken();
    console.log('getAuthToken:', token);

    try {
      const response = await api.get('/auth/me');
      console.log('/auth/me response:', response);
      const details = response.data;
      userDetails.value = details;
    } catch (error) {
      console.error('/auth/me error:', error?.response || error);
      if (error?.response?.status === 401) {
        // backend indicates unauthorized — clear local token
        clearAuthToken();
      }
    }
  }

  onMounted(async () => {
    await fetchUserProfile();
  });

  const handleLogout = async () => {
    try {
    } catch (error) {
      console.error('Error during backend logout:', error);
    } finally {
      clearAuthToken();
      router.push('/login');
    }
  };

  const closeSidebar = () => {
    emit("update:isOpen", false);
  };
</script>

<template v-if="isOpen">
  <aside class="sidebar__main" :class="{ 'active': isOpen }">
    <button class="sidebar__main--close" @click.stop="closeSidebar">
      <OhVueIcon name="io-close" scale="1.5" />
    </button>
    <div class="sidebar__main--wrap">
      <div class="sidebar__main--head">
        <div class="sidebar__main--head__wrap">
          <div class="sidebar__main--head__wrap--img">
            <OhVueIcon name="ri-user-3-fill" fill="#292870" scale="2" />
          </div>
          <div class="sidebar__main--head__wrap--details">
            <h3>{{ userDetails?.name }}</h3>
            <p>{{ userDetails?.email }}</p>
          </div>
        </div>
      </div>
      <div class="sidebar__main--body">
        <ul type="none">
          <li>
            <router-link to="#">Dashboard</router-link>
          </li>
          <li>
            <router-link to="#">Profile</router-link>
          </li>
          <li>
            <router-link to="#">Settings</router-link>
          </li>
          <li>
            <button @click="handleLogout" class="font__blue">Logout</button>
          </li>
        </ul>
      </div>
      <div class="sidebar__main--foot">
        <ul type="none">
          <li>
            <a href="https://www.facebook.com/" target="_blank">
              <OhVueIcon name="co-facebook-f" />
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/?hl=en" target="_blank">
              <OhVueIcon name="la-instagram" />
            </a>
          </li>
          <li>
            <a href="https://x.com/" target="_blank">
              <OhVueIcon name="co-twitter" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>

<style lang="scss" src="./SideBar.scss" scoped />  
