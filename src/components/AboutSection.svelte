<script lang="ts">
	import { onMount } from 'svelte';
	import { Music, BookOpen, Award, Users, Clock, Heart } from 'lucide-svelte';
	
	let mounted = false;
	
	const stats = [
		{ icon: Music, value: '6', label: 'Albums Released', color: 'text-blue-400' },
		{ icon: BookOpen, value: '2', label: 'Books Published', color: 'text-green-400' },
		{ icon: Award, value: 'Platinum', label: 'Selling Status', color: 'text-yellow-400' },
		{ icon: Users, value: 'Decades', label: 'Of Creating', color: 'text-purple-400' }
	];
	
	const timeline = [
		{
			year: '2025',
			title: 'Upcoming Releases',
			description: 'Released "Don\'t Say It\'s Over" - a heartfelt plea about enduring love, and preparing "The Visual Man" book exploring psychology and attraction for release.'
		},
		{
			year: '2024',
			title: 'Leadership & Rock',
			description: 'Published "The Alpha Code" - a bold guide for personal development and leadership, and released "The Visual Man" album exploring seduction and connection.'
		},
		{
			year: '2023',
			title: 'Blues Instrumental Mastery',
			description: 'Dropped "The Revealing" - a hard rock/blues/instrumental journey about embracing vulnerability and letting inner feelings shine.'
		},
		{
			year: '2022',
			title: 'Dark Rock Power',
			description: 'Released "Look At Me" - a dark and haunting exploration of fear, power, and psychological pursuit that showcases my harder edge.'
		},
		{
			year: '2021',
			title: 'Personal Reflection',
			description: 'Created "My Life" - a reflective anthem about the highs and lows of chasing the rock \'n\' roll dream and finding purpose in music.'
		},
		{
			year: '2020',
			title: 'My Favorite Ballads',
			description: 'Released "Something More" - a heartfelt ballad about enduring love and the strength it brings through life\'s challenges.'
		}
	];
	
	onMount(() => {
		mounted = true;
	});
</script>

