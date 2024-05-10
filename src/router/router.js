import { createRouter, createWebHistory } from 'vue-router';
// import Home from '@/pages/home/Home.vue';
import About from '@/pages/about/About.vue';
import NotFound from '@/pages/404/Error404.vue';

const routes = [
    // {
    //     path: '/',
    //     alias: '/home',
    //     component: Home,
    //     meta: { title: 'Home' },
    // },
    {
        path: '/About',
        component: About,
        meta: { title: 'About' },
        // example of route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
    },
    { path: '/:path(.*)', component: NotFound },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 路由全局前置守卫
router.beforeEach((to, from, next) => {
    next();
});


export default router;