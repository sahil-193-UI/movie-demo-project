<script setup>
  import { truncateText, createSlug } from '@/utils/commonFuntions';
  import HeroSection from '@/components/HeroSection/HeroSection.vue'
  import placeholderImage from '@/assets/images/movie-poster-placeholder.png'
  import CardPlaceholder from '@/components/Placeholders/CardPlaceholder/CardPlaceholder.vue'
  import { ref, computed, onMounted } from 'vue'
  import axios from 'axios'

  const allMovies = ref([])
  const loading = ref(true);

  const fetchallMovies = async () => {
    try {
      const response = await axios.get(
        'https://fooapi.com/api/movies'
      )
      const movies = response.data.data
      allMovies.value = movies     
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false;
    }
  }

  const handleImageError = (event) => {
    event.target.src = placeholderImage
  }

  onMounted(fetchallMovies)
</script>

<template>
  <HeroSection />
  <section class="latest__main">
    <div class="container">
      <div class="latest__main--wrap">
        <div class="latest__main--wrap__title">
          <h2 class="font__weight--700 font__blue">All Movies</h2>
        </div>
        <!-- Loader -->
        <template v-if="loading">
          <CardPlaceholder 
            :item-number="4"
          />
        </template>
        <div class="latest__main--wrap__items">
          <div 
            class="latest__main--wrap__item"
            v-for="movie in allMovies"
            :key="movie.id"
          >
            <div class="latest__main--wrap__item--img">
              <img 
                :alt="movie.title"
                :src="movie.poster || placeholderImage"
                @error="handleImageError"
              />
            </div>
            <div class="latest__main--wrap__item--details">
              <div class="latest__main--wrap__item--left">
                <h5 class="font__weight--600">{{ truncateText(movie.title, 10) }}</h5>
              </div>
              <div class="latest__main--wrap__item--right">
                <h5>{{ movie.released }}</h5>
              </div>
            </div>
            <div class="latest__main--wrap__item--desc">
              <p>{{ truncateText(movie.plot, 50) }}</p>
            </div>
            <div class="latest__main--wrap__item--fullview">
              <router-link 
                class="font__blue font__weight--500 text__decoration--none"
                :to="`/movie/${movie.id}/${createSlug(movie.title)}`"
              >
                View Details
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>  
</template>
