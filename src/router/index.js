import { createRouter, createWebHistory } from 'vue-router'
import api from '@/services/api'
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

router.beforeEach(async (to, from, next) => {
  const publicPages = ['/login', '/sign-up']
  const authRequired = !publicPages.includes(to.path)

  if (!authRequired) {
    try {
      await api.get('/auth/me')
      next({ name: 'Home' })
    } catch {
      next()
    }
    return
  }

  try {
    await api.get('/auth/me')
    next()
  } catch {
    next({ name: 'Login' })
  }
})

export default router