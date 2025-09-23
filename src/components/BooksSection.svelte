<script lang="ts">
	import { onMount } from 'svelte';
	import { BookOpen, Star, Download, ExternalLink } from 'lucide-svelte';
	
	let mounted = false;
	let selectedBook: any = null;
	let showModal = false;
	let showPreview = false;
	let previewBook: any = null;
	
	// John Chezik's published books
	const books = [
		{
			id: 1,
			title: "The Visual Man",
			subtitle: "Explores the connection between psychology, attraction, and influence through advanced psychological frameworks. This work examines the subtle dynamics of human interaction and the art of authentic connection.",
			year: "2025",
			genre: "Psychology",
			pages: 285,
			rating: 4.7,
			description: "A comprehensive guide to understanding psychological dynamics and communication techniques.",
			cover: "/The Visual Man Cover V1.png",
			color: "from-purple-600 to-blue-600",
			featured: true,
			comingSoon: true
		},
		{
			id: 2,
			title: "The Alpha Code",
			subtitle: "A bold guide for men ready to rise above mediocrity and step into their power. It challenges you to cultivate self-reliance, confidence, and fearless decision-making while mastering conflict and living by a personal code that commands respect and influence.",
			year: "2024",
			genre: "Self-Development",
			pages: 280,
			rating: 4.9,
			description: "A guide to building authentic connections and understanding relationship dynamics.",
			cover: "/The_Alfa_Code.png",
			color: "from-green-600 to-teal-600",
			featured: true,
			comingSoon: false
		},
		{
			id: 3,
			title: "Stories Untold",
			subtitle: "A Collection of Short Fiction",
			year: "2023",
			genre: "Fiction",
			pages: 198,
			rating: 4.6,
			description: "An anthology of compelling short stories exploring human nature and emotion.",
			cover: "/api/placeholder/200/300",
			color: "from-orange-600 to-red-600",
			featured: false
		},
		{
			id: 4,
			title: "The Sound of Silence",
			subtitle: "Meditation Through Music",
			year: "2022",
			genre: "Wellness",
			pages: 156,
			rating: 4.7,
			description: "Discover inner peace through the therapeutic power of music and sound.",
			cover: "/api/placeholder/200/300",
			color: "from-indigo-600 to-purple-600",
			featured: false
		},
		{
			id: 5,
			title: "Beyond the Notes",
			subtitle: "The Philosophy of Music Creation",
			year: "2022",
			genre: "Philosophy",
			pages: 278,
			rating: 4.5,
			description: "Explore the deeper meaning behind musical composition and artistic expression.",
			cover: "/api/placeholder/200/300",
			color: "from-blue-600 to-cyan-600",
			featured: false
		},
		{
			id: 6,
			title: "Creative Workflows",
			subtitle: "Productivity for Artists",
			year: "2021",
			genre: "Productivity",
			pages: 189,
			rating: 4.4,
			description: "Streamline your creative process with proven productivity techniques.",
			cover: "/api/placeholder/200/300",
			color: "from-pink-600 to-rose-600",
			featured: false
		}
	];
	
	onMount(() => {
		mounted = true;
	});
	
	function handleDownloadBook(bookId: number) {
		// Placeholder for download functionality
		console.log(`Downloading book ${bookId}`);
	}
	
	function handlePreviewBook(bookId: number) {
		const book = books.find(b => b.id === bookId);
		if (book) {
			previewBook = book;
			showPreview = true;
		}
	}
	
	function closeModal() {
		showModal = false;
		selectedBook = null;
	}
	
	function closePreview() {
		showPreview = false;
		previewBook = null;
	}
	
	function handleBookCoverClick(book: any) {
		selectedBook = book;
		showModal = true;
	}
	
	// Preview content for The Alfa Code
	const alfaCodePreview = {
		tableOfContents: [
			"Introduction: The Alpha Mindset",
			"Chapter 1: Leading with Confidence in Relationships", 
			"Chapter 2: Building Unshakeable Self-Worth",
			"Chapter 3: Mastering Communication and Influence",
			"Chapter 4: Creating Magnetic Presence",
			"Chapter 5: Handling Conflict with Authority"
		],
		introduction: `The Alpha Code isn't about aggression or manipulation—it's about developing the authentic confidence and leadership that naturally attracts respect and admiration. In a world that often rewards mediocrity, this book provides the psychological tools and mindset shifts needed to stand apart and lead with purpose.`,
		chapter1: {
			title: "Leading with Confidence in Relationships",
			sections: [
				{
					title: "Establishing Your Leadership Presence",
					content: `True leadership in relationships isn't about control—it's about unwavering confidence that naturally draws people toward you. An alpha mindset means knowing your worth and maintaining your direction, regardless of external pressures. You don't seek validation or approval; you provide stability and certainty that others find irresistibly attractive.

Confidence isn't something you turn on and off—it's a core part of your identity. When you operate from a place of genuine self-assurance, you naturally become the person others look to for guidance and strength. This isn't about dominance; it's about being so secure in yourself that you become a source of stability for those around you.`
				},
				{
					title: "Building Deeper Connection Through Strength", 
					content: `Relationships thrive when there's a foundation of respect and genuine attraction. This comes from being authentic, consistent, and uncompromising about your values. Women are naturally drawn to men who know what they want and aren't afraid to pursue it with conviction.

Your strength isn't about being inflexible—it's about being reliable. When you demonstrate that you can be counted on to maintain your standards and direction, you create the kind of security that deepens emotional bonds. This consistency becomes the bedrock of lasting attraction.`
				}
			]
		}
	};
	
	function renderStars(rating: number) {
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 !== 0;
		const stars = [];
		
		for (let i = 0; i < fullStars; i++) {
			stars.push('full');
		}
		
		if (hasHalfStar) {
			stars.push('half');
		}
		
		while (stars.length < 5) {
			stars.push('empty');
		}
		
		return stars;
	}
