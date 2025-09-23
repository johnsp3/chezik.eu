<script lang="ts">
	import { Search, X, Music, BookOpen, User, Clock } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	
	const dispatch = createEventDispatcher();
	
	export let isOpen = false;
	
	let searchQuery = '';
	let searchResults: any[] = [];
	let isSearching = false;
	let searchInput: HTMLInputElement;
	
	// Sample searchable content - in a real app, this would come from a search API
	const searchableContent = [
		// Albums
		{ type: 'album', title: "Don't Say It's Over", description: 'Hard Rock • 2025', section: '#albums', icon: Music },
		{ type: 'album', title: 'The Visual Man', description: 'Hard Rock • 2024', section: '#albums', icon: Music },
		{ type: 'album', title: 'The Revealing', description: 'Hard Rock/Blues/Instrumental • 2023', section: '#albums', icon: Music },
		{ type: 'album', title: 'Look At Me', description: 'Hard Rock • 2022', section: '#albums', icon: Music },
		{ type: 'album', title: 'My Life', description: 'Soft/Acoustic • 2021', section: '#albums', icon: Music },
		{ type: 'album', title: 'Something More', description: 'Soft/Piano • 2020', section: '#albums', icon: Music },
		
		// Books
		{ type: 'book', title: 'The Visual Man', description: 'Psychology • 2025', section: '#books', icon: BookOpen },
		{ type: 'book', title: 'The Alpha Code', description: 'Self-Development • 2024', section: '#books', icon: BookOpen },
		
		// About content
		{ type: 'about', title: 'About John Chezik', description: 'Biography and career journey', section: '#about', icon: User },
		{ type: 'about', title: 'Creative Timeline', description: 'Decades of musical and literary work', section: '#about', icon: Clock },
		{ type: 'about', title: 'Skills & Expertise', description: 'Musical and writing capabilities', section: '#about', icon: User },
		
		// Contact
		{ type: 'contact', title: 'Professional Contact', description: 'Get in touch for business inquiries', section: '#contact', icon: User },
	];
	
	$: if (isOpen && searchInput) {
		setTimeout(() => searchInput.focus(), 100);
	}
	
	$: if (searchQuery.length >= 2) {
		performSearch();
	} else {
		searchResults = [];
	}
	
	async function performSearch() {
		isSearching = true;
		
		// Simulate search delay
		await new Promise(resolve => setTimeout(resolve, 200));
		
		const query = searchQuery.toLowerCase();
		searchResults = searchableContent.filter(item =>
			item.title.toLowerCase().includes(query) ||
			item.description.toLowerCase().includes(query) ||
			item.type.toLowerCase().includes(query)
		);
		
		isSearching = false;
	}
	
	function selectResult(result: any) {
		dispatch('navigate', result.section);
		closeModal();
	}
	
	function closeModal() {
		isOpen = false;
		searchQuery = '';
		searchResults = [];
		dispatch('close');
	}
	
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}
	
	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			closeModal();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<div class="search-overlay" on:click={handleBackdropClick} on:keydown={(e) => e.key === 'Escape' && closeModal()} role="button" tabindex="0" aria-label="Close search">
		<div class="search-modal" role="dialog" aria-modal="true" aria-labelledby="search-title">
			<div class="search-header">
				<h2 id="search-title" class="search-title">Search</h2>
				<button class="close-button" on:click={closeModal} aria-label="Close search">
					<X size={20} />
				</button>
			</div>
			
			<div class="search-input-container">
				<div class="search-icon">
					<Search size={20} />
				</div>
				<input
					bind:this={searchInput}
					bind:value={searchQuery}
					type="text"
					placeholder="Search albums, books, or content..."
					class="search-input"
					aria-label="Search query"
				/>
				{#if searchQuery}
					<button class="clear-button" on:click={() => searchQuery = ''} aria-label="Clear search">
						<X size={16} />
					</button>
				{/if}
			</div>
			
			<div class="search-results">
				{#if isSearching}
					<div class="search-loading">
						<div class="spinner"></div>
						<span>Searching...</span>
					</div>
				{:else if searchQuery.length >= 2 && searchResults.length === 0}
					<div class="no-results">
						<Search size={24} />
						<p>No results found for "{searchQuery}"</p>
						<p class="no-results-hint">Try searching for albums, books, or general content</p>
					</div>
				{:else if searchResults.length > 0}
					<div class="results-list">
						{#each searchResults as result, index}
							<button
								class="result-item"
								on:click={() => selectResult(result)}
								aria-label="Go to {result.title}"
							>
								<div class="result-icon" class:album={result.type === 'album'} class:book={result.type === 'book'} class:about={result.type === 'about'} class:contact={result.type === 'contact'}>
									<svelte:component this={result.icon} size={16} />
								</div>
								<div class="result-content">
									<div class="result-title">{result.title}</div>
									<div class="result-description">{result.description}</div>
								</div>
								<div class="result-type">{result.type}</div>
							</button>
						{/each}
					</div>
				{:else}
					<div class="search-suggestions">
						<h3 class="suggestions-title">Quick Links</h3>
						<div class="suggestions-list">
							<button class="suggestion-item" on:click={() => selectResult({section: '#albums'})}>
								<Music size={16} />
								<span>Browse Albums</span>
							</button>
							<button class="suggestion-item" on:click={() => selectResult({section: '#books'})}>
								<BookOpen size={16} />
								<span>Browse Books</span>
							</button>
							<button class="suggestion-item" on:click={() => selectResult({section: '#about'})}>
								<User size={16} />
								<span>About John</span>
							</button>
							<button class="suggestion-item" on:click={() => selectResult({section: '#contact'})}>
								<User size={16} />
								<span>Contact</span>
							</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.search-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.8);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		z-index: 1000;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: var(--space-4xl) var(--space-md);
		animation: fadeIn 0.2s ease-out;
	}
	
	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	
	.search-modal {
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-xl);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		width: 100%;
		max-width: 600px;
		max-height: 80vh;
		overflow: hidden;
		animation: slideIn 0.3s ease-out;
	}
	
	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	.search-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-lg) var(--space-xl);
		border-bottom: 1px solid var(--glass-border);
	}
	
	.search-title {
		font-size: var(--text-lg);
		font-weight: 700;
		color: var(--color-text-primary);
		margin: 0;
	}
	
	.close-button {
		background: none;
		border: none;
		color: var(--color-text-secondary);
		cursor: pointer;
		padding: var(--space-sm);
		border-radius: var(--radius-md);
		transition: all var(--transition-normal);
	}
	
	.close-button:hover {
		background: var(--color-bg-elevated);
		color: var(--color-text-primary);
	}
	
	.search-input-container {
		position: relative;
		padding: var(--space-lg) var(--space-xl);
		border-bottom: 1px solid var(--glass-border);
	}
	
	.search-icon {
		position: absolute;
		left: calc(var(--space-xl) + var(--space-md));
		top: 50%;
		transform: translateY(-50%);
		color: var(--color-text-tertiary);
	}
	
	.search-input {
		width: 100%;
		padding: var(--space-md) var(--space-md) var(--space-md) calc(var(--space-2xl) + var(--space-md));
		background: var(--color-bg-secondary);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		color: var(--color-text-primary);
		font-size: var(--text-base);
		font-family: inherit;
		transition: all var(--transition-normal);
	}
	
	.search-input:focus {
		outline: none;
		border-color: var(--color-accent-primary);
		box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
	}
	
	.search-input::placeholder {
		color: var(--color-text-tertiary);
	}
	
	.clear-button {
		position: absolute;
		right: calc(var(--space-xl) + var(--space-md));
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		color: var(--color-text-tertiary);
		cursor: pointer;
		padding: var(--space-xs);
		border-radius: var(--radius-sm);
		transition: all var(--transition-normal);
	}
	
	.clear-button:hover {
		background: var(--color-bg-elevated);
		color: var(--color-text-primary);
	}
	
	.search-results {
		max-height: 400px;
		overflow-y: auto;
	}
	
	.search-loading {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-md);
		padding: var(--space-2xl);
		color: var(--color-text-secondary);
	}
	
	.spinner {
		width: 16px;
		height: 16px;
		border: 2px solid var(--color-text-tertiary);
		border-top: 2px solid var(--color-accent-primary);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}
	
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
	
	.no-results {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--space-2xl);
		text-align: center;
		color: var(--color-text-secondary);
	}
	
	.no-results p {
		margin: var(--space-sm) 0;
	}
	
	.no-results-hint {
		font-size: var(--text-sm);
		color: var(--color-text-tertiary);
	}
	
	.results-list {
		padding: var(--space-md);
	}
	
	.result-item {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		width: 100%;
		padding: var(--space-md);
		background: none;
		border: none;
		border-radius: var(--radius-md);
		text-align: left;
		cursor: pointer;
		transition: all var(--transition-normal);
		font-family: inherit;
	}
	
	.result-item:hover {
		background: var(--color-bg-elevated);
	}
	
	.result-icon {
		flex-shrink: 0;
		width: 32px;
		height: 32px;
		border-radius: var(--radius-md);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
	}
	
	.result-icon.album {
		background: rgba(0, 122, 255, 0.8);
	}
	
	.result-icon.book {
		background: rgba(48, 209, 88, 0.8);
	}
	
	.result-icon.about {
		background: rgba(175, 82, 222, 0.8);
	}
	
	.result-icon.contact {
		background: rgba(255, 149, 0, 0.8);
	}
	
	.result-content {
		flex: 1;
	}
	
	.result-title {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: 2px;
	}
	
	.result-description {
		font-size: var(--text-xs);
		color: var(--color-text-secondary);
	}
	
	.result-type {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		text-transform: capitalize;
		background: var(--glass-bg);
		padding: var(--space-xs) var(--space-sm);
		border-radius: var(--radius-sm);
		border: 1px solid var(--glass-border);
	}
	
	.search-suggestions {
		padding: var(--space-xl);
	}
	
	.suggestions-title {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: var(--space-md);
	}
	
	.suggestions-list {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-sm);
	}
	
	.suggestion-item {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-md);
		background: var(--color-bg-secondary);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-md);
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
		cursor: pointer;
		transition: all var(--transition-normal);
		font-family: inherit;
	}
	
	.suggestion-item:hover {
		background: var(--color-bg-elevated);
		border-color: var(--color-accent-primary);
		color: var(--color-text-primary);
	}
	
	@media (max-width: 768px) {
		.search-overlay {
			padding: var(--space-lg) var(--space-sm);
			align-items: flex-start;
		}
		
		.search-modal {
			margin-top: 0;
		}
		
		.suggestions-list {
			grid-template-columns: 1fr;
		}
	}
</style>
