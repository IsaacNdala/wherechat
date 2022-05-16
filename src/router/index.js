import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      title: 'Home'
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: AuthView,
    meta: {
      title: 'Login'
    }
  },
  {
    path: '/messages',
    name: 'Messages',
    component: () => import('../views/MessagesView.vue'),
    meta: {
      title: 'Messages'
    },
    children: [
      {
        path: ':userId',
        name: 'MessageUserId',
        component: () => import('../components/MessageComponent.vue'),
        meta: {
          title: 'Message'
        }
      }
    ]
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfileView.vue'),
    meta: {
      title: 'Profile'
    }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/SearchView.vue'),
    meta: {
      title: 'Search'
    }
  }
]
/* eslint-disable */
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach((to, from) => {
  document.title = `${process.env.VUE_APP_TITLE} - ${to.meta.title}`
  if(!localStorage.getItem('user') && to.name !== 'Login') {
    return { name: 'Login' }
  }
  return true
})

export default router