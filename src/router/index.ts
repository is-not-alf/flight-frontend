import { createRouter, createWebHistory } from 'vue-router'

const publicRoutes = [
  {
    path: '/',
    name: 'Flights',
    component: () => import('@/pages/flights/Flights.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...publicRoutes,
  ]
})

export default router
