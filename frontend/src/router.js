import Vue from 'vue'
import Router from 'vue-router'
import mastermind from '@/views/mastermind.vue'
import leaderboard from '@/views/leaderboard.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/mastermind',
      name: 'mastermind',
      component: mastermind
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: leaderboard
    }
  ]
})