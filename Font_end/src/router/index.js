import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      name:'home',
      component:()=>import('../views/HomeView.vue'),
    },
    {
      path:'/navigation',
      name:'navigation',
      component: () => import('../components/Navigation.vue'),
    },
    // {
    //   path:'/mapmeature',
    //   name:'mapmeature',
    //   component: () => import('../views/MapMeasure.vue'),
    // },

    {
      path:'/datascreen',
      name:'datascreen',
      component: () => import('../views/DataScreen.vue'),
    },
    {
      path:'/cityview',
      name:'cityview',
      component: () => import('../views/CityView.vue'),
    },
    // {
    //   path:'/changestyle',
    //   name:'changestyle',
    //   component: () => import('../views/ChangeStyle.vue'),
    // },

  ],
})

export default router
