<script lang="ts">
	import { onMount } from 'svelte';
	import { Menu, X, Search } from 'lucide-svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import SearchModal from './SearchModal.svelte';
	
	let isScrolled = false;
	let isMobileMenuOpen = false;
	let showSearchModal = false;
	
	const navItems = [
		{ href: '#home', label: 'Home' },
		{ href: '#albums', label: 'Albums' },
		{ href: '#books', label: 'Books' },
		{ href: '#blog', label: 'Blog' },
		{ href: '#about', label: 'About' },
		{ href: '#contact', label: 'Contact' }
	];
	
	onMount(() => {
		const handleScroll = () => {
			isScrolled = window.scrollY > 50;
		};
		
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
	
	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}
	
	function closeMobileMenu() {
		isMobileMenuOpen = false;
	}
	
	function handleNavClick(href: string) {
		closeMobileMenu();
		
		// Smooth scroll to section
		const element = document.querySelector(href);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}
	
	function openSearch() {
		showSearchModal = true;
	}
	
	function handleSearchNavigate(event: CustomEvent) {
		const section = event.detail;
		const element = document.querySelector(section);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
		showSearchModal = false;
	}
	
	// Handle keyboard shortcut for search
	function handleKeydown(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
			event.preventDefault();
			openSearch();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<nav class="navigation" class:scrolled={isScrolled}>
	<div class="container">
		<div class="nav-content">
			<!-- Logo -->
			<div class="logo">
				<a href="#home" on:click|preventDefault={() => handleNavClick('#home')}>
					<span class="logo-text">John Chezik</span>
				</a>
			</div>
			
			<!-- Desktop Navigation -->
			<div class="nav-right">
				<ul class="nav-links desktop-nav">
					{#each navItems as item}
						<li>
							<a 
								href={item.href} 
								on:click|preventDefault={() => handleNavClick(item.href)}
								class="nav-link"
							>
								{item.label}
							</a>
						</li>
					{/each}
				</ul>
				
				<button 
					class="search-button"
					on:click={openSearch}
					aria-label="Search (⌘K)"
					title="Search (⌘K)"
				>
					<Search size={18} />
				</button>
				
				<ThemeToggle />
			</div>
			
			<!-- Mobile Menu Button -->
			<button 
				class="mobile-menu-btn"
				on:click={toggleMobileMenu}
				aria-label="Toggle mobile menu"
			>
				{#if isMobileMenuOpen}
					<X size={24} />
				{:else}
					<Menu size={24} />
				{/if}
			</button>
		</div>
	</div>
	
	<!-- Mobile Navigation -->
	{#if isMobileMenuOpen}
		<div class="mobile-nav" class:open={isMobileMenuOpen}>
			<ul class="mobile-nav-links">
				{#each navItems as item}
					<li>
						<a 
							href={item.href} 
							on:click|preventDefault={() => handleNavClick(item.href)}
							class="mobile-nav-link"
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</nav>

<SearchModal 
	bind:isOpen={showSearchModal} 
	on:navigate={handleSearchNavigate}
	on:close={() => showSearchModal = false}
/>

<style>
	.navigation {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		padding: var(--space-md) 0;
		transition: all var(--transition-normal);
		background: transparent;
	}
	
	.navigation.scrolled {
		background: rgba(0, 0, 0, 0.8);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		padding: var(--space-sm) 0;
	}
	
	.nav-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.logo {
		z-index: 1001;
	}
	
	.logo a {
		text-decoration: none;
		color: var(--color-text-primary);
	}
	
	.logo-text {
		font-size: var(--text-xl);
		font-weight: 700;
		background: linear-gradient(135deg, #ffffff, #007aff);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	
	.nav-right {
		display: flex;
		align-items: center;
		gap: var(--space-lg);
	}
	
	.desktop-nav {
		display: flex;
		list-style: none;
		gap: var(--space-xl);
		margin: 0;
		padding: 0;
	}
	
	.nav-link {
		color: var(--color-text-secondary);
		text-decoration: none;
		font-weight: 500;
		font-size: var(--text-base);
		transition: all var(--transition-normal);
		position: relative;
		padding: var(--space-sm) 0;
	}
	
	.nav-link::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 0;
		height: 2px;
		background: var(--color-accent-primary);
		transition: width var(--transition-normal);
	}
	
	.nav-link:hover {
		color: var(--color-text-primary);
	}
	
	.nav-link:hover::after {
		width: 100%;
	}
	
	.search-button {
		background: none;
		border: none;
		color: var(--color-text-secondary);
		cursor: pointer;
		padding: var(--space-sm);
		border-radius: var(--radius-md);
		transition: all var(--transition-normal);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.search-button:hover {
		background: var(--glass-bg);
		color: var(--color-text-primary);
	}
	
	.mobile-menu-btn {
		display: none;
		background: none;
		border: none;
		color: var(--color-text-primary);
		cursor: pointer;
		padding: var(--space-sm);
		border-radius: var(--radius-md);
		transition: all var(--transition-normal);
		z-index: 1001;
	}
	
	.mobile-menu-btn:hover {
		background: var(--glass-bg);
	}
	
	.mobile-nav {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.95);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		opacity: 0;
		transform: translateY(-20px);
		transition: all var(--transition-normal);
		pointer-events: none;
	}
	
	.mobile-nav.open {
		opacity: 1;
		transform: translateY(0);
		pointer-events: all;
	}
	
	.mobile-nav-links {
		list-style: none;
		margin: 0;
		padding: var(--space-lg) 0;
	}
	
	.mobile-nav-link {
		display: block;
		color: var(--color-text-primary);
		text-decoration: none;
		font-weight: 500;
		font-size: var(--text-lg);
		padding: var(--space-md) var(--space-lg);
		transition: all var(--transition-normal);
		border-left: 3px solid transparent;
	}
	
	.mobile-nav-link:hover {
		background: var(--glass-bg);
		border-left-color: var(--color-accent-primary);
		color: var(--color-accent-primary);
	}
	
	@media (max-width: 768px) {
		.nav-right {
			display: none;
		}
		
		.mobile-menu-btn {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
