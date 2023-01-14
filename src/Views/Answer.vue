<template>
	<fragment>
		<div v-if="results.correct || results.incorrect" class="results-container">
			<div class="results">
				<h1 class="results__title">Wyniki</h1>
				<div class="results__compare">
					<ul class="compare__list">
						<h2 class="list__subtitle">Dobrze:</h2>
						<li
							v-for="(question, index) in results.correct"
							:key="index"
							class="list__item"
						>
							Czy {{friendNick}} {{question.refunds.indirect}} <span class="answer">{{question.answer === '+' ? 'Tak!' : 'Nie!'}}</span>
						</li>
						<div class="list__sum">Razem: <span class="sum__number">{{results.correct.length}}</span></div>
					</ul>
					<ul class="compare__list">
						<h2 class="list__subtitle">Niedobrze:</h2>
						<li
							v-for="(question, index) in results.incorrect"
							:key="index"
							class="list__item"
						>
							Czy {{friendNick}} {{question.refunds.indirect}} <span class="answer">{{question.answer === '+' ? 'Tak!' : 'Nie!'}}</span>
						</li>
						<div class="list__sum">Razem: <span class="sum__number">{{results.incorrect.length}}</span></div>
					</ul>
				</div>
				<div class="results__answer">
					<div class="answer__content">Znasz swojego przyjaciela w <span class="results__percents">{{results.percents}}%</span>. Gratulacje!</div>
					<Button content="Ok!" @click="$router.push({name: 'Home'})" />
				</div>
			</div>
		</div>
		<div class="view" :style="{animation: !$loaded ? 'bottomElation 0.5s 1s both' : 'bottomElation 0.5s both'}">
			<form class="test-form" @submit.prevent="save">
				<div class="test-form__info">
					<div class="owner-name">{{friendNick}}</div>
					<div class="separation">|</div>
					<input v-model="username" class="input-name" placeholder="Twój nick" type="text" required />
				</div>
				<div v-if="questions === '...'" class="question">
					...
				</div>
				<div v-else-if="questions" :class="['question', {'answer-yes': questions[activeIndex].answer === '+', 'answer-no': questions[activeIndex].answer === '-'}]">
					<div class="question__nav" @click="indexDown">
						<fa-icon icon="angle-left" />
					</div>
					<div class="question__nav" @click="indexUp">
						<fa-icon icon="angle-right" />
					</div>
					<div class="question__title" @click="questionPreview = !questionPreview">
						<div :class="['title__content', {'title__content--ellipsis': !questionPreview}]">Czy {{friendNick}} {{questions[activeIndex].refunds.indirect}}</div>
						<fragment v-if="windowWidth < 800">
							<fa-icon v-if="!questionPreview" class="title__icon" icon="angle-down" />
							<fa-icon v-else class="title__icon" icon="angle-up" />
						</fragment>
					</div>
					<div class="question__image" v-bg="questions[activeIndex].img" />
					<div class="question__decisions">
						<fragment v-if="true">
							<div class="question__decision" @click="answer('+')">
								<fa-icon icon="check" />
							</div>
							<div class="question__decision">
								|
							</div>
							<div class="question__decision" @click="answer('-')">
								<fa-icon icon="times" />
							</div>
						</fragment>
					</div>
				</div>
				<div v-else class="question">
					<div>
						<div class="question__title">
							<div class="title__content">Nie ma takiego użytkownika!</div>
						</div>
						<div class="question__offer">
							Może poszukamy kogoś innego?
						</div>
					</div>
					<div class="description">
						<Button content="Ok" type="text" @click="$router.push({name: 'Home'})" />
					</div>
				</div>
				<div class="description">
					<div v-if="questions">
						<fragment v-if="all < questions.length">
							<div class="description__progress">
								<div class="description__progress__bar" :style="{width: `${((all % questions.length) / questions.length) * 100}%` }" />
							</div>
							<div class="description__score">{{all}} / {{questions.length}}</div>
						</fragment>
						<fragment v-else>
							<Button content="Gotowe!" type="submit" />
						</fragment>
					</div>
				</div>
			</form>
		</div>
	</fragment>
</template>

