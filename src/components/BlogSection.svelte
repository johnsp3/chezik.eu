<script lang="ts">
	import { onMount } from 'svelte';
	import { Calendar, Clock, ArrowRight, Music, BookOpen, Mic, Headphones } from 'lucide-svelte';
	import SocialShare from './SocialShare.svelte';
	
	let mounted = false;
	let selectedPost: any = null;
	let showModal = false;
	
	// Sample blog posts - in a real app, this would come from a CMS or API
	const blogPosts = [
		{
			id: 1,
			title: "Recording Album #7: A New Musical Journey",
			excerpt: "Currently in pre-production for my 7th studio album, working with incredible session musicians to explore new sonic territories.",
			content: `I'm excited to share that I'm currently in pre-production for my seventh studio album. This project marks an important step forward in my musical journey, and I couldn't be more thrilled with the direction it's taking.

I've been working with some incredibly talented session musicians, and the creative energy in the studio has been outstanding. There's something special that happens when you're surrounded by people you enjoy working with, who share the same vision and creative drive. It really brings the music to life in ways that make the creative process flow more easily and naturally.

The album will blend my signature rock sound with a mix of heavy and softer moments, filled with strong riffs, memorable melodies, and powerful vocals. Some of the riffs are so fun to play that—even though I wrote them—I still had to practice to nail them down. Add in a touch of shred guitar, and I truly believe this will be my best album yet.`,
			date: "2025-01-15",
			readTime: "3 min read",
			category: "Studio Updates",
			image: "/John_Studio_High_quality.png",
			tags: ["recording", "album", "studio", "music"],
			icon: Music
		},
		{
			id: 2,
			title: "The Story Behind 'Don't Say It's Over'",
			excerpt: "A deep dive into the creation of my latest single and the emotions that drove its creation.",
			content: `"Don't Say It's Over" is a song written straight from the gut, about the kind of heartbreak that hits a man hard when the woman he loves walks away. The lyrics reflect those moments of replaying memories, holding onto what was real, and refusing to accept that the story is finished. It's not dressed up in fantasy — it's raw honesty about love, pain, and the unwillingness to let go of something that still feels alive.

At its core, the song is a plea for one more chance. It's about a man refusing to roll over and accept defeat when his heart tells him the connection is still there. Instead of bowing out quietly, he's standing firm, looking her in the eyes and saying: don't give up, don't walk away, don't throw this away when it still means everything. That drive, that persistence, is the heartbeat of the track.

As a musician, writing this song meant channeling real emotion into melody and words that hit hard. It's not soft or abstract; it's direct and unapologetic. "Don't Say It's Over" captures the fight to hold on, the vulnerability of a man who knows what he wants, and the strength to say it out loud. It's passion, pain, and conviction rolled into one — the kind of song that speaks to anyone who's ever been unwilling to let love slip through their hands.`,
			date: "2025-01-10",
			readTime: "4 min read",
			category: "Song Stories",
			image: "/John_Chezik_greatest_hits.png",
			tags: ["single", "songwriting", "emotions", "rock"],
			icon: Headphones
		},
		{
			id: 3,
			title: "Writing 'What Women Really Want': A Preview",
			excerpt: "Putting the finishing touches on my upcoming book exploring authentic masculinity and genuine connection.",
			content: `My upcoming book What Women Really Want has been years in the making, and I'm finally finishing what I believe is my most important work yet.

This isn't a pickup guide or some game-playing manual. It's a straight look at masculinity and what it takes to build real connections with women—whether in relationships, friendships, or family.

Through decades of experience, conversations, and lessons learned the hard way, I've come to see that what women want isn't complicated. They want men who are genuine, grounded, and secure in themselves. Women want true leaders—the kind of men who make them feel safe, secure, and valued. Men who can be strong without controlling, confident without arrogance, and open without losing their edge.

The book digs into psychology, communication, and the inner work required to become that kind of man. It's not about impressing—it's about becoming someone worth knowing and respecting.

I've pulled from personal experience, research, and years of watching what really works when it comes to building lasting, meaningful connections. My goal is to give men more than "tips"—I want to hand them a foundation they can live by.

The release is set for Spring 2026`,
			date: "2025-01-05",
			readTime: "5 min read",
			category: "Book Updates",
			image: "/The Visual Man Cover V1.png",
			tags: ["book", "relationships", "psychology", "writing"],
			icon: BookOpen
		},
		{
			id: 4,
			title: "Home Studio Renovation: State-of-the-Art in Progress",
			excerpt: "Breaking ground on a major renovation of my home studio complex, creating a space unlike anything I've built before.",
			content: `After years of talking about it and months of locking down the details, we're finally breaking ground on a massive renovation of my home studio. This isn't a facelift—it's a full-scale transformation.

The centerpiece is a brand-new live room built for performance. The acoustics are dialed in with a vintage edge, inspired by the legendary studios where the greatest records were made. Natural wood walls, custom diffusion panels, and a floating floor to kill outside noise—this room is built for serious sound.

The mixing suite is getting gutted and rebuilt from the ground up. New monitoring systems, precision acoustic treatment, and a custom console that fuses the power of analog warmth with modern digital speed. It's the best of both worlds, and it's going to hit hard.

This build isn't about "a vibe" or some mystical creative zone. It's about power, precision, and having a space where the music takes over. A place where you walk in and know it's go time.

We're on track to finish by late 2025. Can't wait to crank this place up and see what kind of chaos we create when it's done.`,
			date: "2024-12-28",
			readTime: "4 min read",
			category: "Studio Updates",
			image: "/John_Studio_1300x1040.png",
			tags: ["studio", "renovation", "creativity", "equipment"],
			icon: Mic
		}
	];
	
	onMount(() => {
		mounted = true;
	});
	
	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { 
			year: 'numeric', 
			month: 'long', 
			day: 'numeric' 
		});
	}
	
	function openPost(post: any) {
		selectedPost = post;
		showModal = true;
	}
	
	function closeModal() {
		selectedPost = null;
		showModal = false;
	}
	
	function getCategoryColor(category: string) {
		const colors: { [key: string]: string } = {
			'Studio Updates': 'rgba(0, 122, 255, 0.8)',
			'Song Stories': 'rgba(48, 209, 88, 0.8)',
			'Book Updates': 'rgba(175, 82, 222, 0.8)',
			'Behind the Scenes': 'rgba(255, 149, 0, 0.8)'
		};
		return colors[category] || 'rgba(100, 100, 100, 0.8)';
	}