</script>

<section id="books" class="section books-section">
	<div class="container">
		<!-- Section Header -->
		<div class="section-header" class:mounted>
			<div class="section-badge">
				<BookOpen size={16} />
				<span>Literary Works</span>
			</div>
			
			<h2 class="section-title">Published E-books</h2>
			
			<p class="section-description">
				Dive into my collection of thoughtfully crafted e-books, covering topics from 
				creativity and music to philosophy and personal development.
			</p>
		</div>
		
		<!-- Featured Books -->
		<div class="featured-books" class:mounted>
			<h3 class="featured-title">Featured Publications</h3>
			<div class="featured-grid">
				{#each books.filter(book => book.featured) as book, index}
					<div 
						class="featured-book-card" 
						style="--delay: {index * 150}ms"
					>
						<div class="book-cover-large">
							{#if book.cover && !book.cover.includes('placeholder')}
								<button 
									class="actual-cover" 
									on:click={() => handleBookCoverClick(book)}
									aria-label="View larger image of {book.title}"
								>
									<img 
										src={book.cover} 
										alt="{book.title} cover"
										class="cover-image clickable"
									/>
								</button>
							{:else}
								<div class="cover-placeholder bg-gradient-to-br {book.color}">
									<div class="cover-content">
										<BookOpen size={60} class="cover-icon" />
										<div class="cover-overlay">
											<div class="overlay-actions">
												<button 
													class="action-btn preview-btn"
													on:click={() => handlePreviewBook(book.id)}
													aria-label="Preview {book.title}"
												>
													<ExternalLink size={20} />
												</button>
												<button 
													class="action-btn download-btn"
													on:click={() => handleDownloadBook(book.id)}
													aria-label="Download {book.title}"
												>
													<Download size={20} />
												</button>
											</div>
										</div>
									</div>
								</div>
							{/if}
						</div>
						
						<div class="featured-book-info">
							<div class="book-meta">
								<span class="book-year">{book.year}</span>
								<span class="book-genre">{book.genre}</span>
								<span class="book-pages">{book.pages} pages</span>
							</div>
							
							<h4 class="book-title">{book.title}</h4>
							<p class="book-subtitle">{book.subtitle}</p>
							
							
							
							<div class="book-actions">
								{#if book.comingSoon}
									<div class="coming-soon-badge">
										Available {book.year}
									</div>
								{:else}
									<button 
										class="btn btn-primary btn-sm"
										on:click={() => handlePreviewBook(book.id)}
									>
										<ExternalLink size={16} />
										Preview
									</button>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
		
	</div>
</section>

<!-- Book Cover Modal -->
{#if showModal && selectedBook}
	<div class="modal-overlay" on:click={closeModal} role="button" tabindex="0" on:keydown={(e) => e.key === 'Escape' && closeModal()} aria-label="Close modal">
		<div class="modal-content" role="document">
			<button class="modal-close" on:click={closeModal}>&times;</button>
			<div class="modal-book-cover">
				<img 
					src={selectedBook.cover} 
					alt="{selectedBook.title} cover"
					class="modal-cover-image"
				/>
			</div>
			<div class="modal-book-info">
				<h3 class="modal-book-title">{selectedBook.title}</h3>
				<p class="modal-book-subtitle">{selectedBook.subtitle}</p>
			</div>
		</div>
	</div>
{/if}

<!-- Book Preview Modal -->
{#if showPreview && previewBook}
	<div class="preview-overlay" on:click={closePreview} role="button" tabindex="0" on:keydown={(e) => e.key === 'Escape' && closePreview()} aria-label="Close preview">
		<div class="preview-content" role="document">
			<button class="preview-close" on:click={closePreview}>&times;</button>
			
			<div class="preview-header">
				<div class="preview-book-info">
					<h2 class="preview-title">{previewBook.title}</h2>
					<p class="preview-subtitle">Book Preview</p>
				</div>
			</div>
			
			<div class="preview-body">
				{#if previewBook.title === "The Alpha Code"}
					<!-- Table of Contents -->
					<div class="preview-section">
						<h3 class="preview-section-title">Table of Contents</h3>
						<ul class="toc-list">
							{#each alfaCodePreview.tableOfContents as item}
								<li class="toc-item">{item}</li>
							{/each}
						</ul>
					</div>
					
					<!-- Introduction -->
					<div class="preview-section">
						<h3 class="preview-section-title">Introduction</h3>
						<p class="preview-text">{alfaCodePreview.introduction}</p>
					</div>
					
					<!-- Chapter 1 -->
					<div class="preview-section">
						<h3 class="preview-section-title">{alfaCodePreview.chapter1.title}</h3>
						{#each alfaCodePreview.chapter1.sections as section}
							<div class="chapter-section">
								<h4 class="chapter-subtitle">{section.title}</h4>
								<p class="preview-text">{section.content}</p>
							</div>
						{/each}
					</div>
					
					<div class="preview-footer">
						<p class="preview-note">This preview contains the Introduction and Chapter 1. The complete book includes 5 comprehensive chapters covering all aspects of confident leadership and authentic attraction.</p>
					</div>
				{:else}
					<div class="preview-section">
						<p class="preview-text">Preview content coming soon for {previewBook.title}.</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.books-section {
		background: linear-gradient(180deg, #000000 0%, #0f0f0f 50%, #000000 100%);
		position: relative;
	}
	
	.books-section::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
	}
	
	.section-header {
		text-align: center;
		margin-bottom: var(--space-4xl);
		opacity: 0;
		transform: translateY(30px);
		transition: all 0.8s ease-out;
	}
	
	.section-header.mounted {
		opacity: 1;
		transform: translateY(0);
	}
	
	.section-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md);
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-2xl);
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-accent-primary);
		margin-bottom: var(--space-lg);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}
	
	.section-title {
		font-size: var(--text-5xl);
		font-weight: 800;
		color: var(--color-text-primary);
		margin-bottom: var(--space-lg);
		background: linear-gradient(135deg, #ffffff, #a0a0a0);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	
	.section-description {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
		max-width: 600px;
		margin: 0 auto;
		line-height: 1.6;
	}
	
	.featured-books {
		margin-bottom: var(--space-5xl);
		opacity: 0;
		transition: opacity 1s ease-out 0.2s;
	}
	
	.featured-books.mounted {
		opacity: 1;
	}
	
	.featured-title {
		font-size: var(--text-2xl);
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: var(--space-xl);
		text-align: center;
	}
	
	.featured-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: var(--space-2xl);
	}
	
	.featured-book-card {
		display: flex;
		gap: var(--space-xl);
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-xl);
		padding: var(--space-xl);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		transition: all var(--transition-normal);
		opacity: 0;
		transform: translateX(-30px);
		animation: slideInLeft 0.8s ease-out forwards;
		animation-delay: var(--delay);
	}
	
	.featured-book-card:hover {
		transform: translateY(-4px);
		border-color: var(--color-accent-primary);
		box-shadow: 0 20px 40px rgba(0, 122, 255, 0.1);
	}
	
	@keyframes slideInLeft {
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
	
	.book-cover-large {
		flex-shrink: 0;
		width: 180px;
		height: 240px;
	}
	
	.featured-book-info {
		flex: 1;
	}
	
	.all-books {
		opacity: 0;
		transition: opacity 1s ease-out 0.4s;
	}
	
	.all-books.mounted {
		opacity: 1;
	}
	
	.section-subtitle {
		font-size: var(--text-2xl);
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: var(--space-xl);
		text-align: center;
	}
	
	.books-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
		gap: var(--space-lg);
	}
	
	.book-card {
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		padding: var(--space-md);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		transition: all var(--transition-normal);
		opacity: 0;
		transform: translateY(20px);
		animation: slideInUp 0.6s ease-out forwards;
		animation-delay: var(--delay);
	}
	
	.book-card:hover {
		transform: translateY(-4px);
		border-color: var(--color-accent-primary);
	}
	
	.book-card.featured {
		border-color: var(--color-accent-primary);
		background: rgba(0, 122, 255, 0.05);
	}
	
	@keyframes slideInUp {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	.book-cover,
	.book-cover-large {
		margin-bottom: var(--space-md);
		position: relative;
		border-radius: var(--radius-md);
		overflow: hidden;
	}
	
	.book-cover {
		aspect-ratio: 2/3;
	}
	
	
	.actual-cover {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		border-radius: var(--radius-md);
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
		transition: all var(--transition-normal);
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
	}
	
	.actual-cover:hover {
		transform: translateY(-2px);
		box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
	}
	
	.cover-image {
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: center;
		transition: all var(--transition-normal);
	}
	
	.cover-image.clickable {
		cursor: pointer;
	}
	
	.actual-cover.clickable {
		cursor: pointer;
	}
	
	.cover-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
		border-radius: var(--radius-md);
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
		transition: all var(--transition-normal);
	}
	
	.cover-placeholder:hover {
		transform: translateY(-2px);
		box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
	}
	
	.cover-content {
		position: relative;
		z-index: 2;
	}
	
	.cover-icon {
		color: rgba(255, 255, 255, 0.8);
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
	}
	
	.cover-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.6);
		opacity: 0;
		transition: all var(--transition-normal);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
	}
	
	.featured-book-card:hover .cover-overlay,
	.book-card:hover .cover-overlay {
		opacity: 1;
	}
	
	.overlay-actions {
		display: flex;
		gap: var(--space-sm);
	}
	
	.action-btn {
		background: var(--color-accent-primary);
		border: none;
		border-radius: 50%;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		cursor: pointer;
		transition: all var(--transition-normal);
	}
	
	.action-btn:hover {
		background: var(--color-accent-hover);
		transform: scale(1.1);
	}
	
	.download-btn-small {
		background: var(--color-accent-primary);
		border: none;
		border-radius: 50%;
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		cursor: pointer;
		transition: all var(--transition-normal);
	}
	
	.download-btn-small:hover {
		background: var(--color-accent-hover);
		transform: scale(1.1);
	}
	
	.book-meta,
	.book-meta-small {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		margin-bottom: var(--space-sm);
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		flex-wrap: wrap;
	}
	
	.book-year {
		background: var(--color-bg-elevated);
		padding: var(--space-xs) var(--space-sm);
		border-radius: var(--radius-sm);
	}
	
	.book-genre,
	.book-pages {
		font-weight: 500;
	}
	
	.book-title {
		font-size: var(--text-lg);
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: var(--space-xs);
		line-height: 1.3;
	}
	
	.book-title-small {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: var(--space-xs);
		line-height: 1.3;
	}
	
	.book-subtitle {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		margin-bottom: var(--space-md);
		line-height: 1.4;
	}
	
	.book-rating,
	.book-rating-small {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		margin-bottom: var(--space-md);
	}
	
	.stars,
	.stars-small {
		display: flex;
		gap: 2px;
	}
	
	.star,
	.star-small {
		color: var(--color-text-tertiary);
	}
	
	.star-filled {
		color: #ffd700;
		fill: #ffd700;
	}
	
	.star-half {
		color: #ffd700;
		fill: url(#half-star);
	}
	
	.rating-text,
	.rating-text-small {
		font-size: var(--text-xs);
		color: var(--color-text-secondary);
		font-weight: 500;
	}
	
	.book-description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: 1.5;
		margin-bottom: var(--space-lg);
	}
	
	.book-actions {
		display: flex;
		gap: var(--space-sm);
		flex-wrap: wrap;
	}
	
	.btn-sm {
		padding: var(--space-xs) var(--space-md);
		font-size: var(--text-sm);
		gap: var(--space-xs);
	}
	
	.coming-soon-badge {
		background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-light));
		color: white;
		padding: var(--space-sm) var(--space-lg);
		border-radius: var(--radius-2xl);
		font-size: var(--text-sm);
		font-weight: 600;
		text-align: center;
		box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
		animation: glow 2s ease-in-out infinite alternate;
	}
	
	@keyframes glow {
		from { box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3); }
		to { box-shadow: 0 6px 20px rgba(0, 122, 255, 0.5); }
	}
	
	/* Gradient utilities */
	.bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); }
	.from-purple-600 { --tw-gradient-from: #9333ea; --tw-gradient-to: rgb(147 51 234 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
	.to-blue-600 { --tw-gradient-to: #2563eb; }
	.from-green-600 { --tw-gradient-from: #16a34a; --tw-gradient-to: rgb(22 163 74 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
	.to-teal-600 { --tw-gradient-to: #0d9488; }
	.from-orange-600 { --tw-gradient-from: #ea580c; --tw-gradient-to: rgb(234 88 12 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
	.to-red-600 { --tw-gradient-to: #dc2626; }
	.from-indigo-600 { --tw-gradient-from: #4f46e5; --tw-gradient-to: rgb(79 70 229 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
	.from-blue-600 { --tw-gradient-from: #2563eb; --tw-gradient-to: rgb(37 99 235 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
	.to-cyan-600 { --tw-gradient-to: #0891b2; }
	.from-pink-600 { --tw-gradient-from: #db2777; --tw-gradient-to: rgb(219 39 119 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
	.to-rose-600 { --tw-gradient-to: #e11d48; }
	
	@media (max-width: 600px) {
		.featured-grid {
			grid-template-columns: 1fr;
		}
		
		.featured-book-card {
			flex-direction: column;
			text-align: center;
		}
		
		.book-cover-large {
			width: 120px;
			margin: 0 auto;
		}
		
		.books-grid {
			grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		}
		
		.section-title {
			font-size: var(--text-4xl);
		}
	}
	
	@media (max-width: 480px) {
		.books-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	
	/* Modal Styles */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
	}
	
	.modal-content {
		position: relative;
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-xl);
		padding: var(--space-2xl);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		max-width: 90vw;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-lg);
	}
	
	.modal-close {
		position: absolute;
		top: var(--space-md);
		right: var(--space-md);
		background: none;
		border: none;
		color: var(--color-text-secondary);
		font-size: var(--text-2xl);
		cursor: pointer;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: all var(--transition-normal);
	}
	
	.modal-close:hover {
		background: var(--color-bg-elevated);
		color: var(--color-text-primary);
	}
	
	.modal-book-cover {
		max-width: 400px;
		max-height: 600px;
	}
	
	.modal-cover-image {
		width: 100%;
		height: auto;
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		border-radius: var(--radius-md);
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
	}
	
	.modal-book-info {
		text-align: center;
	}
	
	.modal-book-title {
		font-size: var(--text-2xl);
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: var(--space-sm);
	}
	
	.modal-book-subtitle {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
	}
	
	@media (max-width: 768px) {
		.modal-content {
			padding: var(--space-lg);
			margin: var(--space-md);
		}
		
		.modal-book-cover {
			max-width: 300px;
			max-height: 450px;
		}
	}
	
	/* Preview Modal Styles */
	.preview-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.9);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1001;
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		overflow-y: auto;
		padding: var(--space-lg);
	}
	
	.preview-content {
		position: relative;
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-xl);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		max-width: 800px;
		width: 100%;
		max-height: 90vh;
		overflow-y: auto;
		margin: auto;
	}
	
	.preview-close {
		position: absolute;
		top: var(--space-lg);
		right: var(--space-lg);
		background: none;
		border: none;
		color: var(--color-text-secondary);
		font-size: var(--text-2xl);
		cursor: pointer;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: all var(--transition-normal);
		z-index: 10;
	}
	
	.preview-close:hover {
		background: var(--color-bg-elevated);
		color: var(--color-text-primary);
	}
	
	.preview-header {
		padding: var(--space-2xl) var(--space-2xl) var(--space-lg);
		border-bottom: 1px solid var(--glass-border);
		text-align: center;
	}
	
	.preview-title {
		font-size: var(--text-3xl);
		font-weight: 800;
		color: var(--color-text-primary);
		margin-bottom: var(--space-sm);
		background: linear-gradient(135deg, #ffffff, #007aff);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	
	.preview-subtitle {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
		font-weight: 500;
	}
	
	.preview-body {
		padding: var(--space-xl);
		max-height: 60vh;
		overflow-y: auto;
	}
	
	.preview-section {
		margin-bottom: var(--space-2xl);
		padding-bottom: var(--space-xl);
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}
	
	.preview-section:last-of-type {
		border-bottom: none;
	}
	
	.preview-section-title {
		font-size: var(--text-xl);
		font-weight: 700;
		color: var(--color-accent-primary);
		margin-bottom: var(--space-lg);
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}
	
	.preview-section-title::before {
		content: '';
		width: 4px;
		height: 20px;
		background: var(--color-accent-primary);
		border-radius: 2px;
	}
	
	.toc-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: var(--space-sm);
	}
	
	.toc-item {
		padding: var(--space-sm) var(--space-md);
		background: var(--color-bg-secondary);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-md);
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
		transition: all var(--transition-normal);
	}
	
	.toc-item:hover {
		border-color: var(--color-accent-primary);
		color: var(--color-text-primary);
	}
	
	.preview-text {
		font-size: var(--text-base);
		line-height: 1.7;
		color: var(--color-text-secondary);
		margin-bottom: var(--space-lg);
	}
	
	.preview-text:last-child {
		margin-bottom: 0;
	}
	
	.chapter-section {
		margin-bottom: var(--space-xl);
	}
	
	.chapter-subtitle {
		font-size: var(--text-lg);
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: var(--space-md);
		padding-left: var(--space-md);
		border-left: 3px solid var(--color-accent-primary);
	}
	
	.preview-footer {
		background: var(--color-bg-secondary);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
		margin-top: var(--space-xl);
	}
	
	.preview-note {
		font-size: var(--text-sm);
		color: var(--color-text-tertiary);
		text-align: center;
		font-style: italic;
		margin: 0;
	}
	
	@media (max-width: 768px) {
		.preview-content {
			margin: var(--space-md);
			max-height: 95vh;
		}
		
		.preview-header {
			padding: var(--space-xl) var(--space-lg) var(--space-md);
		}
		
		.preview-body {
			padding: var(--space-lg);
		}
		
		.preview-title {
			font-size: var(--text-2xl);
		}
	}
</style>
