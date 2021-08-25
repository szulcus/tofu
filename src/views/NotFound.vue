<template>
	<div class="view" :style="{animation: !$loaded ? 'bottomElation 0.5s 1s both' : 'bottomElation 0.5s both'}">
		Strona nie istnieje!
	</div>
</template>

<script>
	export default {
		name: "NotFound",
		data() {
			return {
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.not-found-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
	}
</style>