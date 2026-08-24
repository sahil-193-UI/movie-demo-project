<script setup>
  import backgroundBanner from '@/assets/images/background-banner.jpg'
  import { reactive, ref } from "vue";
  import api from "@/services/api";
  import { useRouter } from "vue-router";

  const message = ref("");
  const router = useRouter();

  const form = reactive({
    email: "",
  });

  const errors = reactive({
    email: "",
    general: "",
  });

  const loading = ref(false);

  const validate = () => {
    errors.email = "";
    errors.general = "";

    let valid = true;

    if (!form.email.trim()) {
      errors.email = "Email is required.";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Enter a valid email.";
      valid = false;
    }

    return valid;
  };

  const submitForgotPassword = async () => {
    if (!validate()) return;

    loading.value = true;
    errors.email = "";
    errors.general = "";
    message.value = "";

    try {
      const endpoints = [
        "/auth/forgot-password",
        "/auth/request-password-reset",
        "/auth/send-reset-link",
        "/auth/reset-password"
      ];

      let lastError = null;
      let response = null;

      for (const endpoint of endpoints) {
        try {
          response = await api.post(endpoint, { email: form.email.trim() });
          break;
        } catch (error) {
          lastError = error;
          if (error.response?.status !== 404) {
            throw error;
          }
        }
      }

      if (!response) {
        throw lastError;
      }

      const successMessage =
        response?.data?.message ||
        response?.data?.data?.message ||
        "Password reset instructions have been sent to your email.";

      message.value = successMessage;
      form.email = "";

      setTimeout(() => {
        router.push({ name: "Login" });
      }, 1200);
    } catch (error) {
      const status = error.response?.status;
      const apiMessage = error.response?.data?.message || error.response?.data?.error || "";

      if (status === 404) {
        errors.general = "Password reset endpoint is not available. Please contact support.";
      } else if (status === 400 || /not.*registered|user.*not.*found|email.*not.*exist/i.test(apiMessage)) {
        errors.email = "No account found for this email.";
      } else {
        errors.general = apiMessage || "Unable to send the reset email. Please try again.";
      }
    } finally {
      loading.value = false;
    }
  };
</script>

<template>
  <section class="forgot__main">
    <div class="container height__100">
      <div class="forgot__main--content">
        <div class="forgot__main--content__inner">
          <div class="forgot__main--content__inner--left">
            <div class="forgot__main--content__heading">
              <h1 class="font__weight--400 font__black">Forgot Password?</h1>
            </div>
            <div class="forgot__main--content__inner--left__form">
              <div class="forgot__main--content__inner--left__fields">
                <form @submit.prevent="submitForgotPassword" autocomplete="off">
                  <div v-if="errors.general" class="error error-banner">
                    {{ errors.general }}
                  </div>
                  <div v-if="message" class="success success-banner">
                    {{ message }}
                  </div>
                  <div class="forgot__main--content__inner--left__field--wrapper">
                    <input
                      v-model="form.email"
                      type="email"
                      id="email"
                      @input="errors.email = ''"
                      autocomplete="new-password"
                      placeholder="Enter your email"
                      class="forgot__main--content__inner--left__field--input font__weight--400"
                    />
                    <small v-if="errors.email" class="error">
                      {{ errors.email }}
                    </small>
                  </div>

                  <div class="forgot__main--content__inner--left__links">
                    <button
                      type="submit"
                      :disabled="loading"
                      class="bg__blue font__white font__weight--400"
                    >
                      {{ loading ? "Loading..." : "Send Email" }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div
            class="forgot__main--content__inner--right"
            :style="{ backgroundImage: `url(${backgroundBanner})` }"
          >
            <div class="forgot__main--content__wrap">
              <div class="forgot__main--content__heading">
                <h1 class="font__weight--400 font__white">Hey There!</h1>
              </div>
              <div class="forgot__main--content__inner--right__desc">
                <p class="font__white">Create your account now and step into an amazing new journey.</p>
              </div>
              <div class="forgot__main--content__inner--right__button">
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

<style lang="scss" src="./ForgotPassword.scss" scoped />
