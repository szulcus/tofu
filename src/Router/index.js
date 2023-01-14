import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/Views/Home.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home
	},
	{
		path: '/quiz',
		name: 'Create',
		component: () => import('@/Views/Create')
	},
	{
		path: '/quiz/:nick',
		name: 'Answer',
		component: () => import('@/Views/Answer')
	},
	{
		path: '/ranking',
		name: 'Ranking',
		component: () => import('@/Views/Ranking')
	},
	{
		path: '/o-nas',
		name: 'About',
		component: () => import('@/Views/About')
	},
	{
		path: '/kontakt',
		name: 'Contact',
		component: () => import('@/Views/Contact')
	},
	{
		path: '/scropper',
		name: 'Contact',
		component: () => import('@/Views/Scropper')
	},
	{
		path: '*',
		name: 'NotFound',
		component: () => import('@/Views/NotFound')
	}
]

const router = new VueRouter({
	// mode: 'history',
	base: '/',
	routes
})

export default router
