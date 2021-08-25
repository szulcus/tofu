<template>
	<footer class="footer-component">
		<a href="https://szulcus.pl" target="_blank">
			<div class="copyright">Szulcuś 2020 &copy;</div>
		</a>
	</footer>
</template>

<script>
	export default {
		name: "Footer",
		data() {
			return {
				
			}
		},
		methods: {
			call(number) {
				window.open(`tel:${number}`)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.footer-component {
		width: 100%;
		height: 40px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: $bg-light;
		animation: opacity 0.3s 1s both;
		.copyright {
			font-size: 16px;
			color: $primary;
			font-weight: bold;
			&::first-letter {
				color: $szulcus;
			}
		}
	}
</style>