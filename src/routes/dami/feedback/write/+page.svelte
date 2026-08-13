<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { Server } from '$lib/modules/firebase';
	import LoadingBar from '$lib/sources/LoadingBar.svelte';
	import {
		formatDamiDuration,
		getDamiAuthorId,
		hashDamiPassword
	} from '$lib/modules/damiAuth';

	const MAX_RECORD_MS = 60 * 60 * 1000;
	const TARGET_W = 1280;
	const TARGET_H = 720;
	const TARGET_FPS = 30;
	const TARGET_BITRATE = 2_500_000;

	let previewEl: HTMLVideoElement | null = null;
	let sourceVideoEl: HTMLVideoElement | null = null;
	let canvasEl: HTMLCanvasElement | null = null;
	let displayStream: MediaStream | null = null;
	let recordStream: MediaStream | null = null;
	let mediaRecorder: MediaRecorder | null = null;
	let recordedChunks: BlobPart[] = [];
	let recordedBlob: Blob | null = null;
	let recordedUrl = '';
	let isRecording = false;
	let recordStartedAt = 0;
	let elapsedMs = 0;
	let elapsedTimer: ReturnType<typeof setInterval> | null = null;
	let stopFallbackTimer: ReturnType<typeof setTimeout> | null = null;
	let drawRaf = 0;

	let nickname = '';
	let password = '';
	let feedbackBody = '';
	let authorId = '';
	let submitState: 'idle' | 'uploading' | 'done' | 'error' = 'idle';
	let submitMessage = '';
	let uploadFailed = false;
	let uploadProgress: number | null = null;

	$: canSubmit = !!recordedBlob && !isRecording && submitState !== 'uploading';
	$: passwordDisabled = !nickname.trim();
	$: showDownload = !!recordedBlob && !isRecording;

	onMount(() => {
		authorId = getDamiAuthorId();
		sourceVideoEl = document.createElement('video');
		sourceVideoEl.muted = true;
		sourceVideoEl.playsInline = true;
		canvasEl = document.createElement('canvas');
		canvasEl.width = TARGET_W;
		canvasEl.height = TARGET_H;
	});

	$: if (passwordDisabled && password) {
		password = '';
	}

	const clearRecorded = () => {
		if (recordedUrl) URL.revokeObjectURL(recordedUrl);
		recordedUrl = '';
		recordedBlob = null;
		recordedChunks = [];
		uploadFailed = false;
	};

	const stopElapsed = () => {
		if (elapsedTimer) {
			clearInterval(elapsedTimer);
			elapsedTimer = null;
		}
	};

	const stopDrawLoop = () => {
		if (drawRaf) {
			cancelAnimationFrame(drawRaf);
			drawRaf = 0;
		}
	};

	const drawLoop = () => {
		if (!canvasEl || !sourceVideoEl) return;
		const ctx = canvasEl.getContext('2d');
		if (!ctx) return;

		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, TARGET_W, TARGET_H);

		const vw = sourceVideoEl.videoWidth || TARGET_W;
		const vh = sourceVideoEl.videoHeight || TARGET_H;
		const scale = Math.min(TARGET_W / vw, TARGET_H / vh);
		const dw = vw * scale;
		const dh = vh * scale;
		const dx = (TARGET_W - dw) / 2;
		const dy = (TARGET_H - dh) / 2;
		ctx.drawImage(sourceVideoEl, dx, dy, dw, dh);

		drawRaf = requestAnimationFrame(drawLoop);
	};

	const showRecordedPreview = (blob: Blob) => {
		if (recordedUrl) URL.revokeObjectURL(recordedUrl);
		recordedBlob = blob;
		recordedUrl = URL.createObjectURL(blob);
		if (previewEl) {
			previewEl.srcObject = null;
			previewEl.src = recordedUrl;
			previewEl.muted = false;
			previewEl.load();
		}
	};

	const cleanupCapture = () => {
		stopDrawLoop();
		displayStream?.getTracks().forEach((t) => t.stop());
		recordStream?.getTracks().forEach((t) => t.stop());
		displayStream = null;
		recordStream = null;
		if (sourceVideoEl) {
			sourceVideoEl.srcObject = null;
		}
	};

	const finalizeRecording = () => {
		if (stopFallbackTimer) {
			clearTimeout(stopFallbackTimer);
			stopFallbackTimer = null;
		}
		stopElapsed();
		elapsedMs = Math.max(elapsedMs, Date.now() - recordStartedAt);
		isRecording = false;
		cleanupCapture();

		const type = mediaRecorder?.mimeType || 'video/webm';
		const blob = new Blob(recordedChunks, { type });
		if (blob.size > 0) showRecordedPreview(blob);
		else {
			submitMessage = '녹화된 데이터가 없습니다. 다시 녹화해 주세요.';
			submitState = 'error';
		}
		mediaRecorder = null;
	};

	const pickMimeType = () => {
		const candidates = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
		return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? '';
	};

	const startRecording = async () => {
		submitState = 'idle';
		submitMessage = '';
		uploadFailed = false;
		clearRecorded();
		recordedChunks = [];

		try {
			const stream = await navigator.mediaDevices.getDisplayMedia({
				video: {
					width: { ideal: TARGET_W },
					height: { ideal: TARGET_H },
					frameRate: { ideal: TARGET_FPS }
				},
				audio: false
			});
			displayStream = stream;

			if (!sourceVideoEl || !canvasEl) {
				throw new Error('recorder not ready');
			}

			sourceVideoEl.srcObject = stream;
			await sourceVideoEl.play().catch(() => undefined);
			drawLoop();

			recordStream = canvasEl.captureStream(TARGET_FPS);
			if (previewEl) {
				previewEl.removeAttribute('src');
				previewEl.srcObject = recordStream;
				previewEl.muted = true;
				await previewEl.play().catch(() => undefined);
			}

			stream.getVideoTracks()[0]?.addEventListener('ended', () => {
				if (isRecording) {
					try {
						mediaRecorder?.requestData();
						mediaRecorder?.stop();
					} catch {
						finalizeRecording();
					}
				}
			});

			const mimeType = pickMimeType();
			mediaRecorder = mimeType
				? new MediaRecorder(recordStream, {
						mimeType,
						videoBitsPerSecond: TARGET_BITRATE
					})
				: new MediaRecorder(recordStream, { videoBitsPerSecond: TARGET_BITRATE });

			mediaRecorder.ondataavailable = (event) => {
				if (event.data && event.data.size > 0) {
					recordedChunks = [...recordedChunks, event.data];
				}
			};
			mediaRecorder.onstop = () => finalizeRecording();

			recordStartedAt = Date.now();
			elapsedMs = 0;
			stopElapsed();
			elapsedTimer = setInterval(() => {
				elapsedMs = Date.now() - recordStartedAt;
				if (elapsedMs >= MAX_RECORD_MS && isRecording) {
					stopRecording();
					submitMessage = '최대 녹화 시간(1시간)에 도달해 녹화를 종료했습니다.';
				}
			}, 250);

			mediaRecorder.start(500);
			isRecording = true;
		} catch (err) {
			console.error(err);
			cleanupCapture();
			submitMessage = '녹화가 취소되었거나 지원되지 않습니다.';
			submitState = 'error';
		}
	};

	const stopRecording = () => {
		if (!mediaRecorder) {
			isRecording = false;
			return;
		}
		if (mediaRecorder.state === 'inactive') {
			finalizeRecording();
			return;
		}
		try {
			if (mediaRecorder.state === 'recording') mediaRecorder.requestData();
			mediaRecorder.stop();
		} catch {
			finalizeRecording();
			return;
		}
		if (stopFallbackTimer) clearTimeout(stopFallbackTimer);
		stopFallbackTimer = setTimeout(() => {
			if (isRecording) finalizeRecording();
		}, 800);
	};

	const downloadRecording = () => {
		if (!recordedBlob || !recordedUrl) return;
		const a = document.createElement('a');
		a.href = recordedUrl;
		a.download = `dami-feedback-${Date.now()}.webm`;
		a.click();
	};

	const submitFeedback = async () => {
		if (!recordedBlob) {
			submitMessage = '녹화가 필수입니다.';
			submitState = 'error';
			return;
		}
		if (elapsedMs > MAX_RECORD_MS) {
			submitMessage = '최대 1시간까지만 제출할 수 있습니다.';
			submitState = 'error';
			uploadFailed = true;
			return;
		}
		if (!authorId) authorId = getDamiAuthorId();

		submitState = 'uploading';
		submitMessage = '제출 중…';
		uploadFailed = false;
		uploadProgress = 0;
		try {
			const passwordHash = password.trim() ? await hashDamiPassword(password) : '';
			await Server.submitDamiFeedback(
				{
					authorId,
					body: feedbackBody.trim(),
					nickname: nickname.trim(),
					passwordHash,
					durationMs: elapsedMs,
					blob: recordedBlob
				},
				(percent) => {
					uploadProgress = percent;
				}
			);
			uploadProgress = 100;
			submitState = 'done';
			submitMessage = '제출이 완료되었습니다. 감사합니다';
			clearRecorded();
		} catch (err) {
			console.error(err);
			submitState = 'error';
			uploadFailed = true;
			uploadProgress = null;
			const raw =
				err instanceof Error && err.message
					? err.message
					: typeof err === 'string'
						? err
						: '알 수 없는 오류';
			let hint = raw;
			if (raw.includes('auth/admin-restricted-operation') || raw.includes('auth/operation-not-allowed')) {
				hint = '로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.';
			} else if (raw.includes('storage/unauthorized') || raw.includes('permission-denied')) {
				hint = '업로드 권한이 잠시 막혀 있습니다. 새로고침 후 다시 시도해 주세요.';
			} else if (raw.includes('402') || raw.includes('billing') || raw.includes('quota')) {
				hint = 'Firebase 용량/결제(Blaze) 한도에 걸린 것 같습니다.';
			} else if (raw.includes('canceled') || raw.includes('network')) {
				hint = '네트워크 문제로 업로드가 중단되었습니다. 다운로드 후 다시 시도해 주세요.';
			}
			submitMessage = `제출에 실패했습니다. ${hint}`;
		}
	};

	onDestroy(() => {
		cleanupCapture();
		stopElapsed();
		if (stopFallbackTimer) clearTimeout(stopFallbackTimer);
		clearRecorded();
	});
