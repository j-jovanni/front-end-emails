import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'

import RouteViewComponent from '../layouts/RouterBypass.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'dashboard' },
  },
  {
    name: 'admin',
    path: '/',
    component: AppLayout,
    redirect: { name: 'crete_template' },
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import(''),
      },
      {
        name: 'send_email',
        path: 'send_email',
        component: () => import('../pages/views/SendEmail.vue'),
      },
      {
        name: 'send_email_step_2',
        path: 'send_email_step_2',
        component: () => import('../pages/views/SendEmailStep2.vue'),
        props: (route) => ({ template: route.query.template }),
      },
      {
        name: 'crete_recipients',
        path: 'crete_recipients',
        component: () => import('../pages/views/Recipients.vue'),
        props: (route) => ({ template: route.query.template }),
      },
      {
        name: 'crete_template',
        path: 'crete_template',
        component: () => import('../pages/views/Templates.vue'),
        props: (route) => ({ template: route.query.template }),
      },
      {
        name: 'settings',
        path: 'settings',
        component: () => import('../pages/settings/Settings.vue'),
      },

      {
        name: 'preferences',
        path: 'preferences',
        component: () => import(''),
      },
      {
        name: 'users',
        path: 'users',
        component: () => import('../pages/users/UsersPage.vue'),
      },
      {
        name: 'projects',
        path: 'projects',
        component: () => import(''),
      },

      {
        name: 'faq',
        path: '/faq',
        component: () => import(''),
      },
    ],
  },

  {
    name: '404',
    path: '/404',
    component: () => import('../pages/404.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // For some reason using documentation example doesn't scroll on page navigation.
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      window.scrollTo(0, 0)
    }
  },
  routes,
})

export default router
