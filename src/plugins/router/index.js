import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from "../../components/pages/Home.vue";
import Login from "../../components/pages/Login.vue";
import Logout from "../../components/pages/Logout.vue";
import Register from "../../components/pages/Register.vue";
import Statistics from "../../components/pages/Statistics.vue";
import Dashboard from "../../components/pages/Dashboard.vue";
import File from "../../components/pages/File.vue";

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: '/',
            name: 'landing',
            component: Home
        },
        {
            path: '/home',
            name: 'home',
            component: Home
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/logout',
            name: 'logout',
            component: Logout
        },
        {
            path: '/register',
            name: 'register',
            component: Register
        },
        {
            path: '/stats',
            name: 'statistics',
            component: Statistics
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: Dashboard
        },
        {
            path: '/dashboard/view-file',
            name: 'view-file',
            component: File
        }
    ]
});