</script>

<svelte:head>
	<title>피드백 작성 · DAMI</title>
</svelte:head>

<div class="content">
	<section class="block">
		{#if submitState === 'done'}
			<div class="success">
				<p class="success-msg">제출이 완료되었습니다. 감사합니다</p>
				<a class="success-link" href="/dami/feedback">목록으로</a>
			</div>
		{:else}
			<div class="howto">
				<p class="howto-title">피드백 하는 방법</p>
				<ol class="howto-list">
					<li>상단 데모/플레이 풀 영상 받기, 혹은 직접 제공된 데모를 다운받습니다</li>
					<li>플레이 영상을 웹 상의 녹화 도구로 촬영합니다</li>
					<li>피드백 제출을 누릅니다</li>
				</ol>
				<p class="howto-meta">녹화: 720p · 최대 1시간</p>
			</div>

			<div class="share-stage">
				<video
					bind:this={previewEl}
					class="share-preview"
					class:empty={!isRecording && !recordedUrl}
					controls={!!recordedUrl && !isRecording}
					autoplay
					playsinline
					muted={!recordedUrl}
				></video>
				{#if !isRecording && !recordedUrl}
					<p class="share-placeholder">녹화를 시작하면 여기에 미리보기가 표시됩니다.</p>
				{/if}
				{#if isRecording}
					<span class="rec-badge">REC {formatDamiDuration(elapsedMs)} / 01:00:00</span>
				{/if}
			</div>

			<div class="actions">
				{#if isRecording}
					<button type="button" class="action-btn action-btn--danger" on:click={stopRecording}>
						녹화 중지
					</button>
				{:else if recordedUrl}
					<button type="button" class="action-btn" on:click={startRecording}>재녹화</button>
				{:else}
					<button type="button" class="action-btn action-btn--primary" on:click={startRecording}>
						녹화 시작
					</button>
				{/if}
				{#if showDownload}
					<button type="button" class="action-btn" on:click={downloadRecording}>영상 다운로드</button>
				{/if}
				{#if recordedBlob && !isRecording}
					<p class="meta">녹화 완료 · 720p · {formatDamiDuration(elapsedMs)}</p>
				{/if}
			</div>

			<div class="cred-row">
				<label>
					<span>닉네임</span>
					<input type="text" bind:value={nickname} placeholder="선택" maxlength="40" />
				</label>
				<label class:disabled={passwordDisabled}>
					<span>비밀번호</span>
					<input
						type="password"
						bind:value={password}
						placeholder={passwordDisabled ? '닉네임 먼저 입력해주세요' : '선택'}
						maxlength="64"
						disabled={passwordDisabled}
					/>
				</label>
			</div>
			<p class="hint">향후 수정 및 삭제를 위한 닉네임, 비밀번호 입력란 입니다</p>

			<label class="body-label">
				<span>피드백 글 (선택)</span>
				<textarea
					bind:value={feedbackBody}
					placeholder="짧은 피드백을 남겨 주세요."
					rows="3"
					maxlength="2000"
				></textarea>
			</label>

			<div class="submit-footer">
				{#if submitState === 'uploading'}
					<LoadingBar label="제출 중" progress={uploadProgress} />
				{:else}
					<button
						type="button"
						class="action-btn action-btn--primary"
						disabled={!canSubmit}
						on:click={submitFeedback}
					>
						피드백 제출
					</button>
				{/if}
				<p class="status" class:error={submitState === 'error'}>
					{#if submitState === 'uploading'}
						영상을 업로드하고 있습니다…
					{:else if submitState === 'error'}
						{submitMessage}
					{:else if recordedBlob}
						제출 여부: 녹화 준비됨
					{:else}
						제출 여부: 녹화 후 제출 가능
					{/if}
				</p>
				{#if uploadFailed && showDownload}
					<button type="button" class="action-btn action-btn--download" on:click={downloadRecording}>
						실패 대비 · 영상 다운로드
					</button>
				{/if}
			</div>
		{/if}
	</section>
</div>

<style lang="scss">
	@import '../../../../lib/scss/dami.scss';

	.content {
		max-width: 960px;
		margin: 0 auto;
		padding: 40px 24px 0;
	}

	.howto {
		margin-bottom: 28px;
	}

	.howto-title {
		margin: 0 0 14px;
		font-size: 1.15rem;
		font-weight: 700;
		color: $black-color;
	}

	.howto-list {
		margin: 0 0 10px;
		padding-left: 1.25rem;
		font-size: 0.95rem;
		line-height: 1.75;
		color: rgba($black-color, 0.72);
	}

	.howto-meta {
		margin: 0;
		font-size: 0.82rem;
		color: rgba($black-color, 0.45);
	}

	.success {
		padding: 48px 8px;
		text-align: center;
	}

	.success-msg {
		margin: 0 0 24px;
		font-size: clamp(1.2rem, 3.5vw, 1.6rem);
		font-weight: 700;
		line-height: 1.5;
		color: $black-color;
	}

	.success-link {
		display: inline-flex !important;
		padding: 10px 18px !important;
		border: 1.5px solid rgba($black-color, 0.28) !important;
		border-radius: 14px !important;
		background: transparent !important;
		color: $black-color !important;
		text-decoration: none !important;
		font-size: 0.92rem;
		box-shadow: none !important;
	}

	.share-stage {
		position: relative;
		aspect-ratio: 16 / 9;
		background: #141414;
		border: 1.5px solid rgba($black-color, 0.18);
		overflow: hidden;
		margin-bottom: 16px;
	}

	.share-preview {
		display: block !important;
		width: 100% !important;
		height: 100% !important;
		max-width: none !important;
		margin: 0 !important;
		object-fit: contain;
		background: #141414;
		box-shadow: none !important;
		border-radius: 0 !important;

		&.empty {
			opacity: 0.25;
		}
	}

	.share-placeholder {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0;
		padding: 24px;
		text-align: center;
		color: rgba(255, 255, 255, 0.72);
		pointer-events: none;
	}

	.rec-badge {
		position: absolute;
		top: 12px;
		left: 12px;
		padding: 6px 10px;
		background: #c0392b;
		color: #fff;
		font-size: 0.75rem;
		font-weight: 700;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px;
		margin-bottom: 24px;
	}

	.meta {
		margin: 0;
		font-size: 0.85rem;
		color: rgba($black-color, 0.55);
	}

	.cred-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		margin-bottom: 8px;

		label {
			display: flex;
			flex-direction: column;
			gap: 6px;
			font-size: 0.72rem;
			color: rgba($black-color, 0.55);

			&.disabled {
				opacity: 0.45;
			}
		}

		input {
			padding: 10px 12px;
			border: 1.5px solid rgba($black-color, 0.22);
			font-family: inherit;
			font-size: 0.9rem;
		}
	}

	.hint {
		margin: 0 0 20px;
		font-size: 0.78rem;
		line-height: 1.5;
		color: rgba($black-color, 0.45);
	}

	.body-label {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-bottom: 22px;
		font-size: 0.72rem;
		color: rgba($black-color, 0.55);

		textarea {
			padding: 10px 12px;
			border: 1.5px solid rgba($black-color, 0.22);
			font-family: inherit;
			font-size: 0.88rem;
			resize: vertical;
			min-height: 72px;
		}
	}

	.submit-footer {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
		padding-top: 18px;
		border-top: 1px solid rgba($black-color, 0.12);
	}

	.status {
		margin: 0;
		font-size: 0.9rem;
		color: rgba($black-color, 0.55);

		&.error {
			color: #c0392b;
		}
	}

	.action-btn {
		padding: 10px 16px;
		border: 1.5px solid rgba($black-color, 0.28);
		background: transparent;
		color: $black-color;
		font-family: inherit;
		font-size: 0.9rem;
		cursor: pointer;

		&:hover:not(:disabled) {
			background: $black-color;
			color: $white-color;
		}

		&:disabled {
			opacity: 0.4;
			cursor: not-allowed;
		}
	}

	.action-btn--primary {
		background: $black-color;
		color: $white-color;
		border-color: $black-color;
	}

	.action-btn--danger {
		border-color: #c0392b;
		color: #c0392b;

		&:hover:not(:disabled) {
			background: #c0392b;
			color: #fff;
		}
	}

	.action-btn--download {
		border-color: #1f7a4d;
		color: #1f7a4d;

		&:hover:not(:disabled) {
			background: #1f7a4d;
			color: #fff;
		}
	}

	@media (max-width: 640px) {
		.cred-row {
			grid-template-columns: 1fr;
		}
	}
</style>
