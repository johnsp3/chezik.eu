<script lang="ts">
	import { onMount } from 'svelte';
	import { Music, Play, Pause, ExternalLink } from 'lucide-svelte';
	
	let mounted = false;
	let currentlyPlaying: number | null = null;
	let audioElement: HTMLAudioElement | null = null;
	
	// Sample album data - you can replace with your actual albums
	const albums = [
		{
			id: 1,
			title: "Don't Say It's Over",
			year: "2025",
			genre: "Hard Rock",
			description: "A heartfelt plea to hold on to love. The song captures the pain of separation, the hope for reconciliation, and the enduring belief that true love is worth one more chance.",
			cover: "/John_Chezik_greatest_hits.png",
			audioFile: "/John_Chezik_don't_say_it's_over.mp3",
			color: "from-blue-600 to-purple-600"
		},
		{
			id: 2,
			title: "The Visual Man",
			year: "2024",
			genre: "Hard Rock",
			description: "The Visual Man is about seduction, energy, and connection. It explores the hypnotic pull of desire and the promise of being lifted into a world of passion and ecstasy.",
			cover: "/The_visual_Man_Cover.png",
			audioFile: "/visualman.mp3",
			color: "from-green-600 to-teal-600"
		},
		{
			id: 3,
			title: "The Revealing",
			year: "2023",
			genre: "Hard Rock/Blues/Instrumental",
			description: "About embracing who you truly are and opening yourself to passion and emotion. It's a journey of self-discovery, vulnerability, and the pleasure of letting your inner feelings shine.",
			cover: "/John Chezik_The_Revealing_album_cover.png",
			audioFile: "/John_Chezik_The_Revealing.mp3",
			color: "from-pink-600 to-red-600"
		},
		{
			id: 4,
			title: "Look At Me",
			year: "2022",
			genre: "Hard Rock",
			description: "A dark and haunting song about fear, power, and pursuit. It tells the story of an unstoppable presence that invades the mind and soul, leaving no escape. A chilling portrayal of a sinister force that consumes everything in its path, leaving nowhere to hide.",
			cover: "/John_Chezik_Look_At_Me-Album_Cover.png",
			audioFile: "/look_at_me.mp3",
			color: "from-indigo-600 to-blue-600"
		},
		{
			id: 5,
			title: "My Life",
			year: "2021",
			genre: "Soft/Acoustic",
			description: "A reflective anthem about the highs and lows of chasing the rock 'n' roll dream. It blends youthful ambition with the struggles of the road, capturing both the cost and the passion of a life dedicated to music, while celebrating the freedom and purpose found along the journey.",
			cover: "/John_Chezik_the_acoustic_album-_love_songs.png",
			audioFile: "/John_Chezik_My_Life.mp3",
			color: "from-orange-600 to-yellow-600"
		},
		{
			id: 6,
			title: "Something More",
			year: "2020",
			genre: "Soft/Piano",
			description: "A heartfelt ballad about enduring love and the strength it brings through life's challenges. It reflects on loyalty, gratitude, and the certainty of a bond that has stood the test of time, showing that true love always reveals something deeper and more meaningful.",
			cover: "/John_Chezik_my_favorite_ballads.png",
			audioFile: "/John_Chezik_something_more.mp3",
			color: "from-gray-600 to-slate-600"
		}
	];
	
	onMount(() => {
		mounted = true;
	});
	
	function handlePlayAlbum(albumId: number) {
		const album = albums.find(a => a.id === albumId);
		
		if (!album || !album.audioFile) {
			console.log(`No audio file available for album ${albumId}`);
			return;
		}
		
		// Stop currently playing audio
		if (audioElement) {
			audioElement.pause();
			audioElement.currentTime = 0;
		}
		
		// If clicking the same album that's playing, stop it
		if (currentlyPlaying === albumId) {
			currentlyPlaying = null;
			return;
		}
		
		// Create new audio element with security measures
		audioElement = new Audio(album.audioFile);
		
		// Security: Prevent downloading
		audioElement.preload = 'none';
		// Note: controlsList and disablePictureInPicture are for video elements
		audioElement.controls = false;
		
		// Play the audio
		audioElement.play().then(() => {
			currentlyPlaying = albumId;
		}).catch((error) => {
			console.error('Error playing audio:', error);
		});
		
		// Handle audio end
		audioElement.addEventListener('ended', () => {
			currentlyPlaying = null;
		});
	}
	
	function handleViewAlbum(albumId: number) {
		// Placeholder for view album functionality
		console.log(`Viewing album ${albumId}`);
	}
</script>

