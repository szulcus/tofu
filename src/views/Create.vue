<template>
	<fragment>
		<div class="view" :style="{animation: !$loaded ? 'bottomElation 0.5s 1s both' : 'bottomElation 0.5s both'}">
			<form v-if="!quizLink" class="view__form" @submit.prevent="save">
				<input v-model="username" class="form__input" placeholder="Wpisz nick..." type="text" required />
				<div v-if="questions" :class="['form__question', {'answer-yes': questions[activeIndex].answer === '+', 'answer-no': questions[activeIndex].answer === '-'}]">
					<div class="question__nav" @click="indexDown">
						<fa-icon icon="angle-left" />
					</div>
					<div class="question__nav" @click="indexUp">
						<fa-icon icon="angle-right" />
					</div>
					<div class="question__edit" @click="createModalActive = !createModalActive">
						<fa-icon class="edit__icon" icon="edit" />
					</div>
					<div class="question__title" @click="questionPreview = !questionPreview">
						<div :class="['title__content', {'title__content--ellipsis': !questionPreview}]">{{questions[activeIndex].refunds.direct}}</div>
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
				<div class="description">
					<fragment v-if="all < 10">
						<div class="description__progress">
							<div class="progress__bar" :style="{width: `${(all % 10) * 10}%` }" />
						</div>
						<div class="description__score">{{all}} / 10</div>
					</fragment>
					<fragment v-else>
						<Button content="Utwórz!" type="submit" />
					</fragment>
				</div>
			</form>
			<div v-else class="quiz-link">
				<h1 class="quiz-link__title">Oto twój link:</h1>
				<input id="link-input" class="quiz-link__input" type="text" :value="quizLink">
				<div class="quiz-link__nav">
					<Button content="Skopiuj!" @click="copyLink" />
					<Button content="Sprawdź" @click="openLink" />
				</div>
			</div>
		</div>
		<CreateModal
			v-if="createModalActive"
			:refunds="questions[activeIndex].refunds"
			:img="questions[activeIndex].img"
			@close="createModalActive = !createModalActive"
			@update-answer="updateAnswer"
		/>
	</fragment>
</template>

<script>
	import jwt from 'jsonwebtoken';
	import questions from '@/Assets/questions.json'
	import Button from '@/Components/Global/Button'
	import CreateModal from '@/Components/Create/CreateModal.vue'

	export default {
		name: 'Create',
		components: {
			Button,
			CreateModal,
		},
		data() {
			return {
				windowWidth: window.innerWidth,
				questionPreview: false,
				username: '',
				questions: null,
				activeIndex: 0,
				all: 0,
				quizLink: '',
				createModalActive: false,
			}
		},
		mounted() {
			this.questions = this.shuffle(questions)
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
			updateAnswer(data) {
				this.questions[this.activeIndex] = {
					...this.questions[this.activeIndex],
					...data,
				}
				this.$forceUpdate();
			},
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
				console.log(this.questions[this.activeIndex])
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
				const ids = []
				this.$db.collection('quizzes').get().then(snaps => {
					snaps.forEach((snap) => {
						ids.push(snap.id)
					})
				}).then(() => {
					console.log(ids)
					if (!ids.includes(this.username)) {
						const all = [];
						this.questions.forEach(question => {
							if (question.answer) {
								all.push(question)
							}
						})
						console.log(this.$db.collection('quizzes').doc(this.username).set({
							owner: this.username,
							questions: all,
							answers: []
						}))
						this.quizLink = `${window.location.href}/${jwt.sign(encodeURI(this.username), this.$jwtPassword)}`
						this.$route.push({name: 'Home'})
					}
					else {
						alert("Taki użytkownik istnieje już w bazie!")
					}
				})
			},
			copyLink() {
				const element = document.getElementById('link-input');
				element.select();
				element.setSelectionRange(0, 99999)
				document.execCommand("copy");
			},
			openLink() {
				window.open(this.quizLink);
			}
		}
	}
</script>
<style lang="scss" scoped>
	.view__form {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 0px 0;
		.form__input {
			width: 80%;
			max-width: 500px;
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
		.form__question {
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
			.question__edit {
				position: absolute;
				right: -20px;
				top: -20px;
				width: 40px;
				height: 40px;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 50%;
				background-color: $bg-light;
				@include hover {
					.edit__icon {
						opacity: 0.7;
					}
				}
				.edit__icon {
					color: $decorative;
					transition: 0.2s ease;
				}
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
				.progress__bar {
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
	.quiz-link {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		animation: opacity 0.3s ease;
		.quiz-link__title {
			font-size: 30px;
			margin: 0;
			@include line;
		}
		.quiz-link__input {
			width: 80%;
			max-width: 500px;
			margin: 50px 0;
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
		.quiz-link__nav {
			display: flex;
			button {
				margin: 0 10px;
			}
		}
	}
</style>
