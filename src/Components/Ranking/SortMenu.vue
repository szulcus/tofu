<template>
	<div class="sort-menu" id="sort-menu">
		<fragment v-if="active">
			<div class="sort-by sort-by--option" @click="changeSort('percents')">
				<fa-icon icon="star" />
			</div>
			<div class="sort-by sort-by--option" @click="changeSort('users')">
				<fa-icon icon="users" />
			</div>
			<div class="sort-by sort-by--option" @click="changeSort('owner')">
				<fa-icon icon="sort-alpha-down" />
			</div>
		</fragment>
		<fragment>
			<div
				:class="['sort-by', {'sort-by--active': active}]"
				v-if="sortedBy === 'percents'"
				@click="active = !active"
			>
				<fa-icon icon="star" />
			</div>
			<div
				:class="['sort-by', {'sort-by--active': active}]"
				v-else-if="sortedBy === 'users'"
				@click="active = !active"
			>
				<fa-icon icon="users" />
			</div>
			<div
				:class="['sort-by', {'sort-by--active': active}]"
				v-else-if="sortedBy === 'owner'"
				@click="active = !active"
			>
				<fa-icon icon="sort-alpha-down" />
			</div>
		</fragment>
	</div>
</template>

<script>
	export default {
		name: "SortMenu",
		props: {
			sortedBy: String
		},
		data() {
			return {
				active: false
			}
		},
		mounted() {
			window.addEventListener('click', (e) => {   
				if (!document.getElementById('sort-menu').contains(e.target)){
					this.active = false
				}
			});
		},
		methods: {
			changeSort(name) {
				this.$emit('change-sort', name);
				this.active = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.sort-menu {
		position: fixed;
		bottom: 20px;
		right: 20px;
		.sort-by {
			width: 50px;
			height: 50px;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 5px;
			border-radius: 50%;
			background-color: $decorative;
			color: $bg;
			font-size: 20px;
			transition: all 0.2s ease;
			@include hover {
				background-color: rgb($decorative, 0.7);
			}
		}
		.sort-by--option {
			&:nth-child(1) {
				animation: bounce 0.3s 0.2s both;
			}
			&:nth-child(2) {
				animation: bounce 0.3s 0.1s both;
			}
			&:nth-child(3) {
				animation: bounce 0.3s 0s both;
			}
		}
		.sort-by--active {
			transform: scale(0.7);
			opacity: 0.7;
			animation: none;
		}
	}
</style>