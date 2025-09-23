<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { inject } from '@vercel/analytics';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { browser } from '$app/environment';
	
	let mounted = false;
	
	onMount(() => {
		mounted = true;
		
		// Add smooth scrolling behavior
		document.documentElement.style.scrollBehavior = 'smooth';
		
		// Initialize analytics
		if (browser) {
			inject();
			injectSpeedInsights();
		}
		
		// Initialize WASM features detection
		initWASM();
		
		// Initialize theme system
		initTheme();
		
		// Register service worker for PWA
		registerServiceWorker();
	});
	
	async function initWASM() {
		try {
			// Check for WASM support and initialize performance-critical features
			if (typeof WebAssembly !== 'undefined') {
				console.log('✅ WebAssembly support detected');
				// Future WASM modules will be initialized here
			}
		} catch (error) {
			console.warn('WASM initialization failed:', error);
		}
	}
	
	function initTheme() {
		// Check for saved theme preference or default to 'dark'
		const savedTheme = localStorage.getItem('theme') || 'dark';
		document.documentElement.setAttribute('data-theme', savedTheme);
	}
	
	async function registerServiceWorker() {
		if ('serviceWorker' in navigator) {
			try {
				await navigator.serviceWorker.register('/sw.js');
				console.log('✅ Service Worker registered');
			} catch (error) {
				console.warn('Service Worker registration failed:', error);
			}
		}
	}
</script>

<svelte:head>
	<title>John Chezik - Platinum-Selling Songwriter-Singer & Guitar Player</title>
	<meta name="description" content="Official website of John Chezik - platinum-selling songwriter-singer, guitar player and published author with 6 albums and 2 books spanning decades of creating." />
	
	<!-- PWA Manifest -->
	<link rel="manifest" href="/manifest.json" />
	<meta name="theme-color" content="#007aff" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="apple-mobile-web-app-title" content="John Chezik" />
	<link rel="apple-touch-icon" href="/icon-192.png" />
</svelte:head>

<div class="app" class:mounted>
	<main>
		<slot />
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		opacity: 0;
		transition: opacity 0.3s ease-out;
	}
	
	.app.mounted {
		opacity: 1;
	}
	
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
	}
</style>
