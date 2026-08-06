<script setup>
  import backgroundBanner from '@/assets/images/background-banner.jpg'
  import { OhVueIcon, addIcons } from "oh-vue-icons";
  import { FaRegularEye, FaRegularEyeSlash } from "oh-vue-icons/icons";
  import { reactive, watch, ref } from "vue";
  import api from "@/services/api";

  const showPassword = ref(false);
  const loading = ref(false);

  const form = reactive({
    name: "",
    email: "",
    password: "",
  });

  const errors = reactive({
    name: "",
    email: "",
    password: "",
    general: "",
  });

  const validate = () => {
    errors.name = "";
    errors.email = "";
    errors.password = "";
    errors.general = "";

    let valid = true;

    if (!form.name.trim()) {
      errors.name = "Name is required.";
      valid = false;
    }

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

  const signup = async () => {
    if (!validate()) return;
  
    loading.value = true;
    
    try {
      // Send raw JS object instead of reactive proxy
      const response = await api.post("auth/signup", { ...form });

      alert("Registration successful!");
      
      // Reset form on success
      form.name = "";
      form.email = "";
      form.password = "";

    } catch (err) {
      if (err.response?.status === 422) {
        // Laravel / Express validation errors
        const apiErrors = err.response.data.errors;

        if (apiErrors) {
          Object.keys(apiErrors).forEach(key => {
            errors[key] = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : apiErrors[key];
          });
        } else {
          errors.general = err.response.data.message || "Validation error occurred.";
        }
      } else if (err.code === "ERR_NETWORK") {
        errors.general = "Cannot connect to server. Check if backend on port 5000 is running and CORS is enabled.";
      } else {
        errors.general = err.response?.data?.message || "Something went wrong. Please try again.";
      }

    } finally {
      loading.value = false;
    }
  };

  // Clear field errors on typing
  watch(() => form.name, () => errors.name = "");
  watch(() => form.email, () => errors.email = "");
  watch(() => form.password, () => errors.password = "");

  const passwordVisibility = () => {
    showPassword.value = !showPassword.value;
  };

  addIcons(FaRegularEye, FaRegularEyeSlash);
</script>


<template>
  <section class="signup__main">
    <div class="container height__100">
      <div class="signup__main--content">
        <div class="signup__main--content__inner">
          <div class="signup__main--content__inner--left">
            <div class="signup__main--content__heading">
              <h1 class="font__weight--400 font__black">Sign Up</h1>
            </div>
            <div class="signup__main--content__inner--left__form">
              <div class="signup__main--content__inner--left__fields">
                <form @submit.prevent="signup" autocomplete="off">
                  <div class="signup__main--content__inner--left__field--wrapper">
                    <input
                      v-model="form.name"
                      type="text"
                      autocomplete="new-password"
                      placeholder="Enter your full name"
                      class="signup__main--content__inner--left__field--input font__weight--400"
                    />
                    <small v-if="errors.name" class="error">
                      {{ errors.name }}
                    </small>
                  </div>
                  <div class="signup__main--content__inner--left__field--wrapper">
                    <input
                      v-model="form.email"
                      type="text"
                      autocomplete="off"
                      placeholder="Enter your email"
                      class="signup__main--content__inner--left__field--input font__weight--400"
                    />
                    <small v-if="errors.email" class="error">
                      {{ errors.email }}
                    </small>
                  </div>
                  <div class="signup__main--content__inner--left__field--wrapper">
                    <div class="position__relative">
                      <input
                        v-model="form.password"
                        :type="showPassword ? 'text' : 'password'"
                        autocomplete="new-password"
                        placeholder="Enter your password"
                        class="signup__main--content__inner--left__field--input font__weight--400"
                      />
                      <button
                        class="signup__main--content__inner--left__field--wrapper__button"
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
                  <div class="signup__main--content__inner--left__links">
                    <button
                      type="submit"
                      class="bg__blue font__white font__weight--400"
                      :disabled="loading"
                    >
                      {{ loading ? "Loading..." : "Sign Up" }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div
            class="signup__main--content__inner--right"
            :style="{ backgroundImage: `url(${backgroundBanner})` }"
          >
            <div class="signup__main--content__wrap">
              <div class="signup__main--content__heading">
                <h1 class="font__weight--400 font__white">Hey There!</h1>
              </div>
              <div class="signup__main--content__inner--right__desc">
                <p class="font__white">Already have an account? <router-link class="font__white font__weight--600 bg__none text__decoration--none" to="/login">Sign In.</router-link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>  
</template>

<style lang="scss" src="./SignUp.scss" scoped />
