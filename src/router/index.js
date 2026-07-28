import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import AllMovies from '@/views/AllMovies.vue'
import MovieDetails from '@/views/MovieDetails.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/all-movies',
    name: 'AllMovies',
    component: AllMovies
  },
  {
    path: "/movie/:id/:slug",
    name: "MovieDetails",
    component: MovieDetails
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router