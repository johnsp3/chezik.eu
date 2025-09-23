<script lang="ts">
	import { onMount } from 'svelte';
	import { ChevronDown, Music, BookOpen, Sparkles } from 'lucide-svelte';
	
	let mounted = false;
	let heroRef: HTMLElement;
	
	onMount(() => {
		mounted = true;
		
		// Parallax effect for hero background
		const handleScroll = () => {
			if (heroRef) {
				const scrolled = window.pageYOffset;
				const parallax = scrolled * 0.5;
				heroRef.style.transform = `translateY(${parallax}px)`;
			}
		};
		
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
	
	function scrollToNext() {
		const nextSection = document.querySelector('#albums');
		if (nextSection) {
			nextSection.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<section id="home" class="hero" bind:this={heroRef}>
	<div class="hero-background">
		<div class="gradient-orb orb-1"></div>
		<div class="gradient-orb orb-2"></div>
		<div class="gradient-orb orb-3"></div>
	</div>
	
	<div class="container">
		<div class="hero-content" class:mounted>
			<!-- Profile Image -->
			<div class="profile-image">
				<div class="image-container">
					<img 
						src="/John_Studio_High_quality.png" 
						alt="John Chezik in his professional studio, platinum-selling songwriter-singer and guitar player" 
						class="profile-img"
						loading="eager"
						decoding="async"
						width="300"
						height="300"
					/>
					<div class="image-glow"></div>
				</div>
			</div>
			
			<!-- Hero Text -->
			<div class="hero-text">
				<h1 class="hero-title">
					<span class="title-line">John Chezik</span>
					<span class="title-subtitle">Platinum-selling songwriter-singer, guitar player and published author. 6 albums, 2 books, decades of creating.</span>
				</h1>
				
				<p class="hero-description">
					Explore the catalog of a career spanning decades of rock music and literary works. 
					From chart-topping albums to critically acclaimed books.
				</p>
				
				<div class="hero-stats">
					<div class="stat">
						<Music size={20} />
						<div class="stat-content">
							<span class="stat-number">6</span>
							<span class="stat-label">Albums</span>
						</div>
					</div>
					
					<div class="stat">
						<BookOpen size={20} />
						<div class="stat-content">
							<span class="stat-number">2</span>
							<span class="stat-label">Books</span>
						</div>
					</div>
				</div>
				
				<div class="hero-actions">
					<button class="btn btn-primary" on:click={scrollToNext}>
						Explore My Work
					</button>
					<a href="#contact" class="btn btn-secondary">
						Get In Touch
					</a>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Scroll Indicator -->
	<button class="scroll-indicator" on:click={scrollToNext} aria-label="Scroll to next section">
		<ChevronDown size={24} />
	</button>
</section>

<style>
	.hero {
		position: relative;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		background: radial-gradient(ellipse at center, #111111 0%, #000000 70%);
	}
	
	.hero-background {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}
	
	.gradient-orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(60px);
		opacity: 0.3;
		animation: float 6s ease-in-out infinite;
	}
	
	.orb-1 {
		width: 300px;
		height: 300px;
		background: linear-gradient(45deg, #007aff, #5856d6);
		top: 20%;
		left: 10%;
		animation-delay: 0s;
	}
	
	.orb-2 {
		width: 200px;
		height: 200px;
		background: linear-gradient(45deg, #ff2d92, #ff6b35);
		top: 60%;
		right: 15%;
		animation-delay: 2s;
	}
	
	.orb-3 {
		width: 150px;
		height: 150px;
		background: linear-gradient(45deg, #30d158, #64d2ff);
		bottom: 30%;
		left: 60%;
		animation-delay: 4s;
	}
	
	@keyframes float {
		0%, 100% { transform: translateY(0) rotate(0deg); }
		50% { transform: translateY(-20px) rotate(180deg); }
	}
	
	.hero-content {
		display: flex;
		align-items: center;
		gap: var(--space-4xl);
		max-width: 1200px;
		opacity: 0;
		transform: translateY(30px);
		transition: all 1s ease-out;
	}
	
	.hero-content.mounted {
		opacity: 1;
		transform: translateY(0);
	}
	
	.profile-image {
		flex-shrink: 0;
	}
	
	.image-container {
		position: relative;
		width: 300px;
		height: 300px;
	}
	
	.profile-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 50%;
		border: 4px solid rgba(255, 255, 255, 0.1);
		position: relative;
		z-index: 2;
		transition: all var(--transition-normal);
	}
	
	.profile-img:hover {
		transform: scale(1.05);
		border-color: var(--color-accent-primary);
	}
	
	.image-glow {
		position: absolute;
		inset: -20px;
		background: conic-gradient(from 0deg, #007aff, #5856d6, #ff2d92, #ff6b35, #30d158, #007aff);
		border-radius: 50%;
		opacity: 0.5;
		filter: blur(30px);
		animation: rotate 10s linear infinite;
		z-index: 1;
	}
	
	@keyframes rotate {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
	
	.hero-text {
		flex: 1;
		max-width: 600px;
	}
	
	
	.hero-title {
		font-size: var(--text-6xl);
		font-weight: 800;
		line-height: 1.1;
		margin-bottom: var(--space-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}
	
	.title-line {
		background: linear-gradient(135deg, #ffffff, #007aff);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	
	.title-subtitle {
		font-size: var(--text-2xl);
		font-weight: 400;
		color: var(--color-text-secondary);
	}
	
	.hero-description {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
		line-height: 1.6;
		margin-bottom: var(--space-xl);
		max-width: 500px;
	}
	
	.hero-stats {
		display: flex;
		gap: var(--space-xl);
		margin-bottom: var(--space-2xl);
	}
	
	.stat {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		padding: var(--space-md) var(--space-lg);
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}
	
	.stat-content {
		display: flex;
		flex-direction: column;
	}
	
	.stat-number {
		font-size: var(--text-xl);
		font-weight: 700;
		color: var(--color-text-primary);
	}
	
	.stat-label {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}
	
	.hero-actions {
		display: flex;
		gap: var(--space-md);
		flex-wrap: wrap;
	}
	
	.scroll-indicator {
		position: absolute;
		bottom: var(--space-xl);
		left: 50%;
		transform: translateX(-50%);
		background: none;
		border: none;
		color: var(--color-text-secondary);
		cursor: pointer;
		padding: var(--space-md);
		border-radius: 50%;
		transition: all var(--transition-normal);
		animation: bounce 2s infinite;
	}
	
	.scroll-indicator:hover {
		color: var(--color-text-primary);
		background: var(--glass-bg);
	}
	
	@keyframes bounce {
		0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
		40% { transform: translateX(-50%) translateY(-10px); }
		60% { transform: translateX(-50%) translateY(-5px); }
	}
	
	@media (max-width: 768px) {
		.hero-content {
			flex-direction: column;
			text-align: center;
			gap: var(--space-2xl);
		}
		
		.image-container {
			width: 200px;
			height: 200px;
		}
		
		.hero-title {
			font-size: var(--text-4xl);
		}
		
		.title-subtitle {
			font-size: var(--text-lg);
		}
		
		.hero-stats {
			justify-content: center;
		}
		
		.hero-actions {
			justify-content: center;
		}
	}
	
	@media (max-width: 480px) {
		.hero-stats {
			flex-direction: column;
			align-items: center;
		}
		
		.hero-actions {
			flex-direction: column;
			width: 100%;
		}
		
		.btn {
			width: 100%;
		}
	}
</style>