<section id="albums" class="section albums-section">
	<div class="container">
		<!-- Section Header -->
		<div class="section-header" class:mounted>
			<div class="section-badge">
				<Music size={16} />
				<span>Music Portfolio</span>
			</div>
			
			<h2 class="section-title">Latest Albums</h2>
			
			<p class="section-description">
				Explore my musical journey through these carefully crafted albums, 
				each telling a unique story through sound and melody.
			</p>
		</div>
		
		<!-- Albums Grid -->
		<div class="albums-grid" class:mounted>
			{#each albums as album, index}
				<div 
					class="album-card" 
					style="--delay: {index * 100}ms"
				>
					<!-- Album Cover -->
					<div class="album-cover">
						{#if album.cover && !album.cover.includes('placeholder')}
							<div class="actual-cover">
								<img 
									src={album.cover} 
									alt="{album.title} cover"
									class="cover-image"
								/>
								<div class="cover-overlay">
									<button 
										class="play-btn"
										on:click={() => handlePlayAlbum(album.id)}
										aria-label="{currentlyPlaying === album.id ? 'Pause' : 'Play'} {album.title}"
										class:playing={currentlyPlaying === album.id}
									>
										{#if currentlyPlaying === album.id}
											<Pause size={24} />
										{:else}
											<Play size={24} />
										{/if}
									</button>
								</div>
							</div>
						{:else}
							<div class="cover-placeholder bg-gradient-to-br {album.color}">
								<div class="cover-content">
									<Music size={48} class="cover-icon" />
									<div class="cover-overlay">
										<button 
											class="play-btn"
											on:click={() => handlePlayAlbum(album.id)}
											aria-label="{currentlyPlaying === album.id ? 'Pause' : 'Play'} {album.title}"
											class:playing={currentlyPlaying === album.id}
										>
											{#if currentlyPlaying === album.id}
												<Pause size={24} />
											{:else}
												<Play size={24} />
											{/if}
										</button>
									</div>
								</div>
							</div>
						{/if}
					</div>
					
					<!-- Album Info -->
					<div class="album-info">
						<div class="album-meta">
							<span class="album-year">{album.year}</span>
							<span class="album-genre">{album.genre}</span>
						</div>
						
						<h3 class="album-title">{album.title}</h3>
						
						<p class="album-description">{album.description}</p>
						
						<div class="album-actions">
							<button 
								class="btn btn-primary btn-sm"
								on:click={() => handlePlayAlbum(album.id)}
							>
								{#if currentlyPlaying === album.id}
									<Pause size={16} />
									Pause
								{:else}
									<Play size={16} />
									Play
								{/if}
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.albums-section {
		background: linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%);
		position: relative;
	}
	
	.albums-section::before {
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
	
	.albums-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: var(--space-xl);
		opacity: 0;
		transition: opacity 1s ease-out 0.3s;
	}
	
	.albums-grid.mounted {
		opacity: 1;
	}
	
	.album-card {
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-xl);
		padding: var(--space-lg);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		transition: all var(--transition-normal);
		opacity: 0;
		transform: translateY(30px);
		animation: slideInUp 0.6s ease-out forwards;
		animation-delay: var(--delay);
	}
	
	.album-card:hover {
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
	
	.album-cover {
		margin-bottom: var(--space-lg);
		position: relative;
		border-radius: var(--radius-lg);
		overflow: hidden;
	}
	
	.actual-cover {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		border-radius: var(--radius-lg);
	}
	
	.cover-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: all var(--transition-normal);
	}
	
	.cover-placeholder {
		aspect-ratio: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
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
	
	.album-card:hover .cover-overlay {
		opacity: 1;
	}
	
	.play-btn {
		background: var(--color-accent-primary);
		border: none;
		border-radius: 50%;
		width: 60px;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		cursor: pointer;
		transition: all var(--transition-normal);
		transform: scale(0.8);
	}
	
	.play-btn:hover {
		background: var(--color-accent-hover);
		transform: scale(1);
	}
	
	.play-btn.playing {
		background: var(--color-accent-hover);
		animation: pulse 2s infinite;
	}
	
	@keyframes pulse {
		0% { box-shadow: 0 0 0 0 rgba(0, 122, 255, 0.7); }
		70% { box-shadow: 0 0 0 10px rgba(0, 122, 255, 0); }
		100% { box-shadow: 0 0 0 0 rgba(0, 122, 255, 0); }
	}
	
	.album-info {
		text-align: center;
	}
	
	.album-meta {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-md);
		margin-bottom: var(--space-sm);
		font-size: var(--text-sm);
		color: var(--color-text-tertiary);
	}
	
	.album-year {
		background: var(--color-bg-elevated);
		padding: var(--space-xs) var(--space-sm);
		border-radius: var(--radius-sm);
	}
	
	.album-genre {
		font-weight: 500;
	}
	
	.album-title {
		font-size: var(--text-xl);
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: var(--space-sm);
	}
	
	.album-description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: 1.5;
		margin-bottom: var(--space-lg);
	}
	
	.album-actions {
		display: flex;
		gap: var(--space-sm);
		justify-content: center;
	}
	
	.btn-sm {
		padding: var(--space-xs) var(--space-md);
		font-size: var(--text-sm);
		gap: var(--space-xs);
	}
	
	/* Gradient utilities */
	.bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); }
	.from-blue-600 { --tw-gradient-from: #2563eb; --tw-gradient-to: rgb(37 99 235 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
	.to-purple-600 { --tw-gradient-to: #9333ea; }
	.from-green-600 { --tw-gradient-from: #16a34a; --tw-gradient-to: rgb(22 163 74 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
	.to-teal-600 { --tw-gradient-to: #0d9488; }
	.from-pink-600 { --tw-gradient-from: #db2777; --tw-gradient-to: rgb(219 39 119 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
	.to-red-600 { --tw-gradient-to: #dc2626; }
	.from-orange-600 { --tw-gradient-from: #ea580c; --tw-gradient-to: rgb(234 88 12 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
	.to-yellow-600 { --tw-gradient-to: #ca8a04; }
	.from-indigo-600 { --tw-gradient-from: #4f46e5; --tw-gradient-to: rgb(79 70 229 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
	.from-gray-600 { --tw-gradient-from: #4b5563; --tw-gradient-to: rgb(75 85 99 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
	.to-slate-600 { --tw-gradient-to: #475569; }
	
	@media (max-width: 768px) {
		.albums-grid {
			grid-template-columns: 1fr;
			gap: var(--space-lg);
		}
		
		.section-title {
			font-size: var(--text-4xl);
		}
	}
</style>
