<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	
	export let audioElement: HTMLAudioElement | null = null;
	export let isPlaying = false;
	export let size = 'medium'; // 'small', 'medium', 'large'
	
	let canvas: HTMLCanvasElement;
	let canvasContext: CanvasRenderingContext2D;
	let audioContext: AudioContext;
	let analyser: AnalyserNode;
	let dataArray: Uint8Array | null = null;
	let source: MediaElementAudioSourceNode;
	let animationId: number;
	let isInitialized = false;
	
	const sizes = {
		small: { width: 120, height: 40, bars: 20 },
		medium: { width: 200, height: 60, bars: 32 },
		large: { width: 300, height: 80, bars: 48 }
	};
	
	const config = sizes[size as keyof typeof sizes] || sizes.medium;
	
	onMount(() => {
		if (canvas) {
			canvasContext = canvas.getContext('2d')!;
			canvas.width = config.width;
			canvas.height = config.height;
		}
	});
	
	onDestroy(() => {
		cleanup();
	});
	
	$: if (audioElement && isPlaying && !isInitialized) {
		initializeAudioContext();
	} else if (!isPlaying && animationId) {
		cancelAnimationFrame(animationId);
		drawIdleState();
	}
	
	async function initializeAudioContext() {
		if (!audioElement || isInitialized) return;
		
		try {
			// Create audio context
			audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
			
			// Create analyser node
			analyser = audioContext.createAnalyser();
			analyser.fftSize = 256;
			analyser.smoothingTimeConstant = 0.8;
			
			// Create source from audio element
			source = audioContext.createMediaElementSource(audioElement);
			
			// Connect nodes
			source.connect(analyser);
			analyser.connect(audioContext.destination);
			
			// Create data array
			const bufferLength = analyser.frequencyBinCount;
			dataArray = new Uint8Array(new ArrayBuffer(bufferLength) as ArrayBuffer);
			
			isInitialized = true;
			
			// Start visualization
			if (isPlaying) {
				animate();
			}
		} catch (error) {
			console.error('Failed to initialize audio context:', error);
		}
	}
	
	function animate() {
		if (!isPlaying || !analyser || !canvasContext || !dataArray) return;
		
		animationId = requestAnimationFrame(animate);
		
		// Get frequency data
		analyser.getByteFrequencyData(dataArray as any);
		
		// Clear canvas
		canvasContext.clearRect(0, 0, config.width, config.height);
		
		// Draw visualization
		drawBars();
	}
	
	function drawBars() {
		if (!dataArray) return;
		
		const barWidth = config.width / config.bars;
		const barGap = 1;
		const actualBarWidth = barWidth - barGap;
		
		// Get current theme
		const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
		
		for (let i = 0; i < config.bars; i++) {
			// Map frequency data to bar height
			const dataIndex = Math.floor((i / config.bars) * dataArray.length);
			const barHeight = (dataArray[dataIndex] / 255) * config.height * 0.8;
			
			// Create gradient for bars
			const gradient = canvasContext.createLinearGradient(0, config.height, 0, config.height - barHeight);
			
			if (isDark) {
				gradient.addColorStop(0, '#007aff');
				gradient.addColorStop(0.5, '#4da3ff');
				gradient.addColorStop(1, '#007aff');
			} else {
				gradient.addColorStop(0, '#007aff');
				gradient.addColorStop(0.5, '#0056cc');
				gradient.addColorStop(1, '#003d99');
			}
			
			canvasContext.fillStyle = gradient;
			
			// Draw bar
			const x = i * barWidth;
			const y = config.height - barHeight;
			
			canvasContext.fillRect(x, y, actualBarWidth, barHeight);
			
			// Add glow effect
			if (barHeight > config.height * 0.3) {
				canvasContext.shadowColor = '#007aff';
				canvasContext.shadowBlur = 10;
				canvasContext.fillRect(x, y, actualBarWidth, barHeight);
				canvasContext.shadowBlur = 0;
			}
		}
	}
	
	function drawIdleState() {
		if (!canvasContext) return;
		
		canvasContext.clearRect(0, 0, config.width, config.height);
		
		const barWidth = config.width / config.bars;
		const barGap = 1;
		const actualBarWidth = barWidth - barGap;
		
		// Get current theme
		const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
		const idleColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
		
		canvasContext.fillStyle = idleColor;
		
		// Draw idle bars with subtle animation
		for (let i = 0; i < config.bars; i++) {
			const baseHeight = config.height * 0.1;
			const waveOffset = Math.sin((Date.now() * 0.001) + (i * 0.2)) * 5;
			const barHeight = baseHeight + waveOffset;
			
			const x = i * barWidth;
			const y = config.height - barHeight;
			
			canvasContext.fillRect(x, y, actualBarWidth, barHeight);
		}
		
		// Continue idle animation
		if (!isPlaying) {
			requestAnimationFrame(drawIdleState);
		}
	}
	
	function cleanup() {
		if (animationId) {
			cancelAnimationFrame(animationId);
		}
		
		if (audioContext && audioContext.state !== 'closed') {
			audioContext.close();
		}
		
		isInitialized = false;
	}
	
	// Handle audio context resume (required by some browsers)
	function handleUserInteraction() {
		if (audioContext && audioContext.state === 'suspended') {
			audioContext.resume();
		}
	}
</script>

<svelte:window on:click={handleUserInteraction} on:keydown={handleUserInteraction} />

<div class="audio-visualizer" class:small={size === 'small'} class:medium={size === 'medium'} class:large={size === 'large'}>
	<canvas
		bind:this={canvas}
		class="visualizer-canvas"
		width={config.width}
		height={config.height}
	></canvas>
	
	{#if !isInitialized && audioElement}
		<div class="visualizer-placeholder">
			<div class="placeholder-bars">
				{#each Array(Math.min(config.bars, 16)) as _, i}
					<div 
						class="placeholder-bar" 
						style="animation-delay: {i * 50}ms"
					></div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.audio-visualizer {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-md);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		overflow: hidden;
	}
	
	.audio-visualizer.small {
		width: 120px;
		height: 40px;
	}
	
	.audio-visualizer.medium {
		width: 200px;
		height: 60px;
	}
	
	.audio-visualizer.large {
		width: 300px;
		height: 80px;
	}
	
	.visualizer-canvas {
		display: block;
		width: 100%;
		height: 100%;
	}
	
	.visualizer-placeholder {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}
	
	.placeholder-bars {
		display: flex;
		align-items: end;
		gap: 2px;
		height: 60%;
	}
	
	.placeholder-bar {
		width: 3px;
		height: 20%;
		background: var(--color-text-tertiary);
		border-radius: 1px;
		animation: pulse 1.5s ease-in-out infinite;
		opacity: 0.3;
	}
	
	@keyframes pulse {
		0%, 100% {
			height: 20%;
			opacity: 0.3;
		}
		50% {
			height: 80%;
			opacity: 0.6;
		}
	}
	
	
	/* Responsive design */
	@media (max-width: 480px) {
		.audio-visualizer.large {
			width: 200px;
			height: 60px;
		}
		
		.audio-visualizer.medium {
			width: 150px;
			height: 50px;
		}
	}
</style>
