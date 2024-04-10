import { createApp } from 'vue'
import 'normalize.css/normalize.css'
import App from './App.vue'
import './index.scss'
import ViewUIPlus from 'view-ui-plus'
import { createHead } from '@vueuse/head'
import {router} from '@/router/index.js'
import { createPinia } from 'pinia'
import * as filters from '@/utils/filters'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { VueQueryPlugin } from "@tanstack/vue-query"
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Vue3CountryIntl from 'vue3-country-intl';
import 'vue3-country-intl/lib/vue3-country-intl.css'
const app = createApp(App)
const pinia = createPinia()
import 'view-ui-plus/dist/styles/viewuiplus.css'
pinia.use(piniaPluginPersistedstate)
const head = createHead()
app.use(router).use(head).use(pinia).use(VueQueryPlugin).use(ViewUIPlus).mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.config.globalProperties.$filters = {
  ...filters,
}
app.component(Vue3CountryIntl.name, Vue3CountryIntl);
