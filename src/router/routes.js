const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/login' },
      { path: 'dashboard', component: () => import('@/pages/IndexPage.vue') },
      { path: 'journey-plan/add', component: () => import('@/pages/JourneyPlanForm.vue') },
      { path: 'journey-plan/:id', component: () => import('@/pages/JourneyPlanDetail.vue') },
      { path: 'visit/:visit_id', component: () => import('@/pages/VisitExecution.vue') },
      { path: 'second', component: () => import('@/pages/SecondPage.vue') }
    ],
  },

  {
    path: '/login',
    component: () => import('@/layouts/BlankLayout.vue'),
    children: [
      { path: '', component: () => import('@/pages/LoginPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  }
]

export default routes
