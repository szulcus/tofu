<template>
	<div class="view">
		<div class="scropper-wrapper">
			<Cropper
				class="cropper"
				:src="img"
				:auto-zoom="true"
				@change="change"
			/>
		</div>
		<img class="scropper-preview" :src="preview" alt="">
	</div>
</template>

<script>
	import { Cropper } from 'vue-advanced-cropper'
	import 'vue-advanced-cropper/dist/style.css';

	export default {
		name: "Scropper",
		components: {
			Cropper,
		},
		data() {
			return {
				img: 'https://szulcus.pl/avatar.jpg',
				preview: '',
			}
		},
		methods: {
			change({ coordinates, canvas }) {
				this.preview = canvas.toDataURL();
				console.log(coordinates, canvas);
			}
		},
	}
</script>

<style lang="scss" scoped>
	.scropper-wrapper {
		width: 300px;
		height: 200px;
	}
	.scropper-preview {
		width: 300px;
		height: 200px;
		object-fit: cover;
		transition: 0.3s ease;
	}
</style>