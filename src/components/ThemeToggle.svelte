<script lang="ts">
	import { onMount } from 'svelte';
	import { Sun, Moon } from 'lucide-svelte';
	
	let currentTheme = 'dark';
	let mounted = false;
	
	onMount(() => {
		mounted = true;
		currentTheme = localStorage.getItem('theme') || 'dark';
		applyTheme(currentTheme);
	});
	
	function toggleTheme() {
		currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
		applyTheme(currentTheme);
		localStorage.setItem('theme', currentTheme);
	}
	
	function applyTheme(theme: string) {
		document.documentElement.setAttribute('data-theme', theme);
	}
</script>

<button 
	class="theme-toggle" 
	on:click={toggleTheme}
	aria-label="Toggle theme"
	class:mounted
>
	<div class="toggle-track">
		<div class="toggle-thumb" class:light={currentTheme === 'light'}>
			{#if currentTheme === 'dark'}
				<Moon size={14} />
			{:else}
				<Sun size={14} />
			{/if}
		</div>
	</div>
</button>

<style>
	.theme-toggle {
		background: none;
		border: none;
		cursor: pointer;
		padding: var(--space-xs);
		border-radius: var(--radius-lg);
		transition: all var(--transition-normal);
		opacity: 0;
		transform: scale(0.8);
	}
	
	.theme-toggle.mounted {
		opacity: 1;
		transform: scale(1);
	}
	
	.theme-toggle:hover {
		background: var(--glass-bg);
	}
	
	.toggle-track {
		width: 48px;
		height: 24px;
		background: var(--color-bg-secondary);
		border: 1px solid var(--glass-border);
		border-radius: 12px;
		position: relative;
		transition: all var(--transition-normal);
	}
	
	.toggle-thumb {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 18px;
		height: 18px;
		background: var(--color-accent-primary);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		transition: all var(--transition-normal);
		transform: translateX(0);
	}
	
	.toggle-thumb.light {
		transform: translateX(22px);
		background: #fbbf24;
	}
	
	.theme-toggle:hover .toggle-track {
		border-color: var(--color-accent-primary);
	}
</style>
