<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import {
		LACKING_OPTIONS,
		LIKERT_QUESTIONS,
		getSurveyBySession,
		submitSurveyResponse,
		type LackingOption,
		type LikertKey
	} from '$lib/analyze/survey';

	let answers: Record<LikertKey, number | null> = {
		mechanism: null,
		story: null,
		controls: null,
		combat: null
	};
	let lacking: LackingOption | '' = '';
	let feedback = '';
	let submitting = false;
	let done = false;
	let error = '';
	let alreadySubmitted = false;

	$: sessionId = (
		$page.url.searchParams.get('session_id') ||
		$page.url.searchParams.get('sessionId') ||
		''
	).trim();
	$: buildFromUrl = (
		$page.url.searchParams.get('build') ||
		$page.url.searchParams.get('build_version') ||
		''
	).trim();
	let buildOverride = '';
	$: build = buildOverride || buildFromUrl;
	$: ready = true;

	$: canSubmit =
		!submitting &&
		!done &&
		!!sessionId &&
		answers.mechanism != null &&
		answers.story != null &&
		answers.controls != null &&
		answers.combat != null &&
		!!lacking;

	onMount(async () => {
		if (!sessionId) return;
		try {
			const existing = await getSurveyBySession(sessionId);
			if (existing) {
				alreadySubmitted = true;
				const a = existing.answers || {};
				answers = {
					mechanism: Number(a.mechanism) || null,
					story: Number(a.story) || null,
					controls: Number(a.controls) || null,
					combat: Number(a.combat) || null
				};
				const lack = String(a.lacking || '');
				lacking = (LACKING_OPTIONS as readonly string[]).includes(lack)
					? (lack as LackingOption)
					: '';
				feedback = String(a.feedback || existing.freeText || '');
				if (!buildFromUrl && existing.build) buildOverride = existing.build;
			}
		} catch (err) {
			console.warn(err);
		}
	});

	const setLikert = (key: LikertKey, value: number) => {
		answers = { ...answers, [key]: value };
	};

	const onSubmit = async () => {
		error = '';
		if (!sessionId) {
			error = '세션 ID가 없습니다. 게임 내 설문 링크로 다시 열어 주세요.';
			return;
		}
		if (!canSubmit) {
			error = '필수 항목을 모두 선택해 주세요.';
			return;
		}
		submitting = true;
		try {
			await submitSurveyResponse({
				sessionId,
				build,
				answers: {
					mechanism: answers.mechanism!,
					story: answers.story!,
					controls: answers.controls!,
					combat: answers.combat!,
					lacking: lacking as LackingOption,
					feedback
				}
			});
			done = true;
			alreadySubmitted = true;
		} catch (err) {
			error = err instanceof Error ? err.message : String(err);
		} finally {
			submitting = false;
		}
	};
</script>

<svelte:head>
	<title>데모 설문 · DAMI</title>
</svelte:head>

