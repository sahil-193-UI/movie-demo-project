<script setup>
  import CardPlaceholder from '@/components/Placeholders/CardPlaceholder/CardPlaceholder.vue'
  import { ref, computed, onMounted } from 'vue'
  import axios from 'axios'

  const latestMovies = ref([])
  const loading = ref(true);
  const fetchLatestMovies = async () => {
    try {
      const response = await axios.get(
        'https://fooapi.com/api/movies'
      )
      const movies = response.data.data
      latestMovies.value = movies
      
        .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
        .slice(0, 4)

    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false;
    }
  }

  const truncateTitle = (title) => {
    if (!title) return '';
    return title.length > 100 ? title.slice(0, 100) + '...' : title;
  };

  onMounted(fetchLatestMovies)
</script>

<template>
  <section class="latest__main">
    <div class="container">
      <div class="latest__main--wrap">
        <div class="latest__main--wrap__title">
          <h2 class="font__weight--700 font__blue">Latest Movies</h2>
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
            v-for="movie in latestMovies"
            :key="movie.id"
            :id="movie.id"
          >
            <div class="latest__main--wrap__item--img">
              <img :src="movie.poster" :alt="movie.title" />
            </div>
            <div class="latest__main--wrap__item--details">
              <div class="latest__main--wrap__item--left">
                <h5 class="font__weight--600">{{ movie.title }}</h5>
              </div>
              <div class="latest__main--wrap__item--right">
                <h5>{{ movie.released }}</h5>
              </div>
            </div>
            <div class="latest__main--wrap__item--desc">
              <p>{{ truncateTitle(movie.plot) }}</p>
            </div>
            <div class="latest__main--wrap__item--fullview">
              <router-link class="font__blue font__weight--500 text__decoration--none" :to="`/movie/${movie.id}`">View Details</router-link>
            </div>
          </div>
        </div>
        <div class="latest__main--wrap__browse">
           <router-link class="bg__blue font__white text__uppercase font__weight--700" to="/all-movies">View All Movies</router-link>
        </div>
      </div>
    </div>
  </section>  
</template>

<style lang="scss" src="./LatestMovie.scss" scoped />
