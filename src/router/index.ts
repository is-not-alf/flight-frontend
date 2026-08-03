import { createRouter, createWebHistory } from 'vue-router'

const publicRoutes = [
  {
    path: '/',
    name: 'Flights',
    component: () => import('@/pages/flights/Flights.vue'),
  },
  // {
  //   path: 'airports',
  //   name: 'Airports',
  //   component: () => import('@/pages/airports/Airports.vue'),
  // },
  //     {
  //   path: 'aircrafts',
  //   name: 'Aircrafts',
  //   component: () => import('@/pages/aircrafts/Aircrafts.vue'),
  // },
  // {
  //   path: 'passengers',
  //   name: 'Passengers',
  //   component: () => import('@/pages/passengers/Passengers.vue'),
  // },
]

// const notFoundRoute = {
//   path: '/:pathMatch(.*)*',
//   name: 'NotFound',
//   meta: { allowed: true, permissions: 'available' as const },
//   component: { render: () => null },
// }

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...publicRoutes,
  ]
})

export default router
