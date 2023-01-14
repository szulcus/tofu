<template>
	<fragment>
		<div v-if="quizPreview" class="quiz-preview">
			<h1 class="quiz-preview__title">Wyniki użytkownika <span class="quiz-preview__title--owner">{{quizPreview.owner}}</span></h1>
			<div class="answers">
				<div class="answer">
					<fragment v-if="quizPreview.answers.length">
						<Button content="Podejmij wyzwanie!" @click="$router.push({name: 'Answer', params: {nick: jwtNick(quizPreview.owner)}})" />
					</fragment>
					<fragment v-else>
						<div class="answer__date">Nikt jeszcze nie rozwiązał tego quizu</div>
						<div class="answer__title">Chcesz być pierwszy(a)?</div>
						<Button content="Jasne!" @click="$router.push({name: 'Answer', params: {nick: jwtNick(quizPreview.owner)}})" />
					</fragment>
				</div>
				<div class="answer" v-for="(answer, index) in quizPreview.answers.slice().reverse()" :key="index">
					<div class="answer__date">{{$dayjs.unix(answer.date).format('D MMMM o H:mm')}}</div>
					<div class="answer__title">{{answer.username}} zdobył(a) {{answer.percents}}%</div>
					<Button content="Sprawdź" @click="checkAnswer" />
				</div>
			</div>
			<div class="quiz-preview__back">
				<fa-icon icon="times" @click="setQuiz" />
			</div>
		</div>
		<div class="view" :style="{animation: !$loaded ? 'bottomElation 0.5s 1s both' : 'bottomElation 0.5s both'}">
			<div class="search__field">
				<fa-icon class="field__icon" icon="search" />
				<input class="field__input" type="search" placeholder="Wyszukaj znajomych..." @keyup="search" />
			</div>
			<div class="quizzes">
				<fragment v-if="quizzesResults === '...'">
					...
				</fragment>
				<fragment v-else-if="!quizzesResults.length">
					Brak wyników...
				</fragment>
				<fragment v-else>
					<div
						v-for="(result) in quizzesResults"
						:key="result.owner"
						@click="setQuiz(result.owner)"
						:class="['quiz', {'quiz--respect': (quizzesSorted.map(quiz => quiz.owner).indexOf(result.owner)) + 1 <= 3 && sortedBy !== 'owner'}]"
					>
						<div class="quiz__place">
							{{(quizzesSorted.map(quiz => quiz.owner).indexOf(result.owner)) + 1}}
						</div>
						<h1 class="quiz__owner">
							{{result.owner}}
						</h1>
						<div class="quiz__achievements">{{result.average}}% ({{result.percents.length}} {{result.percents.length === 1 ? 'odpowiedź' : 'odpowiedzi'}})</div>
					</div>
					<SortMenu :sortedBy="sortedBy" @change-sort="sortBy" />
				</fragment>
			</div>
		</div>
	</fragment>
</template>

