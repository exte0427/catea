<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { checkPostAccessAnswer, grantPostAccess } from '$lib/modules/postAccess';

	const dispatch = createEventDispatcher<{ success: void }>();

	let answer = '';
	let error = '';

	const submit = () => {
		if (checkPostAccessAnswer(answer)) {
			grantPostAccess();
			error = '';
			dispatch('success');
			return;
		}

		error = '정답이 아닙니다. 다시 입력해 주세요.';
	};
</script>

<div class="gate">
	<header class="page-header">
		<p class="label">글</p>
		<h1>질문에 답해 주세요</h1>
	</header>

	<p class="question">내가 가장 좋아하는 게임사는?</p>

	<form class="gate-form" on:submit|preventDefault={submit}>
		<input
			type="text"
			bind:value={answer}
			placeholder="답변 입력"
			autocomplete="off"
			aria-label="질문 답변"
		/>
		<button type="submit">확인</button>
	</form>

	{#if error}
		<p class="error">{error}</p>
	{/if}
</div>

<style lang="scss">
	@import '../scss/variable.scss';

	.gate {
		max-width: 560px;
		margin: 0 auto;
		padding: 48px 24px 80px;
	}

	.page-header {
		margin-bottom: 32px;
	}

	.label {
		font-size: 0.72rem;
		font-weight: 500;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba($black-color, 0.4);
		margin: 0 0 12px;
	}

	h1 {
		margin: 0;
		font-size: 1.6rem;
		font-weight: 700;
		color: $black-color;
		letter-spacing: -0.02em;
	}

	.question {
		margin: 0 0 20px;
		font-size: 1rem;
		font-weight: 500;
		line-height: 1.6;
		color: rgba($black-color, 0.82);
	}

	.gate-form {
		display: flex;
		gap: 10px;
	}

	input,
	button {
		font-family: inherit;
		font-size: 0.9rem;
		font-weight: 500;
		border-radius: 0;
	}

	input {
		flex: 1;
		min-width: 0;
		padding: 10px 14px;
		border: 1.5px solid rgba($black-color, 0.2);
		background: transparent;
		color: $black-color;

		&:focus {
			outline: none;
			border-color: rgba($black-color, 0.55);
		}
	}

	button {
		padding: 10px 18px;
		border: 1.5px solid $black-color;
		background: transparent;
		color: $black-color;
		cursor: pointer;
		transition: background-color 0.2s ease, color 0.2s ease;

		&:hover {
			background: $black-color;
			color: $white-color;
		}
	}

	.error {
		margin: 14px 0 0;
		font-size: 0.85rem;
		font-weight: 500;
		color: rgba($black-color, 0.55);
	}

	@media (max-width: 767px) {
		.gate {
			padding: 36px 20px 64px;
		}

		.gate-form {
			flex-direction: column;
		}

		button {
			width: 100%;
		}
	}
</style>
