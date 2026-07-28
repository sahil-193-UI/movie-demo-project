<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRoute } from "vue-router";
  import axios from 'axios'
  
  const route = useRoute();
  const movieDetails = ref([])
  const data = ref({});

  onMounted(async () => {
    const id = route.params.id;
    try {
      const response = await axios.get(
        'https://jsonfakery.com/movies/infinite-scroll'
      )
      const details = response.data.data      
      movieDetails.value = details
      const newArray = details.filter((element, index, array) => {
        if(id == element.movie_id){
          data.value = element;
        }     
      });
    } catch (error) {
      console.error(error)
    }
  });  
</script>

<template v-if="data">
  <section
    class="banner__main"
    :style="{
      backgroundImage: `url(${data.backdrop_path})`
    }"
  >
    <div class="container height__100">
      <div class="banner__main--wrap">
        <div class="banner__main--wrap__title">
          <h2 class="font__weight--700 font__blue">
            {{ data.original_title }}
          </h2>
        </div>
      </div>
    </div>
  </section>
  <section class="details__main">
    <div class="container">
      <table class="table__main">
        <tbody>
          <tr>
            <td>ID</td>
            <td>{{ data.movie_id }}</td>
          </tr>
          <tr>
            <td>Language</td>
            <td>{{ data.original_language }}</td>
          </tr>
          <tr>
            <td>Popularity</td>
            <td>{{ data.popularity }}</td>
          </tr>
          <tr>
            <td>Released On</td>
            <td>{{ data.release_date }}</td>
          </tr>
          <tr>
            <td>Updated On</td>
            <td>{{ data?.updated_at ?? '-' }}</td>
          </tr>
          <tr>
            <td>Votes</td>
            <td>{{ data.vote_average }}</td>
          </tr>
          <tr>
            <td>Vote Count</td>
            <td>{{ data.vote_count }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>