<script setup>
  import backgroundBanner from '@/assets/images/background-banner.jpg'
  import { OhVueIcon, addIcons } from "oh-vue-icons";
  import { FaRegularEye, FaRegularEyeSlash } from "oh-vue-icons/icons";
  import { reactive, ref } from "vue";
  import api from "@/services/api";
  import { useRouter } from "vue-router";
  import { setAuthState, setAuthToken } from "@/utils/cookies";

  const showPassword = ref(false);
  const message = ref("");
  const router = useRouter();

  const form = reactive({
    email: "",
    password: "",
  });

  const errors = reactive({
    email: "",
    password: "",
    general: "",
  });

  const loading = ref(false);

  const validate = () => {
    errors.email = "";
    errors.password = "";
    errors.general = "";

    let valid = true;

    if (!form.email.trim()) {
      errors.email = "Email is required.";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Enter a valid email.";
      valid = false;
    }

    if (!form.password) {
      errors.password = "Password is required.";
      valid = false;
    } else if (form.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
      valid = false;
    }
    return valid;
  };

  const login = async () => {
    if (!validate()) return;

    loading.value = true;
    errors.email = "";
    errors.password = "";
    errors.general = "";
    message.value = "";

    try {
      const response = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      const payload = response?.data?.data ?? response?.data;
      const loginUser =
        payload?.user ||
        response?.data?.user ||
        payload?.data?.user ||
        (payload && typeof payload === 'object' && !Array.isArray(payload) ? payload : null);
      const token =
        payload?.token ||
        payload?.accessToken ||
        payload?.jwt ||
        payload?.access_token ||
        response?.data?.token ||
        response?.data?.accessToken ||
        response?.data?.jwt ||
        response?.data?.access_token ||
        response?.data?.data?.token ||
        response?.data?.data?.accessToken ||
        response?.data?.data?.jwt ||
        response?.data?.user?.token ||
        response?.data?.user?.accessToken ||
        response?.data?.user?.jwt ||
        response?.headers?.authorization ||
        response?.headers?.Authorization;

      if (token) {
        const normalizedToken = typeof token === 'string' && token.startsWith('Bearer ') ? token.slice(7) : token;
        setAuthToken(normalizedToken);
      } else if (loginUser) {
        setAuthState(true);
      }

      const isLoginSuccess =
        response?.status >= 200 &&
        response?.status < 300 &&
        (Boolean(token) || Boolean(loginUser) || payload?.success === true || /success|logged in|welcome/i.test(String(payload?.message || '')));

      if (!isLoginSuccess) {
        return;
      }

      if (isLoginSuccess) {
        router.replace({ name: 'Home' });
        // return;
      }

      if (loginUser) {
        await router.push({ name: 'Home' });
      } else {
        router.replace({ name: 'Home' });
      }
    } catch (error) {
      const status = error.response?.status;
      const apiMessage = error.response?.data?.message || error.response?.data?.error || "";

      // 1. Check explicitly if email is not found
      if (status === 400 || /email.*not.*exist|user.*not.*found|not registered/i.test(apiMessage)) {
        errors.email = "Email address does not exist.";
      } 
      // 2. Catch "Invalid credentials", wrong password, or 401 unauthorized
      else if (status === 401 || /invalid credentials|password/i.test(apiMessage)) {
        errors.password = "Incorrect password.";
      } 
      // 3. Fallback for server errors (500, network loss, etc.)
      else {
        errors.general = apiMessage || "Login failed. Please try again.";
      }
    } finally {
      loading.value = false;
    }
  };

  const passwordVisibility = () => {
    showPassword.value = !showPassword.value;
  };

  addIcons(FaRegularEye, FaRegularEyeSlash);
</script>

<template>
  <section class="login__main">
    <div class="container height__100">
      <div class="login__main--content">
        <div class="login__main--content__inner">
          <div class="login__main--content__inner--left">
            <div class="login__main--content__heading">
              <h1 class="font__weight--400 font__black">Sign In</h1>
            </div>
            <div class="login__main--content__inner--left__form">
              <div class="login__main--content__inner--left__fields">
                <form @submit.prevent="login" autocomplete="off">
                  <!-- General Error Banner -->
                  <div v-if="errors.general" class="error error-banner">
                    {{ errors.general }}
                  </div>
                  <div class="login__main--content__inner--left__field--wrapper">
                    <input
                      v-model="form.email"
                      type="email"
                      id="email"
                      @input="errors.email = ''"
                      autocomplete="new-password"
                      placeholder="Enter your email"
                      class="login__main--content__inner--left__field--input font__weight--400"
                    />
                    <small v-if="errors.email" class="error">
                      {{ errors.email }}
                    </small>
                  </div>
                  <div class="login__main--content__inner--left__field--wrapper">
                    <div class="position__relative">
                      <input
                        v-model="form.password"
                        :type="showPassword ? 'text' : 'password'"
                        autocomplete="new-password"
                        id="password"
                         @input="errors.password = ''"
                        placeholder="Enter your password"
                        class="login__main--content__inner--left__field--input font__weight--400"
                      />
                      <button
                        class="login__main--content__inner--left__field--wrapper__button"
                        @click="passwordVisibility"
                        type="button"
                      >
                        <OhVueIcon :name="showPassword ? 'fa-regular-eye-slash' : 'fa-regular-eye'" />
                      </button>
                    </div>
                    <small v-if="errors.password" class="error">
                      {{ errors.password }}
                    </small>
                  </div>
                  
                  <div class="login__main--content__inner--left__links">
                    <router-link class="font__blue font__weight--400 text__decoration--none" to="/forgot-password">
                      Forgot password?
                    </router-link>
                    <button
                      type="submit"
                      :disabled="loading"
                      class="bg__blue font__white font__weight--400"
                    >
                      {{ loading ? "Loading..." : "Login" }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div
            class="login__main--content__inner--right"
            :style="{ backgroundImage: `url(${backgroundBanner})` }"
          >
            <div class="login__main--content__wrap">
              <div class="login__main--content__heading">
                <h1 class="font__weight--400 font__white">Hey There!</h1>
              </div>
              <div class="login__main--content__inner--right__desc">
                <p class="font__white">Create your account now and step into an amazing new journey.</p>
              </div>
              <div class="login__main--content__inner--right__button">
                <router-link class="font__white font__weight--400 bg__white--outline text__decoration--none" to="/sign-up">
                  Sign Up
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>  
</template>

<style lang="scss" src="./Login.scss" scoped />
