import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import MainAppBar from '@/components/MainAppBar.vue';
const History = () => import(/* webpackChunkName: "history" */ '../views/History.vue');
const QueryDetails = () => import(/* webpackChunkName: "query-details" */ '../views/QueryDetails.vue');

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    components: {
      default: Home,
      appBar: MainAppBar,
    },
  },
  {
    path: '/history/:href',
    components: {
      default: History,
      appBar: MainAppBar,
    },
  },
  {
    path: '/query-details/:queryId',
    components: {
      default: QueryDetails,
      appBar: MainAppBar,
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
