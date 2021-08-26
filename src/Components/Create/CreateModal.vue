<template>
	<div class="create-modal">
		<fa-icon class="modal__close" icon="times" @click="$emit('close')" />
		<label class="modal__input">
			<input
				class="input__item"
				type="text"
				placeholder="Pytanie dla ciebie"
				v-model="localRefunds.direct"
			/>
		</label>
		<label class="modal__input">
			<span class="input__pre">
				Czy on(a)
			</span>
			<input
				class="input__item"
				type="text"
				placeholder="Pytanie dla znajomego"
				v-model="localRefunds.indirect"
			/>
		</label>
		<div class="modal__img" @click="$refs.editImg.click()">
			<div class="img__edit">
				<fa-icon class="edit__icon" icon="image" />
			</div>
			<img class="img__item" :src="localImg" alt="Zdjęcie poglądowe" />
			<input
				ref="editImg"
				type="file"
				accept="image/png, image/jpeg"
				hidden
				@change="updateImg($event.target.files[0])"
			/>
		</div>
		<Button type="text" content="Zapisz" @click="save" />
		<div v-if="progress" class="modal__progress">
			<div class="progress__bar" :style="{ width: `${progress}%` }" />
		</div>
	</div>
</template>

<script>
	import Button from '@/Components/Global/Button.vue'

	export default {
		name: "CreateModal",
		components: {
			Button,
		},
		props: {
			refunds: Object,
			img: String,
		},
		data() {
			return {
				localRefunds: { ...this.refunds },
				localImg: this.img,
				localImgFile: null,
				progress: 0,
			};
		},
		methods: {
			crop(e) {
				console.log(e);
			},
			updateImg(file) {
				this.localImg = URL.createObjectURL(file);
				this.localImgFile = file;
			},
			save() {
				if (!this.localImgFile) {
					this.$emit('update-answer', {
						refunds: this.localRefunds
					});
					this.$emit('close');
					return;
				}
				const file = this.localImgFile;
				const storageRef = this.$st.ref(`images/${file.name}`);
				const task = storageRef.put(file);
				task.on('state_changed',
				snap => {
					this.progress = (snap.bytesTransferred / snap.totalBytes) * 100
				}, err => {
					console.log(err);
				}, () => {
					this.$st.ref('images').child(file.name).getDownloadURL().then(url => {
						this.progress = 0;
						this.$emit('update-answer', {
							img: url,
							refunds: this.localRefunds
						});
						this.$emit('close');
					})
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.create-modal {
		position: fixed;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: $bg;
		z-index: 2;
		animation: opacity 0.2s ease;
		padding: 30px;
		.modal__close {
			position: absolute;
			top: 20px;
			right: 20px;
			color: $decorative;
			transition: 0.2s ease;
			@include hover {
				opacity: 0.7;
			}
		}
		.modal__input {
			width: min(400px, 100%);
			display: flex;
			align-items: center;
			.input__pre {
				white-space: nowrap;
				margin-right: 5px;
				font-weight: bold;
			}
			.input__item {
				flex: 1;
				max-width: 100%;
				border: none;
				border-bottom: 3px solid $decorative;
				background-color: transparent;
				outline: none;
				text-align: center;
				margin: 10px 0;
				font-weight: bold;
				font-size: 18px;
				&::placeholder {
					text-align: center;
					font-weight: bold;
					transition: 0.3s ease;
				}
				&:focus {
					&::placeholder {
						opacity: 0;
						letter-spacing: 2px;
					}
				}
			}
		}
		.modal__progress {
			position: relative;
			width: 400px;
			height: 5px;
			background-color: $bg-light;
			margin-top: 20px;
			.progress__bar {
				position: absolute;
				top: 0;
				left: 0;
				width: 0;
				height: 100%;
				background-color: $decorative;
				transition: 0.3s ease;
			}
		}
		.modal__img {
			position: relative;
			width: 300px;
			height: 200px;
			margin: 20px 0;
			border-radius: 20px;
			overflow: hidden;
			@include hover {
				.img__edit {
					opacity: 0.5;
				}
			}
			.img__item {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
			.img__edit {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: $bg;
				opacity: 0;
				transition: 0.2s ease;
				.edit__icon {
					font-size: 40px;
				}
			}
		}
	}
</style>