<script>
	import jwt from 'jsonwebtoken'
	import Button from '@/Components/Global/Button'
	import SortMenu from '@/Components/Ranking/SortMenu'
	export default {
		name: "Ranking",
		components: {
			Button,
			SortMenu
		},
		data() {
			return {
				quizzes: [],
				quizzesSorted: [],
				quizzesResults: '...',
				quizPreview: null,
				sortedBy: ''
			}
		},
		mounted() {
			this.$db.collection('quizzes').get().then(snaps => {
				const quizzes = []
				snaps.forEach(snap => {
					quizzes.push(snap.data())
				})
				this.quizzes = quizzes;
				return quizzes
			}).then((result) => {
				const quizzesSorted = []
				result.forEach((quiz) => {
					const percents = []
					quiz.answers.forEach(answer => {
						percents.push(answer.percents)
					})
					const average = Number((percents.length ? percents.reduce((p, c) => p + c, 0) / percents.length : 0).toFixed(2))
					quizzesSorted.push({
						owner: quiz.owner,
						percents,
						average
					})
				})
				this.quizzesSorted = quizzesSorted
				this.sortBy('percents')
			})
		},
		methods: {
			jwtNick(nick) {
				return jwt.sign(nick, this.$jwtPassword);
			},
			sortBy(name) {
				if (name === 'percents') {
					this.quizzesSorted = this.quizzesSorted.sort((a, b) => a.average > b.average ? -1 : a.average < b.average ? 1 : 0)
					this.quizzesResults = this.quizzesSorted
					this.sortedBy = name
				}
				else if (name === 'users') {
					this.quizzesSorted = this.quizzesSorted.sort((a, b) => a.percents.length > b.percents.length ? -1 : a.percents.length < b.percents.length ? 1 : 0)
					this.quizzesResults = this.quizzesSorted
					this.sortedBy = name
				}
				else if (name === 'owner') {
					this.quizzesSorted = this.quizzesSorted.sort((a, b) => a.owner < b.owner ? -1 : a.owner > b.owner ? 1 : 0)
					this.quizzesResults = this.quizzesSorted
					this.sortedBy = name
				}
			},
			setQuiz(owner) {
				if (owner) {
					// this.quizPreview = this.quizzes[index]
					const index = this.quizzes.map(quiz => quiz.owner).indexOf(owner)
					// const quiz
					this.quizPreview = this.quizzes[index]
				}
				else {
					this.quizPreview = null
				}
			},
			checkAnswer() {
				alert('Przepraszamy, ale funkcja jest jeszcze nie dostępna...')
			},
			search(e) {
				const searchString = e.target.value.toLowerCase();
				this.quizzesResults = this.quizzesSorted.filter(quiz => {
					return quiz.owner.toLowerCase().includes(searchString)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.quiz-preview {
		position: fixed;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20px;
		background-color: rgb($bg, 0.8);
		backdrop-filter: blur(10px);
		z-index: 2;
		animation: opacity 0.2s ease;
		.quiz-preview__title {
			font-size: 30px;
			margin: 20px;
			.quiz-preview__title--owner {
				display: inline-block;
				&::first-letter {
					color: $decorative;
				}
			}
		}
		.quiz-preview__back {
			margin-top: 10px;
			font-size: 25px;
			transition: all 0.2s ease;
			color: $decorative;
			@include hover;
		}
		.answers {
			width: 100%;
			max-width: 500px;
			height: calc(100% - 130px);
			@include scroll;
			.answer {
				position: relative;
				width: 100%;
				border: 3px solid $bg-light;
				padding: 20px;
				margin: 10px 0;
				border-radius: 20px;
				&:last-child {
					margin-bottom: 30px;
				}
				.answer__date {
					font-size: 18px;
				}
				.answer__title {
					font-size: 25px;
					font-weight: bold;
					margin-bottom: 10px;
					&::first-letter {
						color: $decorative;
					}
				}
			}
		}
	}
	.search__field {
		width: 90%;
		max-width: 700px;
		margin: 0 auto 20px auto;
		display: flex;
		align-items: center;
		.field__icon {
			font-size: 22px;
			color: $decorative;
			margin-right: 10px;
		}
		.field__input {
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
	.quizzes {
		width: 100%;
		height: calc(100% - 60px);
		max-width: 500px;
		display: flex;
		flex-direction: column;
		margin: 0 auto;
		@include scroll;
		.quiz {
			position: relative;
			width: 100%;
			padding: 10px;
			border: 3px solid rgb($secondary, 0.5);
			margin: 5px 0;
			border-radius: 20px;
			transition: all 0.3s ease;
			@include hover {
				border: 3px solid $secondary;
			}
			.quiz__place {
				position: absolute;
				top: 5px;
				right: 15px;
				font-size: 30px;
				font-weight: bold;
				color: $decorative;
			}
			.quiz__owner {
				width: calc(100% - 110px);
				margin: 0 auto;
				font-size: 25px;
				font-weight: bold;
				@include ellipsis;
				&::first-letter {
					color: $decorative;
				}
			}
			.quiz__achievements {
				font-size: 18px;
			}
		}
		.quiz--respect {
			border: 3px solid rgb($decorative, 0.5);
			@include hover {
				border: 3px solid $decorative;
			}
			.quiz__place {
				&::after {
					content: '\f559';
					font-family: "Font Awesome 5 Free";
					font-size: 22px;
					margin-left: 5px;
				}
			}
		}
	}
</style>