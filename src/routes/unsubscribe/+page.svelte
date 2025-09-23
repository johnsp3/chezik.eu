<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Mail, CheckCircle, ArrowLeft, Heart } from 'lucide-svelte';
	import type { PageData } from './$types';
	
	export let data: PageData;
	
	let mounted = false;
	let email = data.email;
	let token = data.token;
	let isUnsubscribing = false;
	let unsubscribeStatus: 'idle' | 'success' | 'error' = 'idle';
	let message = '';
	
	onMount(() => {
		mounted = true;
	});
	
	async function handleUnsubscribe() {
		if (!email || isUnsubscribing) return;
		
		isUnsubscribing = true;
		unsubscribeStatus = 'idle';
		
		try {
			const response = await fetch('/api/unsubscribe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, token })
			});
			
			const result = await response.json();
			
			if (response.ok) {
				unsubscribeStatus = 'success';
				message = result.message;
			} else {
				unsubscribeStatus = 'error';
				message = result.error || 'Something went wrong. Please try again.';
			}
		} catch (error) {
			console.error('Unsubscribe error:', error);
			unsubscribeStatus = 'error';
			message = 'Something went wrong. Please try again.';
		} finally {
			isUnsubscribing = false;
		}
	}
</script>

<svelte:head>
	<title>Unsubscribe - John Chezik</title>
	<meta name="description" content="Unsubscribe from John Chezik's newsletter" />
</svelte:head>

