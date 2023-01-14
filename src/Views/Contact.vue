<template>
	<div class="view" :style="{animation: !$loaded ? 'bottomElation 0.5s 1s both' : 'bottomElation 0.5s both'}">
		<div class="contact">
			<div class="contact__questions">
				<p class="contact__question">Potrzebujesz więcej informacji?</p>
				<p class="contact__question">Może masz jakieś propozycje zmian w aplikacji?</p>
				<p class="contact__question">A może chciał(a)byś, aby właśnie twoje pytanie się tu znalazło?</p>
			</div>
			<hr class="contact__separator" />
			<h2 class="contact__title">Zapraszam do kontaktu, stwórzmy razem coś niezwykłego!</h2>
			<div class="contact__icons">
				<a href="https://m.me/szulcus" target="_blank" rel="noopener noreferrer">
					<fa-icon class="contact__icon" :icon="{ prefix: 'fab', iconName: 'facebook-messenger' }" />
				</a>
				<a href="mailto:jakubs929@gmail.com" target="_blank" rel="noopener noreferrer">
					<fa-icon class="contact__icon" icon="envelope" />
				</a>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "Contact",
		data() {
			return {
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.contact {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		text-align: center;
		@media (min-width: 600px) and (min-height: 500px) {
			justify-content: center;
		}
		.contact__questions {
			margin: 30px 0;
			.contact__question {
				margin: 10px 0;
				font-size: 20px;
			}
			@media (min-width: 600px) and (min-height: 500px) {
			}
		}
		.contact__separator {
			width: 90%;
			max-width: 300px;
			border: none;
			border-bottom: 3px solid $decorative;
			margin: 0;
		}
		.contact__title {
			font-size: 25px;
			margin: 30px 0;
			@media (min-width: 600px) and (min-height: 500px) {
				font-size: 35px;
			}
		}
		.contact__icons {
			display: flex;
			padding-bottom: 30px;
			.contact__icon {
				font-size: 30px;
				margin: 0 15px;
				color: $decorative;
				transition: all 0.2s ease;
				@include hover {
					transform: scale(1.1);
				}
			}
		}
	}
</style>
