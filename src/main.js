import { createApp } from 'vue';
import './style/reset.css';
import './style.css';
import 'ant-design-vue/dist/antd.css'; // antd
import Antd from 'ant-design-vue';
import '@/style/global.less';
import App from './App.vue';
import router from '@/router/router';
import store from '../src/store';
import DataVVue3 from '@kjgl77/datav-vue3'
import Multiselect from 'vue-multiselect';
const app = createApp(App)
app.component('Multiselect', Multiselect)
app.use(router).use(store).use(DataVVue3).use(Antd).mount('#app');

