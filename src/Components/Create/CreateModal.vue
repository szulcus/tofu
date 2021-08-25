<template>
	<div class="create-modal">
		<fa-icon class="modal__close" icon="times" @click="$emit('close')" />
		<label class="modal__input">
			<input
				class="input__item"
				type="text"
				placeholder="Pytanie dla ciebie"
				v-model="refunds.direct"
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
				v-model="refunds.indirect"
			/>
		</label>
		<div class="modal__img" @click="$refs.editImg.click()">
			<div class="img__edit">
				<fa-icon class="edit__icon" icon="image" />
			</div>
			<img class="img__item" :src="img" alt="Zdjęcie poglądowe" />
			<input
				ref="editImg"
				type="file"
				accept="image/png, image/jpeg"
				hidden
				@change="updateImg($event.target.files[0])"
			/>
		</div>
	</div>
</template>

<script>
	export default {
		name: "CreateModal",
		props: {
			refunds: Object,
			img: String,
		},
		methods: {
			updateImg(file) {
				// console.log(this.$st);
				const storageRef = this.$st.ref(`images/${file.name}`);
				const task = storageRef.put(file);
				task.on('state_changed',
				snap => {
					console.log({percentage: (snap.bytesTransferred / snap.totalBytes) * 100});
				}, err => {
					console.log(err);
				}, () => {
					this.$st.ref('images').child(file.name).getDownloadURL().then(url => {
						console.log({url});
						this.$emit('update-img', url)
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
		width: 50%;
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