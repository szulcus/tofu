<template>
	<button :type="type" class="button-component" @click="$emit('click', $event)">
		{{content}}
	</button>
</template>

<script>
	export default {
		name: "Button",
		props: {
			content: String,
			type: String
		},
		data() {
			return {
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.button-component {
		position: relative;
		display: block;
		margin: 0 auto;
		padding: 5px 15px;
		border: 3px solid $decorative;
		background-color: $bg;
		color: $primary;
		border-radius: 30px;
		text-transform: uppercase;
		text-decoration: none;
		font-size: 18px;
		font-weight: bold;
		letter-spacing: 1px;
		transition: 0.3s ease;
		cursor: pointer;
		outline: none;
		@include hover {
			background-color: $decorative;
			color: $bg;
		}
	}
</style>