<script>
	// import questions from '@/Assets/questions.json'
	import jwt from 'jsonwebtoken'
	import Button from '@/Components/Global/Button'
	export default {
		name: 'Answer',
		components: {
			Button
		},
		data() {
			return {
				friendNick: '-',
				windowWidth: window.innerWidth,
				questionPreview: false,
				username: '',
				questions: '...',
				ownerQuestions: [],
				activeIndex: 0,
				all: 0,
				results: {}
			}
		},
		mounted() {
			jwt.verify(this.$route.params.nick, this.$jwtPassword, (err, encoded) => {
				if (encoded) {
					this.friendNick = encoded
					this.$db.collection('quizzes').doc(this.friendNick).get().then(snap => {
						return snap.data() ? snap.data().questions : snap.data()
					}).then((result) => {
						const questions = [];
						this.ownerQuestions = result
						if (result) {
							result.forEach(question => {
								questions.push({
									refunds: question.refunds,
									img: question.img,
									answer: null
								})
							})
						}
						this.questions = questions.length ? questions : null
					})
				}
				else {
					console.error(err);
					this.questions = null;
				}
			})
			window.addEventListener('resize', () => {
				this.windowWidth = window.innerWidth
			});
		},
		beforeDestroy() { 
			window.removeEventListener('resize', () => {
				this.windowWidth = window.innerWidth
			}); 
		},
		methods: {
			shuffle(array) {
				for (let i = array.length - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));
					[array[i], array[j]] = [array[j], array[i]];
				}
				return array;
			},
			countAll() {
				let all = 0;
				this.questions.forEach(question => {
					if (question.answer) {
						all++
					}
				})
				this.all = all
			},
			answer(sign) {
				this.questions[this.activeIndex].answer = sign
				setTimeout(() => {
					this.indexUp()
					this.countAll()
				}, 500)
			},
			indexUp() {
				this.activeIndex < this.questions.length - 1 ? this.activeIndex++ : this.activeIndex = 0
				
			},
			indexDown() {
				this.activeIndex > 0 ? this.activeIndex-- : this.activeIndex = this.questions.length - 1
			},
			save() {
				this.$db.collection('quizzes').doc(this.friendNick).get().then(snap => {
					const users = snap.data().answers.map(answer => answer.username)
					users.push(snap.data().owner)
					if (!users.includes(this.username)) {
						const correct = []
						const incorrect = []
						this.ownerQuestions.forEach((question, index) => {
							if (this.questions[index].answer === question.answer) {
								correct.push(question)
							}
							else {
								incorrect.push(question)
							}
						})
						const percents = Number((correct.length / (correct.length + incorrect.length) * 100).toFixed(2))
						this.results = {
							correct,
							incorrect,
							percents,
							username: this.username,
							date: new Date()
						}
						this.$db.collection('quizzes').doc(this.friendNick).update({
							answers: this.$dbfield.arrayUnion(this.results)
						})
					}
					else if (this.username === snap.data().owner) {
						alert("Nie możesz nazywać sie tak samo jak właściciel!")
					}
					else {
						alert("Taki użytkownik znajuje się już w bazie!")
					}
				})


			}
		}
	}