<div class="unsubscribe-page">
	<div class="container">
		<!-- Header -->
		<div class="page-header" class:mounted>
			<div class="header-icon">
				<Mail size={32} />
			</div>
			<h1 class="page-title">Newsletter Unsubscribe</h1>
			<p class="page-description">
				We're sorry to see you go! You can unsubscribe from John Chezik's newsletter below.
			</p>
		</div>
		
		<!-- Main Content -->
		<div class="content-section" class:mounted>
			{#if unsubscribeStatus === 'success'}
				<!-- Success State -->
				<div class="success-card">
					<div class="success-icon">
						<CheckCircle size={48} />
					</div>
					<h2 class="success-title">You've been unsubscribed</h2>
					<p class="success-message">
						{message}
					</p>
					<div class="success-details">
						<p><strong>Email:</strong> {email}</p>
						<p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
					</div>
					<div class="success-actions">
						<a href="/" class="btn btn-primary">
							<ArrowLeft size={18} />
							Back to Website
						</a>
						<button 
							class="btn btn-secondary"
							on:click={() => {
								unsubscribeStatus = 'idle';
								message = '';
							}}
						>
							Resubscribe
						</button>
					</div>
				</div>
			{:else if unsubscribeStatus === 'error'}
				<!-- Error State -->
				<div class="error-card">
					<div class="error-icon">
						<Mail size={48} />
					</div>
					<h2 class="error-title">Something went wrong</h2>
					<p class="error-message">{message}</p>
					<div class="error-actions">
						<button 
							class="btn btn-primary"
							on:click={() => {
								unsubscribeStatus = 'idle';
								message = '';
							}}
						>
							Try Again
						</button>
						<a href="/" class="btn btn-secondary">
							Back to Website
						</a>
					</div>
				</div>
			{:else}
				<!-- Unsubscribe Form -->
				<div class="unsubscribe-card">
					<div class="card-header">
						<h2 class="card-title">Confirm Unsubscribe</h2>
						<p class="card-description">
							Are you sure you want to unsubscribe from John Chezik's newsletter? 
							You'll miss out on exclusive updates about new albums, books, and behind-the-scenes content.
						</p>
					</div>
					
					<div class="email-display">
						<div class="email-icon">
							<Mail size={20} />
						</div>
						<span class="email-text">{email || 'No email provided'}</span>
					</div>
					
					<div class="what-youll-miss">
						<h3 class="miss-title">What you'll miss:</h3>
						<div class="miss-features">
							<div class="feature">
								<span class="feature-icon">🎵</span>
								<span>New album releases & previews</span>
							</div>
							<div class="feature">
								<span class="feature-icon">📚</span>
								<span>Book updates & exclusive content</span>
							</div>
							<div class="feature">
								<span class="feature-icon">🎸</span>
								<span>Behind-the-scenes studio sessions</span>
							</div>
							<div class="feature">
								<span class="feature-icon">🎤</span>
								<span>Live events & concert announcements</span>
							</div>
						</div>
					</div>
					
					<div class="unsubscribe-actions">
						<button
							class="btn btn-primary btn-large"
							on:click={handleUnsubscribe}
							disabled={isUnsubscribing || !email}
						>
							{#if isUnsubscribing}
								<div class="spinner"></div>
								Unsubscribing...
							{:else}
								<Mail size={18} />
								Yes, Unsubscribe Me
							{/if}
						</button>
						
						<a href="/" class="btn btn-secondary btn-large">
							<ArrowLeft size={18} />
							Keep My Subscription
						</a>
					</div>
					
					<div class="alternative-option">
						<p class="alternative-text">
							Don't want to unsubscribe completely? 
							<a href="/preferences?email={email}" class="alternative-link">
								Adjust your email preferences instead
							</a>
						</p>
					</div>
				</div>
			{/if}
		</div>
		
		<!-- Footer -->
		<div class="page-footer" class:mounted>
			<div class="footer-content">
				<div class="footer-icon">
					<Heart size={20} />
				</div>
				<p class="footer-text">
					Thank you for being part of John Chezik's community. 
					You're always welcome back!
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	.unsubscribe-page {
		min-height: 100vh;
		background: linear-gradient(180deg, #000000 0%, #0f0f0f 50%, #000000 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-lg);
		position: relative;
	}
	
	.unsubscribe-page::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
	}
	
	.container {
		width: 100%;
		max-width: 600px;
		margin: 0 auto;
	}
	
	.page-header {
		text-align: center;
		margin-bottom: var(--space-4xl);
		opacity: 0;
		transform: translateY(30px);
		transition: all 0.8s ease-out;
	}
	
	.page-header.mounted {
		opacity: 1;
		transform: translateY(0);
	}
	
	.header-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 64px;
		height: 64px;
		background: var(--color-accent-primary);
		color: white;
		border-radius: 50%;
		margin-bottom: var(--space-lg);
	}
	
	.page-title {
		font-size: var(--text-4xl);
		font-weight: 800;
		color: var(--color-text-primary);
		margin-bottom: var(--space-md);
		background: linear-gradient(135deg, #ffffff, #a0a0a0);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	
	.page-description {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
		line-height: 1.6;
	}
	
	.content-section {
		opacity: 0;
		transition: opacity 1s ease-out 0.3s;
	}
	
	.content-section.mounted {
		opacity: 1;
	}
	
	.unsubscribe-card,
	.success-card,
	.error-card {
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-xl);
		padding: var(--space-2xl);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		text-align: center;
	}
	
	.card-header {
		margin-bottom: var(--space-xl);
	}
	
	.card-title {
		font-size: var(--text-2xl);
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: var(--space-md);
	}
	
	.card-description {
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		line-height: 1.6;
	}
	
	.email-display {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-sm);
		padding: var(--space-md);
		background: var(--color-bg-secondary);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-xl);
	}
	
	.email-icon {
		color: var(--color-accent-primary);
	}
	
	.email-text {
		font-weight: 600;
		color: var(--color-text-primary);
	}
	
	.what-youll-miss {
		margin-bottom: var(--space-xl);
		text-align: left;
	}
	
	.miss-title {
		font-size: var(--text-lg);
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: var(--space-md);
		text-align: center;
	}
	
	.miss-features {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-md);
	}
	
	.feature {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}
	
	.feature-icon {
		font-size: var(--text-base);
	}
	
	.unsubscribe-actions {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		margin-bottom: var(--space-lg);
	}
	
	.btn-large {
		width: 100%;
		padding: var(--space-md) var(--space-lg);
		font-size: var(--text-lg);
		font-weight: 600;
		gap: var(--space-sm);
	}
	
	.alternative-option {
		padding-top: var(--space-lg);
		border-top: 1px solid var(--glass-border);
	}
	
	.alternative-text {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		margin: 0;
	}
	
	.alternative-link {
		color: var(--color-accent-primary);
		text-decoration: none;
		font-weight: 500;
	}
	
	.alternative-link:hover {
		text-decoration: underline;
	}
	
	.success-card {
		text-align: center;
	}
	
	.success-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 80px;
		height: 80px;
		background: rgba(48, 209, 88, 0.1);
		color: #30d158;
		border-radius: 50%;
		margin-bottom: var(--space-lg);
	}
	
	.success-title {
		font-size: var(--text-2xl);
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: var(--space-md);
	}
	
	.success-message {
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		line-height: 1.6;
		margin-bottom: var(--space-lg);
	}
	
	.success-details {
		background: var(--color-bg-secondary);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-md);
		padding: var(--space-md);
		margin-bottom: var(--space-lg);
		text-align: left;
	}
	
	.success-details p {
		margin: 0 0 var(--space-xs) 0;
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}
	
	.success-details p:last-child {
		margin-bottom: 0;
	}
	
	.success-actions {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}
	
	.error-card {
		text-align: center;
	}
	
	.error-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 80px;
		height: 80px;
		background: rgba(255, 69, 58, 0.1);
		color: #ff453a;
		border-radius: 50%;
		margin-bottom: var(--space-lg);
	}
	
	.error-title {
		font-size: var(--text-2xl);
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: var(--space-md);
	}
	
	.error-message {
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		line-height: 1.6;
		margin-bottom: var(--space-lg);
	}
	
	.error-actions {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}
	
	.spinner {
		width: 18px;
		height: 18px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top: 2px solid white;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}
	
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
	
	.page-footer {
		text-align: center;
		margin-top: var(--space-4xl);
		opacity: 0;
		transition: opacity 1s ease-out 0.6s;
	}
	
	.page-footer.mounted {
		opacity: 1;
	}
	
	.footer-content {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-sm);
		padding: var(--space-lg);
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}
	
	.footer-icon {
		color: var(--color-accent-primary);
	}
	
	.footer-text {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		margin: 0;
	}
	
	@media (max-width: 640px) {
		.unsubscribe-page {
			padding: var(--space-md);
		}
		
		.page-title {
			font-size: var(--text-3xl);
		}
		
		.miss-features {
			grid-template-columns: 1fr;
		}
		
		.unsubscribe-card,
		.success-card,
		.error-card {
			padding: var(--space-xl);
		}
	}
</style>
