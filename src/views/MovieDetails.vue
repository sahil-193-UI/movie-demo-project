  <script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useRoute } from "vue-router";
    import axios from 'axios'
    import { createSlug } from '@/utils/commonFuntions'
    
    const route = useRoute();
    const movieDetails = ref({})
    const fetchMovieDetails = async () => {
      const response = await axios.get(
        `https://fooapi.com/api/movies/${route.params.id}`
      );

      movieDetails.value = response.data.data;
      const correctSlug = createSlug(movieDetails.value.title);
      if (route.params.slug !== correctSlug) {
        router.replace(`/movie/${route.params.id}/${correctSlug}`);
      }
    };

    onMounted(fetchMovieDetails)
  </script>

  <template>
    <section
      class="banner__main"
      :style="{
        backgroundImage: `url(${movieDetails.poster})`,
      }"
    >
      <div class="container height__100">
        <div class="banner__main--wrap">
          <div class="banner__main--wrap__title">
            <h2 class="font__weight--700 font__blue">
              {{ movieDetails.title }}
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
              <td>{{ movieDetails.id }}</td>
            </tr>
            <tr>
              <td>Language</td>
              <td>{{ movieDetails.language }}</td>
            </tr>
            <tr>
              <td>Popularity</td>
              <td>{{ movieDetails.director }}</td>
            </tr>
            <tr>
              <td>Released On</td>
              <td>{{ movieDetails.released }}</td>
            </tr>
            <tr>
              <td>Updated On</td>
              <td>{{ movieDetails.updated_at ?? '-' }}</td>
            </tr>
            <tr>
              <td>Actors</td>
              <td>{{ movieDetails.actors ?? '-' }}</td>
            </tr>
            <tr>
              <td>Votes</td>
              <td>{{ movieDetails.awards }}</td>
            </tr>
            <tr>
              <td>Vote Count</td>
              <td>{{ movieDetails.boxOffice }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </template>