import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Imports',
        component: () => import('../views/Imports.vue')
    },
    {
        path: '/entities',
        name: 'Entities',
        component: () => import('../views/Entities.vue')
    },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
