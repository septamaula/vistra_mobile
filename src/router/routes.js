const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/login' },
      { path: 'dashboard', component: () => import('@/pages/IndexPage.vue') },
      { path: 'journey-plan', component: () => import('@/pages/JourneyPlanList.vue') },
      { path: 'journey-plan-map/:header_id', component: () => import('@/pages/JourneyPlanMap.vue') },
      { path: 'journey-plan/:id', component: () => import('@/pages/JourneyPlanDetail.vue') },
      { path: 'visit/:visit_id', component: () => import('@/pages/VisitExecution.vue') },
      { path: 'deliveries', component: () => import('@/pages/DeliveryListPage.vue') },
      { path: 'returns', component: () => import('@/pages/ReturnListPage.vue') },
      { path: 'products', component: () => import('@/pages/ProductCatalogPage.vue') },
      { path: 'outlets', component: () => import('@/pages/OutletListPage.vue') },
      { path: 'reports', component: () => import('@/pages/SalesReportPage.vue') },
      { path: 'report', component: () => import('@/pages/SalesReportPage.vue') },
      { path: 'sync', component: () => import('@/pages/OfflineSyncPage.vue') },
      { path: 'profile', component: () => import('@/pages/UserProfilePage.vue') },
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
