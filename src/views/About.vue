<template>
	<div class="view" :style="{animation: !$loaded ? 'bottomElation 0.5s 1s both' : 'bottomElation 0.5s both'}">
		<div class="about">
			<div class="about__description">
				<p class="description__paragraph">Pandemia COVID-19 znacznie utrudnia kontakty ze znajomymi...</p>
				<p class="description__paragraph">Dlatego warto im o nas przypomnieć! Podejmij z nami wyzwanie 2021 roku. Zasady są proste - stwórz quiz, a następnie wyślij go swoim znajomym. Wygrywa osoba z największym procentem poprawnych odpowiedzi!</p>
			</div>
			<hr class="about__separator" />
			<h2 class="about__title">Sprawdź, czy znajomi jeszcze Cię pamiętają!</h2>
			<div class="about__button">
				<Button content="Wchodzę w to!" />
			</div>
		</div>
	</div>
</template>

<script>
	import Button from '@/Components/Global/Button'
	export default {
		name: "About",
		components: {
			Button
		}
	}
</script>

<style lang="scss" scoped>
	.about {
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
		.about__description {
			margin: 20px 0;
			max-width: 700px;
			.description__paragraph {
				margin: 10px 0;
				font-size: 20px;
			}
		}
		.about__separator {
			width: 90%;
			max-width: 300px;
			border: none;
			border-bottom: 3px solid $decorative;
		}
		.about__title {
			font-size: 25px;
			margin: 20px 0;
			@media (min-width: 600px) and (min-height: 500px) {
				font-size: 35px;
			}
		}
		.about__button {
			padding-bottom: 30px;
		}
	}
</style>