<section id="about" class="section about-section">
	<div class="container">
		<!-- Section Header -->
		<div class="section-header" class:mounted>
			<div class="section-badge">
				<Heart size={16} />
				<span>About Me</span>
			</div>
			
			<h2 class="section-title">Creative Journey</h2>
			
			<p class="section-description">
				A career spanning decades as a songwriter-singer and author, creating works that have 
				reached platinum status and critical acclaim across multiple creative disciplines.
			</p>
		</div>
		
		<div class="about-content" class:mounted>
			<!-- Main Story -->
			<div class="story-section">
				<div class="story-text">
					<h3 class="story-title">About Me</h3>
					<p class="story-paragraph">
						From those early days of picking up my first guitar to hearing my songs on the radio, it's been an incredible ride of constant growth and discovery. Rock music gave me my foundation, but I found myself drawn to writing as another way to share what I've learned along the way.
					</p>
					<p class="story-paragraph">
						Over the decades, I've collaborated with Grammy Award-winning artists and contributed to countless projects. My six solo albums represent my personal artistic vision, while my collaborations showcase the breadth of my musical journey. The two books I've written explore many of the same themes that drive my music - human connection, personal power, and the psychology behind what moves us.
					</p>
					<p class="story-paragraph">
						Getting that platinum certification was surreal - not just because of the sales, but because it meant the music I poured my heart into actually connected with people. Whether I'm writing a song or a book, it all comes from the same place - this need to understand people and share what I've discovered about life, relationships, and finding your own strength.
					</p>
				</div>
				
				<!-- Stats Grid -->
				<div class="stats-grid">
					{#each stats as stat, index}
						<div class="stat-card" style="--delay: {index * 100}ms">
							<div class="stat-icon {stat.color}">
								<svelte:component this={stat.icon} size={24} />
							</div>
							<div class="stat-content">
								<div class="stat-value">{stat.value}</div>
								<div class="stat-label">{stat.label}</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
			
			<!-- Latest News -->
			<div class="news-section">
				<h3 class="news-title">
					<span class="news-icon">📰</span>
					Latest News & Updates
				</h3>
				
				<div class="news-grid">
					<div class="news-item">
						<div class="news-header">
							<div class="news-category music">🎵 In the Studio</div>
							<div class="news-date">Current</div>
						</div>
						<h4 class="news-item-title">Recording Album #7</h4>
						<p class="news-description">
							Currently in pre-production for my 7th studio album, working with incredible session musicians to explore new sonic territories. The creative energy is electric, and I'm pushing boundaries I've never touched before.
						</p>
					</div>
					
					<div class="news-item">
						<div class="news-header">
							<div class="news-category book">📚 New Book</div>
							<div class="news-date">Spring 2026</div>
						</div>
						<h4 class="news-item-title">What Women Really Want</h4>
						<p class="news-description">
							Putting the finishing touches on my upcoming book exploring authentic masculinity and genuine connection. A deep dive into understanding relationships from a psychological perspective.
						</p>
					</div>
					
					<div class="news-item">
						<div class="news-header">
							<div class="news-category studio">🏗️ Studio Expansion</div>
							<div class="news-date">2025</div>
						</div>
						<h4 class="news-item-title">Home Studio Renovation</h4>
						<p class="news-description">
							Breaking ground on a major renovation of my home studio complex. Adding a full performance room with vintage acoustics and expanding the mixing suite for a creative sanctuary unlike anything I've built before.
						</p>
					</div>
					
					<div class="news-item">
						<div class="news-header">
							<div class="news-category gear">🎸 New Acquisition</div>
							<div class="news-date">Recent</div>
						</div>
						<h4 class="news-item-title">Vintage Gibson Les Paul</h4>
						<p class="news-description">
							Just acquired a rare 1970s Gibson Les Paul that's become my new go-to guitar. The tone is absolutely haunting - perfect for the darker material I'm developing.
						</p>
					</div>
				</div>
			</div>
			
			<!-- Timeline -->
			<div class="timeline-section">
				<h3 class="timeline-title">
					<Clock size={20} />
					My Creative Timeline
				</h3>
				
				<div class="timeline">
					{#each timeline as item, index}
						<div class="timeline-item" style="--delay: {index * 150}ms">
							<div class="timeline-marker"></div>
							<div class="timeline-content">
								<div class="timeline-year">{item.year}</div>
								<h4 class="timeline-item-title">{item.title}</h4>
								<p class="timeline-description">{item.description}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
			
			<!-- Skills & Expertise -->
			<div class="skills-section">
				<h3 class="skills-title">Skills & Expertise</h3>
				
				<div class="skills-grid">
					<div class="skill-category">
						<h4 class="category-title">Musical Performance</h4>
						<ul class="skill-list">
							<li>Professional Guitar Player</li>
							<li>Professional Singer</li>
							<li>Songwriter & Composer</li>
							<li>Music Arrangement & Orchestration</li>
						</ul>
					</div>
					
					<div class="skill-category">
						<h4 class="category-title">Music Production</h4>
						<ul class="skill-list">
							<li>Mixing & Mastering</li>
							<li>Sound Design & Synthesis</li>
							<li>Music Theory & Composition</li>
							<li>Pro Tools & Studio Engineering</li>
						</ul>
					</div>
					
					<div class="skill-category">
						<h4 class="category-title">Writing & Publishing</h4>
						<ul class="skill-list">
							<li>Creative Writing & Storytelling</li>
							<li>E-book Design & Formatting</li>
							<li>Content Strategy & Development</li>
							<li>Digital Publishing Platforms</li>
						</ul>
					</div>
					
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.about-section {
		background: linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%);
		position: relative;
	}
	
	.about-section::before {
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
	
	.about-content {
		opacity: 0;
		transition: opacity 1s ease-out 0.3s;
	}
	
	.about-content.mounted {
		opacity: 1;
	}
	
	.story-section {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: var(--space-4xl);
		margin-bottom: var(--space-5xl);
		align-items: start;
	}
	
	.story-text {
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-xl);
		padding: var(--space-2xl);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}
	
	.story-title {
		font-size: var(--text-2xl);
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: var(--space-lg);
	}
	
	.story-paragraph {
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		line-height: 1.7;
		margin-bottom: var(--space-lg);
	}
	
	.story-paragraph:last-child {
		margin-bottom: 0;
	}
	
	.stats-grid {
		display: grid;
		gap: var(--space-lg);
	}
	
	.stat-card {
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		transition: all var(--transition-normal);
		opacity: 0;
		transform: translateY(20px);
		animation: slideInUp 0.6s ease-out forwards;
		animation-delay: var(--delay);
		display: flex;
		align-items: center;
		gap: var(--space-md);
	}
	
	.stat-card:hover {
		transform: translateY(-4px);
		border-color: var(--color-accent-primary);
	}
	
	@keyframes slideInUp {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	.stat-icon {
		flex-shrink: 0;
	}
	
	.stat-content {
		flex: 1;
	}
	
	.stat-value {
		font-size: var(--text-xl);
		font-weight: 800;
		color: var(--color-text-primary);
		line-height: 1;
	}
	
	.stat-label {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		margin-top: var(--space-xs);
	}
	
	.text-blue-400 { color: #60a5fa; }
	.text-green-400 { color: #4ade80; }
	.text-yellow-400 { color: #facc15; }
	.text-purple-400 { color: #c084fc; }
	
	.news-section {
		margin-bottom: var(--space-5xl);
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-xl);
		padding: var(--space-2xl);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}
	
	.news-title {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: var(--text-2xl);
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: var(--space-2xl);
		text-align: center;
		justify-content: center;
	}
	
	.news-icon {
		font-size: var(--text-xl);
	}
	
	.news-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: var(--space-lg);
	}
	
	.news-item {
		background: var(--color-bg-secondary);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
		transition: all var(--transition-normal);
	}
	
	.news-item:hover {
		transform: translateY(-2px);
		border-color: var(--color-accent-primary);
	}
	
	.news-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-sm);
	}
	
	.news-category {
		font-size: var(--text-xs);
		font-weight: 600;
		padding: var(--space-xs) var(--space-sm);
		border-radius: var(--radius-sm);
		display: flex;
		align-items: center;
		gap: var(--space-xs);
	}
	
	.news-category.music {
		background: rgba(0, 122, 255, 0.1);
		color: #007aff;
	}
	
	.news-category.book {
		background: rgba(48, 209, 88, 0.1);
		color: #30d158;
	}
	
	.news-category.studio {
		background: rgba(255, 149, 0, 0.1);
		color: #ff9500;
	}
	
	.news-category.gear {
		background: rgba(175, 82, 222, 0.1);
		color: #af52de;
	}
	
	.news-date {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		font-weight: 500;
	}
	
	.news-item-title {
		font-size: var(--text-base);
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: var(--space-sm);
	}
	
	.news-description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: 1.5;
	}
	
	.timeline-section {
		margin-bottom: var(--space-5xl);
	}
	
	.timeline-title {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: var(--text-2xl);
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: var(--space-2xl);
		text-align: center;
		justify-content: center;
	}
	
	.timeline {
		position: relative;
		max-width: 800px;
		margin: 0 auto;
	}
	
	.timeline::before {
		content: '';
		position: absolute;
		left: 50%;
		top: 0;
		bottom: 0;
		width: 2px;
		background: linear-gradient(180deg, var(--color-accent-primary), transparent);
		transform: translateX(-50%);
	}
	
	.timeline-item {
		position: relative;
		margin-bottom: var(--space-2xl);
		opacity: 0;
		transform: translateY(30px);
		animation: slideInUp 0.8s ease-out forwards;
		animation-delay: var(--delay);
	}
	
	.timeline-item:nth-child(odd) .timeline-content {
		text-align: right;
		padding-right: var(--space-2xl);
		margin-right: 50%;
		border-radius: var(--radius-lg) var(--radius-sm) var(--radius-lg) var(--radius-lg);
	}
	
	.timeline-item:nth-child(even) .timeline-content {
		text-align: left;
		padding-left: var(--space-2xl);
		margin-left: 50%;
		border-radius: var(--radius-sm) var(--radius-lg) var(--radius-lg) var(--radius-lg);
	}
	
	.timeline-marker {
		position: absolute;
		left: 50%;
		top: 0;
		width: 16px;
		height: 16px;
		background: var(--color-accent-primary);
		border: 3px solid var(--color-bg-primary);
		border-radius: 50%;
		transform: translateX(-50%);
		z-index: 2;
	}
	
	.timeline-content {
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		padding: var(--space-lg);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		transition: all var(--transition-normal);
	}
	
	.timeline-content:hover {
		border-color: var(--color-accent-primary);
	}
	
	.timeline-year {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-accent-primary);
		margin-bottom: var(--space-sm);
	}
	
	.timeline-item-title {
		font-size: var(--text-lg);
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: var(--space-sm);
	}
	
	.timeline-description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: 1.6;
	}
	
	.skills-section {
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-xl);
		padding: var(--space-2xl);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}
	
	.skills-title {
		font-size: var(--text-2xl);
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: var(--space-2xl);
		text-align: center;
	}
	
	.skills-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: var(--space-xl);
	}
	
	.skill-category {
		text-align: center;
	}
	
	.category-title {
		font-size: var(--text-lg);
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: var(--space-md);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-sm);
	}
	
	.category-title::before {
		content: '';
		width: 8px;
		height: 8px;
		background: var(--color-accent-primary);
		border-radius: 50%;
	}
	
	.skill-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	
	.skill-list li {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		padding: var(--space-xs) 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}
	
	.skill-list li:last-child {
		border-bottom: none;
	}
	
	@media (max-width: 968px) {
		.story-section {
			grid-template-columns: 1fr;
			gap: var(--space-2xl);
		}
		
		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	
	@media (max-width: 768px) {
		.timeline::before {
			left: 20px;
		}
		
		.timeline-marker {
			left: 20px;
		}
		
		.timeline-item:nth-child(odd) .timeline-content,
		.timeline-item:nth-child(even) .timeline-content {
			text-align: left;
			padding-left: var(--space-2xl);
			margin-left: 40px;
			margin-right: 0;
			border-radius: var(--radius-lg);
		}
		
		.section-title {
			font-size: var(--text-4xl);
		}
		
		.stats-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
