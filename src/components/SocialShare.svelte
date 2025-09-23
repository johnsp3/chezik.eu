<script lang="ts">
	import { Share2, Twitter, Facebook, Linkedin, Copy, CheckCircle } from 'lucide-svelte';
	
	export let title = '';
	export let description = '';
	export let url = '';
	export let hashtags = '';
	
	let showShareMenu = false;
	let copied = false;
	
	const currentUrl = typeof window !== 'undefined' ? window.location.href : url;
	const shareTitle = title || 'John Chezik - Platinum-Selling Songwriter-Singer & Guitar Player';
	const shareDescription = description || 'Explore 6 albums and 2 books from a platinum-selling artist';
	const shareHashtags = hashtags || 'JohnChezik,Music,Rock,Books,Artist';
	
	function toggleShareMenu() {
		showShareMenu = !showShareMenu;
	}
	
	function shareToTwitter() {
		const text = `${shareTitle} - ${shareDescription}`;
		const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}&hashtags=${encodeURIComponent(shareHashtags)}`;
		window.open(twitterUrl, '_blank', 'width=550,height=420');
		showShareMenu = false;
	}
	
	function shareToFacebook() {
		const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(shareTitle)}`;
		window.open(facebookUrl, '_blank', 'width=550,height=420');
		showShareMenu = false;
	}
	
	function shareToLinkedIn() {
		const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(shareTitle)}&summary=${encodeURIComponent(shareDescription)}`;
		window.open(linkedinUrl, '_blank', 'width=550,height=420');
		showShareMenu = false;
	}
	
	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(currentUrl);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (error) {
			console.error('Failed to copy URL:', error);
		}
		showShareMenu = false;
	}
	
	function handleNativeShare() {
		if (navigator.share) {
			navigator.share({
				title: shareTitle,
				text: shareDescription,
				url: currentUrl
			}).catch(console.error);
		} else {
			toggleShareMenu();
		}
	}
	
	// Close menu when clicking outside
	function handleClickOutside(event: MouseEvent) {
		if (showShareMenu && !(event.target as Element).closest('.social-share')) {
			showShareMenu = false;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="social-share">
	<button 
		class="share-button"
		on:click={handleNativeShare}
		aria-label="Share this page"
	>
		<Share2 size={18} />
		<span class="share-text">Share</span>
	</button>
	
	{#if showShareMenu}
		<div class="share-menu">
			<button class="share-option twitter" on:click={shareToTwitter}>
				<Twitter size={16} />
				<span>Twitter</span>
			</button>
			
			<button class="share-option facebook" on:click={shareToFacebook}>
				<Facebook size={16} />
				<span>Facebook</span>
			</button>
			
			<button class="share-option linkedin" on:click={shareToLinkedIn}>
				<Linkedin size={16} />
				<span>LinkedIn</span>
			</button>
			
			<button class="share-option copy" on:click={copyToClipboard}>
				{#if copied}
					<CheckCircle size={16} />
					<span>Copied!</span>
				{:else}
					<Copy size={16} />
					<span>Copy Link</span>
				{/if}
			</button>
		</div>
	{/if}
</div>

<style>
	.social-share {
		position: relative;
		display: inline-block;
	}
	
	.share-button {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md);
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-md);
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
		font-weight: 500;
		cursor: pointer;
		transition: all var(--transition-normal);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}
	
	.share-button:hover {
		color: var(--color-text-primary);
		border-color: var(--color-accent-primary);
		transform: translateY(-1px);
	}
	
	.share-text {
		font-family: inherit;
	}
	
	.share-menu {
		position: absolute;
		top: calc(100% + var(--space-sm));
		left: 50%;
		transform: translateX(-50%);
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		padding: var(--space-sm);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		box-shadow: var(--shadow-xl);
		z-index: 100;
		min-width: 140px;
		animation: slideIn 0.2s ease-out;
	}
	
	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}
	
	.share-option {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		width: 100%;
		padding: var(--space-sm) var(--space-md);
		background: none;
		border: none;
		border-radius: var(--radius-md);
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
		font-weight: 500;
		cursor: pointer;
		transition: all var(--transition-normal);
		text-align: left;
		font-family: inherit;
	}
	
	.share-option:hover {
		background: var(--color-bg-elevated);
		color: var(--color-text-primary);
	}
	
	.share-option.twitter:hover {
		color: #1da1f2;
	}
	
	.share-option.facebook:hover {
		color: #4267b2;
	}
	
	.share-option.linkedin:hover {
		color: #0077b5;
	}
	
	.share-option.copy:hover {
		color: var(--color-accent-primary);
	}
	
	.share-option.copy {
		border-top: 1px solid var(--glass-border);
		margin-top: var(--space-xs);
		padding-top: var(--space-sm);
	}
	
	@media (max-width: 480px) {
		.share-menu {
			left: 0;
			right: 0;
			transform: none;
			min-width: auto;
		}
	}
</style>
