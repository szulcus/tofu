<template>
	<div class="view" :style="{animation: !$loaded ? 'bottomElation 0.5s 1s both' : 'bottomElation 0.5s both'}">
		<div class="greeting">
			<img class="logotype" src="@/Assets/Images/logo/logotype.svg" alt="ToFu logotype">
			<h2 class="title">Witaj! Miło, że do nas wpadłeś {{':)'}}</h2>
		</div>
		<div class="search">
			<div class="search__field">
				<fa-icon class="search__field__icon" icon="search" />
				<input class="search__field__input" type="search" placeholder="Wyszukaj znajomych..." @keyup="search" />
			</div>
			<div class="search__result">
				<fragment v-if="quizzesResults === '...'">
					...
				</fragment>
				<fragment v-else-if="!quizzesResults.length">
					Brak wyników...
				</fragment>
				<fragment v-else>
					<router-link :to="{name: 'Answer', params: {nick: jwtNick(quiz.owner)}}" v-for="quiz in quizzesResults" :key="quiz.owner">
						<div class="quiz">
							{{quiz.owner}} ({{quiz.average}}%)
						</div>
					</router-link>
				</fragment>
			</div>
		</div>
		<div class="quiz-button">
			<Button content="Stwórz własny quiz!" type="submit" @click="$router.push({name: 'Create'})" />
		</div>
	</div>
</template>

<script>
	import Button from '@/Components/Global/Button'
	import jwt from 'jsonwebtoken'
	export default {
		name: 'Home',
		components: {
			Button
		},
		data() {
			return {
				activeIndex: 0,
				quizzes: [],
				quizzesResults: '...'
			}
		},
		mounted() {
			this.$db.collection('quizzes').get().then(snaps => {
				const quizzes = []
				snaps.forEach(snap => {
					quizzes.push(snap.data())
				})
				return quizzes
			}).then((result) => {
				const quizzes = []
				result.forEach((quiz) => {
					const percents = []
					quiz.answers.forEach(answer => {
						percents.push(answer.percents)
					})
					const average = Number((percents.length ? percents.reduce((p, c) => p + c, 0) / percents.length : 0).toFixed(2))
					quizzes.push({
						owner: quiz.owner,
						percents,
						average
					})
				})
				this.quizzes = quizzes.sort((a, b) => a.average > b.average ? -1 : a.average < b.average ? 1 : 0)
				this.quizzesResults = this.quizzes
			})
		},
		methods: {
			jwtNick(nick) {
				return jwt.sign(nick, this.$jwtPassword);
			},
			search(e) {
				const searchString = e.target.value.toLowerCase();
				this.quizzesResults = this.quizzes.filter(quiz => {
					return quiz.owner.toLowerCase().includes(searchString)
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.greeting {
		.logotype {
			width: 150px;
		}
		.title {
			font-size: 20px;
			margin: 0 0 20px 0;
		}
		@media (max-height: 600px) {
			display: none;
		}
	}
	.search {
		width: 100%;
		max-width: 500px;
		margin: 0 auto;
		height: calc(100% - 180px);
		display: flex;
		flex-direction: column;
		align-items: center;
		@media (max-height: 600px) {
			height: 100%;
		}
		.search__field {
			width: 80%;
			display: flex;
			align-items: center;
			.search__field__icon {
				font-size: 22px;
				color: $decorative;
				margin-right: 10px;
			}
			.search__field__input {
				width: 100%;
				background: none;
				border: none;
				border-bottom: 3px solid $decorative;
				font-size: 18px;
				font-weight: bold;
				outline: none;
				&::placeholder {
					transition: all 0.3s ease;
				}
				&:focus {
					&::placeholder {
						letter-spacing: 2px;
						opacity: 0;
					}
				}
			}
		}
		.search__result {
			width: 100%;
			margin: 10px 0 20px 0;
			@include scroll;
			.quiz {
				padding: 5px;
				margin: 10px;
				border: 3px solid $bg-light;
				font-size: 20px;
				font-weight: bold;
				border-radius: 10px;
				&::first-letter {
					color: $decorative;
				}
			}
		}
	}
	.quiz-button {
		display: block;
		@media (max-height: 600px) {
			display: none;
		}
	}
</style>
