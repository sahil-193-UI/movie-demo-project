import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import AllMovies from '@/views/AllMovies.vue'
import MovieDetails from '@/views/MovieDetails.vue'
import Login from '@/views/Login.vue'
import SignUp from '@/views/SignUp.vue'
import Error from '@/views/Error.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true 
    }
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
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/sign-up",
    name: "SignUp",
    component: SignUp
  },
  {
    path: "/:pathMatch(.*)*",
    name: "Error",
    component: Error
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // Replace this check with your actual auth status (localStorage, Cookie, Pinia store, etc.)
  const isAuthenticated = Boolean(localStorage.getItem('token'))
  const publicPages = ['/login', '/sign-up']
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !isAuthenticated) {
    // Redirect unauthenticated user to login page
    next({ name: 'Login' })
  } else if (!authRequired && isAuthenticated) {
    // Optional: Keep logged-in users from visiting login page
    next({ name: 'Home' })
  } else {
    // Proceed normally
    next()
  }
})

export default router