</script>

<section id="blog" class="section blog-section">
	<div class="container">
		<!-- Section Header -->
		<div class="section-header" class:mounted>
			<div class="section-badge">
				<Calendar size={16} />
				<span>Latest Updates</span>
			</div>
			
			<h2 class="section-title">From the Studio & Beyond</h2>
			
			<p class="section-description">
				Stay updated with my latest projects, insights from the creative process, 
				and behind-the-scenes stories from my musical and literary journey.
			</p>
		</div>
		
		<!-- Blog Posts Grid -->
		<div class="blog-grid" class:mounted>
			{#each blogPosts as post, index}
				<article 
					class="blog-card" 
					style="--delay: {index * 150}ms"
				>
					<div class="blog-image">
						<img 
							src={post.image} 
							alt={post.title}
							class="post-image"
							loading="lazy"
						/>
						<div class="image-overlay">
							<div class="category-badge" style="background: {getCategoryColor(post.category)}">
								<svelte:component this={post.icon} size={14} />
								<span>{post.category}</span>
							</div>
						</div>
					</div>
					
					<div class="blog-content">
						<div class="blog-meta">
							<div class="meta-item">
								<Calendar size={14} />
								<span>{formatDate(post.date)}</span>
							</div>
							<div class="meta-item">
								<Clock size={14} />
								<span>{post.readTime}</span>
							</div>
						</div>
						
						<h3 class="blog-title">{post.title}</h3>
						<p class="blog-excerpt">{post.excerpt}</p>
						
						<div class="blog-tags">
							{#each post.tags.slice(0, 3) as tag}
								<span class="tag">#{tag}</span>
							{/each}
						</div>
						
						<button 
							class="read-more-btn"
							on:click={() => openPost(post)}
							aria-label="Read full post: {post.title}"
						>
							<span>Read More</span>
							<ArrowRight size={16} />
						</button>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<!-- Blog Post Modal -->
{#if showModal && selectedPost}
	<div class="modal-overlay" on:click={closeModal} role="button" tabindex="0" on:keydown={(e) => e.key === 'Escape' && closeModal()} aria-label="Close post">
		<article class="modal-content" role="document">
			<button class="modal-close" on:click={closeModal} aria-label="Close post">&times;</button>
			
			<div class="modal-header">
				<div class="modal-category" style="background: {getCategoryColor(selectedPost.category)}">
					<svelte:component this={selectedPost.icon} size={16} />
					<span>{selectedPost.category}</span>
				</div>
				
				<h1 class="modal-title">{selectedPost.title}</h1>
				
				<div class="modal-meta">
					<div class="meta-item">
						<Calendar size={16} />
						<span>{formatDate(selectedPost.date)}</span>
					</div>
					<div class="meta-item">
						<Clock size={16} />
						<span>{selectedPost.readTime}</span>
					</div>
				</div>
			</div>
			
			<div class="modal-image">
				<img 
					src={selectedPost.image} 
					alt={selectedPost.title}
					class="modal-post-image"
				/>
			</div>
			
			<div class="modal-body">
				<div class="post-content">
					{#each selectedPost.content.split('\n\n') as paragraph}
						<p class="content-paragraph">{paragraph}</p>
					{/each}
				</div>
				
				<div class="post-tags">
					{#each selectedPost.tags as tag}
						<span class="tag">#{tag}</span>
					{/each}
				</div>
				
				<div class="post-share">
					<h4 class="share-title">Share this post</h4>
					<SocialShare 
						title={selectedPost.title}
						description={selectedPost.excerpt}
						hashtags={selectedPost.tags.join(',')}
					/>
				</div>
			</div>
		</article>
	</div>
{/if}

<style>
	.blog-section {
		background: linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%);
		position: relative;
	}
	
	.blog-section::before {
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
	
	.blog-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: var(--space-xl);
		opacity: 0;
		transition: opacity 1s ease-out 0.3s;
	}
	
	.blog-grid.mounted {
		opacity: 1;
	}
	
	.blog-card {
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-xl);
		overflow: hidden;
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		transition: all var(--transition-normal);
		opacity: 0;
		transform: translateY(30px);
		animation: slideInUp 0.6s ease-out forwards;
		animation-delay: var(--delay);
	}
	
	.blog-card:hover {
		transform: translateY(-8px);
		border-color: var(--color-accent-primary);
		box-shadow: 0 20px 40px rgba(0, 122, 255, 0.1);
	}
	
	@keyframes slideInUp {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	.blog-image {
		position: relative;
		height: 200px;
		overflow: hidden;
	}
	
	.post-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: all var(--transition-normal);
	}
	
	.blog-card:hover .post-image {
		transform: scale(1.05);
	}
	
	.image-overlay {
		position: absolute;
		top: var(--space-md);
		left: var(--space-md);
	}
	
	.category-badge {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		padding: var(--space-xs) var(--space-sm);
		border-radius: var(--radius-md);
		color: white;
		font-size: var(--text-xs);
		font-weight: 600;
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
	}
	
	.blog-content {
		padding: var(--space-xl);
	}
	
	.blog-meta {
		display: flex;
		gap: var(--space-lg);
		margin-bottom: var(--space-md);
	}
	
	.meta-item {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
	}
	
	.blog-title {
		font-size: var(--text-xl);
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: var(--space-sm);
		line-height: 1.3;
	}
	
	.blog-excerpt {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: 1.5;
		margin-bottom: var(--space-lg);
	}
	
	.blog-tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
		margin-bottom: var(--space-lg);
	}
	
	.tag {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		background: var(--color-bg-elevated);
		padding: var(--space-xs) var(--space-sm);
		border-radius: var(--radius-sm);
		border: 1px solid var(--glass-border);
	}
	
	.read-more-btn {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		background: none;
		border: none;
		color: var(--color-accent-primary);
		font-size: var(--text-sm);
		font-weight: 600;
		cursor: pointer;
		transition: all var(--transition-normal);
		font-family: inherit;
	}
	
	.read-more-btn:hover {
		color: var(--color-accent-hover);
		transform: translateX(4px);
	}
	
	/* Modal Styles */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.9);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		z-index: 1000;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: var(--space-lg);
		overflow-y: auto;
	}
	
	.modal-content {
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-xl);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		max-width: 800px;
		width: 100%;
		margin: var(--space-xl) auto;
		position: relative;
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
	
	.modal-close {
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
	
	.modal-close:hover {
		background: var(--color-bg-elevated);
		color: var(--color-text-primary);
	}
	
	.modal-header {
		padding: var(--space-2xl) var(--space-2xl) var(--space-lg);
		border-bottom: 1px solid var(--glass-border);
	}
	
	.modal-category {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md);
		border-radius: var(--radius-md);
		color: white;
		font-size: var(--text-sm);
		font-weight: 600;
		margin-bottom: var(--space-lg);
	}
	
	.modal-title {
		font-size: var(--text-3xl);
		font-weight: 800;
		color: var(--color-text-primary);
		margin-bottom: var(--space-lg);
		line-height: 1.2;
	}
	
	.modal-meta {
		display: flex;
		gap: var(--space-xl);
	}
	
	.modal-image {
		width: 100%;
		height: 300px;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.modal-post-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center top;
	}
	
	.modal-body {
		padding: var(--space-2xl);
	}
	
	.post-content {
		margin-bottom: var(--space-2xl);
	}
	
	.content-paragraph {
		font-size: var(--text-base);
		line-height: 1.7;
		color: var(--color-text-secondary);
		margin-bottom: var(--space-lg);
	}
	
	.content-paragraph:last-child {
		margin-bottom: 0;
	}
	
	.post-tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin-bottom: var(--space-2xl);
		padding-bottom: var(--space-xl);
		border-bottom: 1px solid var(--glass-border);
	}
	
	.post-share {
		text-align: center;
	}
	
	.share-title {
		font-size: var(--text-lg);
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: var(--space-md);
	}
	
	@media (max-width: 768px) {
		.blog-grid {
			grid-template-columns: 1fr;
			gap: var(--space-lg);
		}
		
		.section-title {
			font-size: var(--text-4xl);
		}
		
		.modal-content {
			margin: var(--space-md) auto;
		}
		
		.modal-header {
			padding: var(--space-xl) var(--space-lg) var(--space-md);
		}
		
		.modal-body {
			padding: var(--space-lg);
		}
		
		.modal-title {
			font-size: var(--text-2xl);
		}
	}
</style>