</script>
<style lang="scss" scoped>
	.results-container {
		position: fixed;
		width: 100%;
		height: 100%;
		background-color: rgb($bg, 0.8);
		backdrop-filter: blur(10px);
		z-index: 2;
		@include scroll;
		.results {
			padding-top: 30px;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			.results__title {
				font-size: 35px;
				margin: 0;
				@include line;
			}
			.results__compare {
				display: grid;
				grid-template-columns: 1fr;
				grid-gap: 20px;
				margin: 20px 0;
				padding: 20px;
				@media (min-width: 1200px) {
					height: calc(100% - 250px);
					max-height: 750px;
					grid-template-columns: 1fr 1fr;
				}
				.compare__list {
					height: auto;
					width: 100%;
					max-width: 550px;
					display: flex;
					flex-direction: column;
					border: 3px solid $bg-light;
					padding: 20px;
					border-radius: 20px;
					list-style: none;
					@media (min-width: 1200px) {
						@include scroll;
					}
					&:nth-child(1) {
						.list__subtitle {
							&::first-letter {
								color: $correct;
							}
						}
						.answer, .sum__number {
							color: $correct;
						}
					}
					&:nth-child(2) {
						.list__subtitle {
							&::first-letter {
								color: $incorrect;
							}
						}
						.answer, .sum__number {
							color: $incorrect;
						}
					}
					@media (min-width: 1200px) {
						
						width: 100%;
					}
					.list__subtitle {
						margin: 10px 0;
					}
					.list__item {
						font-size: 20px;
						.question {
							display: block;
							width: calc(100%);
							@include ellipsis;
						}
						.answer {
							font-weight: bold;
						}
					}
					.list__sum {
						font-size: 23px;
						padding-top: 10px;
						font-weight: bold;
						@media (min-width: 1200px) {
							margin-top: auto;
						}
						.sum__number {
							font-weight: bold;
						}
					}
				}
			}
			.results__answer {
				padding-bottom: 50px;
				.answer__content {
					font-weight: bold;
					font-size: 25px;
					margin-bottom: 10px;
				}
				.results__percents {
					color: $decorative;
				}
			}
		}
	}
	.test-form {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 0px 0;
		.test-form__info {
			width: 100%;
			max-width: 500px;
			display: flex;
			justify-content: space-evenly;
			align-items: center;
			margin: 0 auto;
			.owner-name {
				width: 40%;
				height: 37px;
				font-size: 23px;
				font-weight: bold;
				@include ellipsis;
				&::first-letter {
					color: $decorative;
				}
			}
			.separation {
				font-size: 30px;
			}
			.input-name {
				width: 40%;
				background: none;
				border: none;
				border-bottom: 3px solid $decorative;
				text-align: center;
				font-size: 23px;
				font-weight: bold;
				outline: none;
				&::placeholder {
					transition: all 0.3s ease;
				}
				&:focus {
					&::placeholder {
						opacity: 0;
						transform: scale(0.5);
					}
				}
			}
		}
		.question {
			position: relative;
			width: 100%;
			max-width: 700px;
			height: calc(100% - 130px);
			max-height: 550px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			border: 3px solid $bg-light;
			padding: 10px 15px;
			margin: 10px auto;
			border-radius: 20px;
			transition: all 0.3s ease;
			@media (max-height: 500px) {
				display: none;
			}
			.question__title {
				width: 100%;
				&::first-letter {
					color: $decorative;
				}
				.title__content {
					width: 100%;
					font-size: 23px;
					font-weight: bold;
					user-select: none;
				}
				.title__content--ellipsis {
					@include ellipsis;
				}
				.title__icon {
					font-size: 23px;
					display: block;
					margin: -5px auto 0 auto;
					color: $secondary;
					@include hover;
				}
			}
			.question__offer {
				font-size: 20px;
				font-weight: bold;
			}
			.question__image {
				width: 90%;
				height: 100%;
				margin: 5px 0;
				border-radius: 20px;
			}
			.question__decisions {
				display: flex;
				align-items: center;
				height: 30px;
				.question__decision {
					margin: 0 10px;
					font-size: 30px;
					color: $decorative;
					transition: all 0.2s ease;
					cursor: default;
					&:first-child {
						font-size: 20px;
						@include hover {
							transform: scale(1.2);
							color: $correct;
						}
						@media (hover: none) {
							color: $correct;
						}
					}
					&:last-child {
						font-size: 20px;
						@include hover {
							transform: scale(1.2);
							color: $incorrect;
						}
						@media (hover: none) {
							color: $incorrect;
						}
					}
				}
				.selected {
					color: $decorative;
				}
			}
			.question__nav {
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				font-size: 30px;
				background-color: $bg;
				padding: 3px;
				transition: all 0.2s ease;
				color: $decorative;
				@include hover {
					svg {
						transition: all 0.1s ease;
						opacity: 0.7;
					}
				}
				&:nth-child(1) {
					left: -15px;
				}
				&:nth-child(2) {
					right: -15px;
				}
			}
		}
		.answer-yes {
			border: 3px solid rgb($correct, 0.5);
		}
		.answer-no {
			border: 3px solid rgb($incorrect, 0.5);
		}
		.description {
			width: 90%;
			max-width: 500px;
			height: 45px;
			margin-top: 5px;
			@media (max-height: 500px) {
				display: none;
			}
			.description__progress {
				position: relative;
				width: 100%;
				height: 5px;
				background-color: $bg-light;
				.description__progress__bar {
					position: absolute;
					top: 0;
					left: 0;
					width: 0%;
					height: 100%;
					background-color: $decorative;
					transition: all 0.3s ease;
				}
			}
			.description__score {
				font-size: 20px;
				font-weight: bold;
			}
		}
	}
</style>
