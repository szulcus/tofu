// BASIC
import Vue from 'vue'
import '@/registerServiceWorker'
// APP
import App from '@/App.vue'
// ROUTER
import router from '@/Router'
// STYLES
import '@/Styles/Global.scss'
// CONFIG
import '@/Config/FaIcons'
import '@/Config/Fragment'
import '@/Config/Firebase'
import '@/Config/DayJS'

Vue.prototype.$loaded = false
Vue.prototype.$jwtPassword = 'tofu2020';

Vue.prototype.$importAll = (r) => r.keys().map(r)

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
window.addEventListener('resize', () => {
	let vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', `${vh}px`);
});

Vue.config.productionTip = false


Vue.directive('bg', function (el, binding) {
	el.style.backgroundImage = `url(${binding.value})`
	el.style.backgroundRepeat = 'no-repeat'
	el.style.backgroundPosition = 'center'
	el.style.backgroundSize = 'cover'
	if (binding.modifiers.contain) {
		el.style.backgroundSize = 'contain'
	}
})

new Vue({
	router,
	render: h => h(App)
}).$mount('#app')
