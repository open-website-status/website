import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
const History = () => import(/* webpackChunkName: "history" */ '../views/History.vue');
const QueryDetails = () => import(/* webpackChunkName: "query-details" */ '../views/QueryDetails.vue');

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/query/:queryId',
  },
  {
    path: '/history/:href',
    component: History,
  },
  {
    path: '/query-details/:queryId',
    component: QueryDetails,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
