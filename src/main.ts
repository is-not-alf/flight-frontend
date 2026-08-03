import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'
import Aura from '@primeuix/themes/aura';

import 'primeicons/primeicons.css'
import './style.css'

import App from './App.vue'
import router from './router'

import { primeVueRuLocale } from './locale/primevueRuLocale'

const app = createApp(App)
app.use(router)
app.use(ToastService)
app.use(PrimeVue, {
  ripple: true,
  locale: primeVueRuLocale,
  theme: {
    preset: Aura,
    options: {
        prefix: 'p',
        darkModeSelector: 'system',
        cssLayer: false
    }
}
})

app.directive('tooltip', Tooltip)

app.mount('#app')