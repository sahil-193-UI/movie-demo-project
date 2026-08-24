import { createRouter, createWebHistory } from 'vue-router'
import { getAuthState, getAuthToken } from '@/utils/cookies'
import Home from '@/views/Home.vue'
import AllMovies from '@/views/AllMovies.vue'
import MovieDetails from '@/views/MovieDetails.vue'
import Login from '@/views/Login.vue'
import SignUp from '@/views/SignUp.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'
import ResetPassword from '@/views/ResetPassword.vue'
import Error from '@/views/Error.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Home',
      requiresAuth: true
    }
  },
  {
    path: '/all-movies',
    name: 'AllMovies',
    component: AllMovies,
    meta: {
      title: 'Movies'
    }
  },
  {
    path: '/movie/:id/:slug',
    name: 'MovieDetails',
    component: MovieDetails,
    meta: {
      title: 'Details'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Login'
    }
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: SignUp,
    meta: {
      title: 'Signup'
    }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: {
      title: 'Forgot Password'
    }
  },
  {
    path: '/reset-password/:token?',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: {
      title: 'Reset Password'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Error',
    component: Error,
    meta: {
      title: '404'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = Boolean(getAuthToken()) || Boolean(getAuthState())

  if (to.name === 'Login' && isAuthenticated) {
    next({ name: 'Home' })
    return
  }

  const requiresAuth = to.matched.some((record) => record.meta?.requiresAuth)

  if (!requiresAuth) {
    next()
    return
  }

  if (!isAuthenticated) {
    next({ name: 'Login' })
    return
  }

  next()
})

router.afterEach((to) => {
  document.title = to.meta.title || 'My App'
})

export default router