import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import MainAppBar from '@/components/MainAppBar.vue';
const History = () => import(/* webpackChunkName: "history" */ '../views/History.vue');
const QueryDetails = () => import(/* webpackChunkName: "query-details" */ '../views/QueryDetails.vue');
const Console = () => import(/* webpackChunkName: "console" */ '../views/console/Console.vue');
const ConsoleDashboard = () => import(/* webpackChunkName: "console" */ '../views/console/ConsoleDashboard.vue');

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
  {
    path: '/console*',
    components: {
      default: Console,
    },
    children: [
      {
        path: '',
        component: ConsoleDashboard,
      },
      {
        path: 'api-clients',
      },
      {
        path: 'providers',
      },
      {
        path: '*',
        redirect: '/console',
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