<section class="survey">
	<header class="hero">
		<p class="eyebrow">DAMI · Demo survey</p>
		<h1>플레이 설문</h1>
		<p class="lead">짧은 응답이 다음 빌드를 바꿉니다. 데모 플레이 경험을 알려 주세요.</p>
		{#if ready}
			<div class="meta">
				{#if sessionId}
					<span>session <code>{sessionId}</code></span>
				{:else}
					<span class="warn">session_id 없음 — 게임 링크로 접속해 주세요</span>
				{/if}
				{#if build}
					<span>build <code>{build}</code></span>
				{/if}
			</div>
		{/if}
	</header>

	{#if done}
		<div class="done" role="status">
			<p class="done-title">제출되었습니다</p>
			<p>응답이 저장되었습니다. 창을 닫아도 됩니다. 감사합니다.</p>
			<a class="home" href="/dami">DAMI로 돌아가기</a>
		</div>
	{:else}
		<form class="form" on:submit|preventDefault={onSubmit}>
			{#each LIKERT_QUESTIONS as q}
				<fieldset class="block">
					<legend>{q.label}</legend>
					<p class="scale-hint">1 전혀 아니다 · 5 매우 그렇다</p>
					<div class="likert" role="radiogroup" aria-label={q.label}>
						{#each [1, 2, 3, 4, 5] as n}
							<button
								type="button"
								class="score"
								class:on={answers[q.key] === n}
								aria-pressed={answers[q.key] === n}
								on:click={() => setLikert(q.key, n)}
							>
								{n}
							</button>
						{/each}
					</div>
				</fieldset>
			{/each}

			<fieldset class="block">
				<legend>이 게임에 있어서 가장 부족한 부분이 뭐라고 생각하시나요?</legend>
				<div class="choices" role="radiogroup" aria-label="가장 부족한 부분">
					{#each LACKING_OPTIONS as opt}
						<button
							type="button"
							class="choice"
							class:on={lacking === opt}
							aria-pressed={lacking === opt}
							on:click={() => (lacking = opt)}
						>
							{opt}
						</button>
					{/each}
				</div>
			</fieldset>

			<label class="block feedback">
				<span class="label">피드백 (직접 작성)</span>
				<textarea
					bind:value={feedback}
					rows="5"
					placeholder="좋았던 점, 불편했던 점, 하고 싶은 말을 자유롭게 적어 주세요."
				></textarea>
			</label>

			{#if alreadySubmitted && !done}
				<p class="note">이 세션으로 이미 제출된 응답이 있습니다. 다시 제출하면 덮어씁니다.</p>
			{/if}
			{#if error}
				<p class="error">{error}</p>
			{/if}

			<button type="submit" class="submit" disabled={!canSubmit}>
				{submitting ? '제출 중…' : alreadySubmitted ? '다시 제출하기' : '설문 제출'}
			</button>
		</form>
	{/if}
</section>

<style lang="scss">
	@import '../../../lib/scss/variable.scss';
	@import '../../../lib/scss/responsive.scss';

	.survey {
		max-width: 720px;
		margin: 0 auto;
		padding: 28px 20px 96px;
		color: $black-color;
	}

	.hero {
		margin-bottom: 28px;
		padding-bottom: 22px;
		border-bottom: 1px solid rgba($black-color, 0.12);
		background:
			radial-gradient(80% 120% at 0% 0%, rgba($semi-black-color, 0.08), transparent 60%),
			transparent;
	}

	.eyebrow {
		margin: 0 0 8px;
		font-size: 0.72rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba($black-color, 0.45);
	}

	h1 {
		margin: 0 0 8px;
		padding: 0;
		font-size: clamp(1.6rem, 4vw, 2.1rem);
		font-weight: 700;
	}

	.lead {
		margin: 0 0 14px;
		font-size: 0.95rem;
		line-height: 1.5;
		color: rgba($black-color, 0.7);
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 10px 16px;
		font-size: 0.8rem;
		color: rgba($black-color, 0.55);
	}

	.meta code {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.78rem;
	}

	.warn {
		color: #8a3a32;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 22px;
	}

	.block {
		margin: 0;
		padding: 0;
		border: 0;
	}

	legend,
	.label {
		display: block;
		margin-bottom: 10px;
		font-size: 1rem;
		font-weight: 700;
	}

	.scale-hint {
		margin: -4px 0 12px;
		font-size: 0.78rem;
		color: rgba($black-color, 0.45);
	}

	.likert,
	.choices {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.score,
	.choice,
	.submit,
	.home {
		appearance: none;
		font: inherit;
		cursor: pointer;
		border: 1.5px solid rgba($black-color, 0.3);
		background: transparent;
		color: $black-color;
		transition:
			background 0.2s ease,
			color 0.2s ease,
			border-color 0.2s ease,
			transform 0.15s ease;
	}

	.score {
		width: 48px;
		height: 48px;
		border-radius: 4px;
		font-weight: 700;
		font-size: 1.05rem;
	}

	.choice {
		padding: 12px 16px;
		border-radius: 4px;
		font-weight: 700;
	}

	.score:hover,
	.choice:hover {
		transform: translateY(-1px);
		background: rgba($black-color, 0.05);
	}

	.score.on,
	.choice.on {
		background: $semi-black-color;
		border-color: $semi-black-color;
		color: $white-color;
	}

	textarea {
		width: 100%;
		box-sizing: border-box;
		padding: 14px;
		border: 1.5px solid rgba($black-color, 0.25);
		border-radius: 4px;
		background: rgba($white-color, 0.7);
		color: $black-color;
		font: inherit;
		line-height: 1.5;
		resize: vertical;
		min-height: 120px;
	}

	textarea:focus {
		outline: 2px solid rgba($black-color, 0.35);
		outline-offset: 1px;
	}

	.note {
		margin: 0;
		font-size: 0.85rem;
		color: rgba($black-color, 0.55);
	}

	.error {
		margin: 0;
		padding: 12px;
		border: 1.5px solid rgba(#8a3a32, 0.35);
		color: #8a3a32;
		font-size: 0.9rem;
	}

	.submit {
		align-self: flex-start;
		padding: 14px 22px;
		border-radius: 4px;
		background: $semi-black-color;
		border-color: $semi-black-color;
		color: $white-color;
		font-weight: 700;
		font-size: 1rem;
	}

	.submit:hover:not(:disabled) {
		transform: translateY(-1px);
	}

	.submit:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.done {
		padding: 28px 0;
		animation: rise 0.45s ease both;
	}

	.done-title {
		margin: 0 0 8px;
		font-size: 1.35rem;
		font-weight: 700;
	}

	.done p {
		margin: 0 0 18px;
		color: rgba($black-color, 0.7);
	}

	.home {
		display: inline-flex;
		padding: 12px 18px;
		text-decoration: none;
		font-weight: 700;
		box-shadow: none;
		background: $semi-black-color;
		color: $white-color;
		border-color: $semi-black-color;
	}

	.home:hover {
		box-shadow: none;
		transform: translateY(-1px);
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@include mobile {
		.score {
			width: 44px;
			height: 44px;
		}
	}
</style>
