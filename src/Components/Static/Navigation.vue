<template>
	<header class="header">
		<nav class="nav-component">
			<router-link class="logo-link" to="/">
				<img :src="logo" alt="logo" class="logo">
			</router-link>
			<ul v-if="activeMenu" class="nav-list">
				<li id="/" class="nav-item">
					<router-link class="nav-link" to="/" exact>ToFu</router-link>
				</li>
				<li id="/quiz" class="nav-item">
					<router-link class="nav-link" to="/quiz">Quiz</router-link>
				</li>
				<li id="/ranking" class="nav-item">
					<router-link class="nav-link" to="/ranking">Ranking</router-link>
				</li>
				<li id="/o-nas" class="nav-item">
					<router-link class="nav-link" to="/o-nas">O nas</router-link>
				</li>
				<li id="/kontakt" class="nav-item">
					<router-link class="nav-link" to="/kontakt">Kontakt</router-link>
				</li>
			</ul>
			<div class="line" :style="{left: `${lineMoved}px`, width: `${lineWidth}px`}"/>
			<div :class="['hamburger-menu', {'hamburger-active': activeMenu}]" @click="activeMenu = !activeMenu">
				<div class="hamburger-line" />
				<div class="hamburger-line" />
				<div class="hamburger-line" />
			</div>
		</nav>
	</header>
</template>

<script>
	import Vue from 'vue'
	import logo from '@/Assets/Images/logo/logo.svg'
	export default {
		name: "Navigation",
		data() {
			return {
				logo,
				lineMoved: 0,
				lineWidth: 0,
				activeMenu: window.innerWidth < 700 ? false : true
			}
		},
		watch:{
			$route(to){
				const path = to.path.includes('quiz') ? '/quiz' : to.path
				const element = document.getElementById(path)
				if (window.innerWidth < 700) {
					this.activeMenu = false
				}
				else if (element) {
					const {left, width} = element.getBoundingClientRect()
					this.lineMoved = left
					this.lineWidth = width
				}
				else if (to.name === 'NotFound') {
					this.lineMoved = 0
					this.lineWidth = 0
				}
			}
		},
		mounted() {
			setTimeout(() => {
				Vue.prototype.$loaded = true
			}, 1500)
			if (window.innerWidth < 700) {
				this.activeMenu = false
			}
			else {
				setTimeout(() => {
					if (this.$route.name !== 'NotFound') {
						const path = this.$route.path.includes('quiz') ? '/quiz' : this.$route.path
						this.lineMoved = document.getElementById(path).getBoundingClientRect().left
						this.lineWidth = document.getElementById(path).getBoundingClientRect().width
					}
				}, 1600)
			}
			window.addEventListener("resize", () => {
				if (window.innerWidth < 700 && this.activeMenu) {
					this.activeMenu = false
				}
				else if (window.innerWidth >= 700) {
					if (!this.activeMenu) {
						this.activeMenu = true
					}
					const path = this.$route.path.includes('quiz') ? '/quiz' : this.$route.path
					const element = document.getElementById(path)
					if (element) {
						const {left, width} = element.getBoundingClientRect()
						this.lineMoved = left
						this.lineWidth = width
					}
				}
			});
		}
	}
</script>

<style lang="scss" scoped>
	.header {
		background-color: $bg-light;
	}
	.nav-component {
		position: relative;
		width: 100%;
		height: 90px;
		max-width: 1000px;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin: 0 auto;
		padding: 10px 20px;
		z-index: 2;
		@media (min-width: 700px) {
			height: 100px;
		}
		.logo-link {
			position: relative;
			height: 70px;
			.logo {
				height: 100%;
			}
		}
		.nav-list {
			position: fixed;
			top: 90px;
			left: 0;
			width: 100%;
			height: 310px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			background-color: rgb($bg, 0.9);
			list-style: none;
			transform-origin: top;
			animation: mobileMenu 0.5s both;
			border-bottom: 3px solid rgb($decorative, 1);
			&::after {
				content: '';
				position: absolute;
				bottom: 7px;
				width: 30px;
				height: 4px;
				background-color: rgb($decorative, 0.5);
				border-radius: 4px;
			}
			.nav-item {
				margin: 10px 0;
				text-transform: uppercase;
				font-size: 22px;
				letter-spacing: 2px;
				font-weight: bold;
				cursor: pointer;
				&:nth-child(1) {
					animation: bottomElation 0.3s 0.2s both;
				}
				&:nth-child(2) {
					animation: bottomElation 0.3s 0.3s both;
				}
				&:nth-child(3) {
					animation: bottomElation 0.3s 0.4s both;
				}
				&:nth-child(4) {
					animation: bottomElation 0.3s 0.5s both;
				}
				&:nth-child(5) {
					animation: bottomElation 0.3s 0.6s both;
				}
				.nav-link {
					color: $primary;
					text-decoration: none;
					transition: all 0.2s ease;
					@include hover {
						color: $decorative;
					}
				}
				.router-link-active {
					color: $decorative;
					font-weight: bold;
				}
			}
			@media (min-width: 700px) {
				position: relative;
				top: 0;
				width: auto;
				height: auto;
				flex-direction: row;
				align-items: flex-end;
				background-color: transparent;
				border-bottom: none;
				&::after {
					content: '';
					display: none;
				}
				.nav-item {
					margin: 0 10px;
					&:nth-child(1) {
						animation: rightElation 0.3s 1.3s both;
					}
					&:nth-child(2) {
						animation: rightElation 0.3s 1.2s both;
					}
					&:nth-child(3) {
						animation: rightElation 0.3s 1.1s both;
					}
					&:nth-child(4) {
						animation: rightElation 0.3s 1s both;
					}
					&:nth-child(5) {
						animation: rightElation 0.3s 0.9s both;
					}
					.nav-link {
						@include hover {
							color: $decorative;
						}
					}
				}
			}
		}
		.hamburger-menu {
			position: relative;
			height: 21px;
			width: 30px;
			margin-bottom: 15px;
			animation: rightElation 0.3s 1s both;
			cursor: pointer;
			@media (min-width: 700px) {
				display: none;
			}
			.hamburger-line {
				position: absolute;
				width: 100%;
				height: 3px;
				background-color: $decorative;
				transition: all 0.4s ease-in-out, transform 0.2s ease-in-out;
				&:nth-child(1) {
					top: 0;
				}
				&:nth-child(2) {
					top: calc(50% - 1px);
					width: 70%;
				}
				&:nth-child(3) {
					top: calc(100% - 1px);
				}
			}
		}
		.hamburger-active .hamburger-line {
			color: $decorative;
			transition: all 0.3s ease-in-out, transform 0.2s 0.25s ease-in-out;
			&:nth-child(1) {
				top: calc(50% - 1px);
				transform: rotate(45deg);
			}
			&:nth-child(2) {
				top: calc(50% - 1px);
				width: 0;
				opacity: 0;
			}
			&:nth-child(3) {
				top: calc(50% - 1px);
				transform: rotate(-45deg);
			}
		}
		.line {
			position: fixed;
			top: 85px;
			width: 100px;
			height: 2.5px;
			display: none;
			background-color: $decorative;
			transition: all 0.5s ease;
			animation: opacity 0.3s 2s both;
			border-radius: 1px;
			@media (min-width: 700px) {
				display: flex;
			}
		}
	}
</style>