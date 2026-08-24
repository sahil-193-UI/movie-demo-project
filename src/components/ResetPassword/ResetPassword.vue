<script setup>
  import backgroundBanner from '@/assets/images/background-banner.jpg'
  import { OhVueIcon, addIcons } from "oh-vue-icons";
  import { FaRegularEye, FaRegularEyeSlash } from "oh-vue-icons/icons";
  import { reactive, ref, onMounted } from "vue";
  import api from "@/services/api";
  import { useRouter, useRoute } from "vue-router";

  const showPassword = ref(false);
  const showConfirmPassword = ref(false);
  const message = ref("");
  const router = useRouter();
  const route = useRoute();

  const token = ref("");
  const email = ref("");

  const form = reactive({
    password: "",
    confirmPassword: "",
  });

  const errors = reactive({
    password: "",
    confirmPassword: "",
    general: "",
  });

  const loading = ref(false);

  onMounted(() => {
    // Extract token and email from query params (?token=...&email=...) or route params (:token)
    token.value = (route.query.token || route.params.token || "").toString();
    email.value = (route.query.email || "").toString();

    if (!token.value) {
      errors.general = "Invalid or missing reset token. Please request a new password reset link.";
    }
  });

  const validate = () => {
    errors.password = "";
    errors.confirmPassword = "";
    errors.general = "";

    let valid = true;

    if (!token.value) {
      errors.general = "Invalid or missing reset token. Please request a new password reset link.";
      return false;
    }

    if (!form.password) {
      errors.password = "New password is required.";
      valid = false;
    } else if (form.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
      valid = false;
    }

    if (!form.confirmPassword) {
      errors.confirmPassword = "Confirm password is required.";
      valid = false;
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
      valid = false;
    }

    return valid;
  };

  const submitResetPassword = async () => {
    if (!validate()) return;

    loading.value = true;
    errors.password = "";
    errors.confirmPassword = "";
    errors.general = "";
    message.value = "";

    try {
      const response = await api.post("/auth/reset-password", {
        token: token.value,
        email: email.value || undefined,
        password: form.password,
        newPassword: form.password,
      });

      const successMsg =
        response?.data?.message ||
        response?.data?.data?.message ||
        "Your password has been successfully reset!";

      message.value = successMsg;
      form.password = "";
      form.confirmPassword = "";

      setTimeout(() => {
        router.push({ name: "Login" });
      }, 2000);
    } catch (error) {
      const status = error.response?.status;
      const apiMessage = error.response?.data?.message || error.response?.data?.error || "";

      if (status === 400 || /token|expired|invalid/i.test(apiMessage)) {
        errors.general = apiMessage || "Reset token is invalid or has expired. Please request a new link.";
      } else {
        errors.general = apiMessage || "Failed to reset password. Please try again.";
      }
    } finally {
      loading.value = false;
    }
  };

  const passwordVisibility = () => {
    showPassword.value = !showPassword.value;
  };

  const confirmPasswordVisibility = () => {
    showConfirmPassword.value = !showConfirmPassword.value;
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
              <h1 class="font__weight--400 font__black">Reset Password</h1>
            </div>
            <div class="login__main--content__inner--left__form">
              <div class="login__main--content__inner--left__fields">
                <form @submit.prevent="submitResetPassword" autocomplete="off">
                  <!-- General Error Banner -->
                  <div v-if="errors.general" class="error error-banner">
                    {{ errors.general }}
                  </div>
                  <!-- Success Banner -->
                  <div v-if="message" class="success success-banner">
                    {{ message }}
                  </div>

                  <div class="login__main--content__inner--left__field--wrapper">
                    <div class="position__relative">
                      <input
                        v-model="form.password"
                        :type="showPassword ? 'text' : 'password'"
                        autocomplete="new-password"
                        id="password"
                        @input="errors.password = ''"
                        placeholder="Enter new password"
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

                  <div class="login__main--content__inner--left__field--wrapper">
                    <div class="position__relative">
                      <input
                        v-model="form.confirmPassword"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        autocomplete="new-password"
                        id="confirmPassword"
                        @input="errors.confirmPassword = ''"
                        placeholder="Confirm new password"
                        class="login__main--content__inner--left__field--input font__weight--400"
                      />
                      <button
                        class="login__main--content__inner--left__field--wrapper__button"
                        @click="confirmPasswordVisibility"
                        type="button"
                      >
                        <OhVueIcon :name="showConfirmPassword ? 'fa-regular-eye-slash' : 'fa-regular-eye'" />
                      </button>
                    </div>
                    <small v-if="errors.confirmPassword" class="error">
                      {{ errors.confirmPassword }}
                    </small>
                  </div>

                  <div class="login__main--content__inner--left__links">
                    <button
                      type="submit"
                      :disabled="loading || !token"
                      class="bg__blue font__white font__weight--400"
                    >
                      {{ loading ? "Submitting..." : "Reset Password" }}
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
                <h1 class="font__weight--400 font__white">Remember your password?</h1>
              </div>
              <div class="login__main--content__inner--right__desc">
                <p class="font__white">Sign in to your account to continue where you left off.</p>
              </div>
              <div class="login__main--content__inner--right__button">
                <router-link class="font__white font__weight--400 bg__white--outline text__decoration--none" to="/login">
                  Sign In
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" src="./ResetPassword.scss" scoped />
