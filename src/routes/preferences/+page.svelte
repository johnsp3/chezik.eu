<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Settings, Mail, CheckCircle, ArrowLeft, Save, Music, BookOpen, Camera, Calendar } from 'lucide-svelte';
	import type { PageData } from './$types';
	
	export let data: PageData;
	
	let mounted = false;
	let email = data.email;
	let token = data.token;
	let isSaving = false;
	let saveStatus: 'idle' | 'success' | 'error' = 'idle';
	let message = '';
	
	// Preferences state
	let preferences = {
		frequency: 'weekly',
		contentTypes: {
			albums: true,
			books: true,
			studio: true,
			events: true
		},
		emailAddress: data.email
	};
	
	onMount(() => {
		mounted = true;
		// Load existing preferences if available (only if email and token are provided)
		if (email && token) {
			loadPreferences();
		}
	});
	
	async function loadPreferences() {
		if (!email) return;
		
		try {
			const response = await fetch(`/api/preferences?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`);
			if (response.ok) {
				const data = await response.json();
				preferences = { ...preferences, ...data.preferences };
			}
		} catch (error) {
			console.error('Error loading preferences:', error);
		}
	}
	
	async function handleSave() {
		if (!email || isSaving) return;
		
		isSaving = true;
		saveStatus = 'idle';
		
		try {
			const response = await fetch('/api/preferences', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ 
					email,
					token,
					preferences 
				})
			});
			
			const result = await response.json();
			
			if (response.ok) {
				saveStatus = 'success';
				message = result.message;
			} else {
				saveStatus = 'error';
				message = result.error || 'Something went wrong. Please try again.';
			}
		} catch (error) {
			console.error('Save preferences error:', error);
			saveStatus = 'error';
			message = 'Something went wrong. Please try again.';
		} finally {
			isSaving = false;
		}
	}
	
	function toggleContentType(type: keyof typeof preferences.contentTypes) {
		preferences.contentTypes[type] = !preferences.contentTypes[type];
	}
</script>

<svelte:head>
	<title>Email Preferences - John Chezik</title>
	<meta name="description" content="Manage your email preferences for John Chezik's newsletter" />
</svelte:head>

<div class="preferences-page">
	<div class="container">
		<!-- Header -->
		<div class="page-header" class:mounted>
			<div class="header-icon">
				<Settings size={32} />
			</div>
			<h1 class="page-title">Email Preferences</h1>
			<p class="page-description">
				Customize your newsletter experience. Choose what content you want to receive and how often.
			</p>
		</div>
		
		<!-- Main Content -->
		<div class="content-section" class:mounted>
			{#if saveStatus === 'success'}
				<!-- Success State -->
				<div class="success-card">
					<div class="success-icon">
						<CheckCircle size={48} />
					</div>
					<h2 class="success-title">Preferences Updated</h2>
					<p class="success-message">
						{message}
					</p>
					<div class="success-actions">
						<button 
							class="btn btn-primary"
							on:click={() => {
								saveStatus = 'idle';
								message = '';
							}}
						>
							Continue Editing
						</button>
						<a href="/" class="btn btn-secondary">
							<ArrowLeft size={18} />
							Back to Website
						</a>
					</div>
				</div>
			{:else if saveStatus === 'error'}
				<!-- Error State -->
				<div class="error-card">
					<div class="error-icon">
						<Settings size={48} />
					</div>
					<h2 class="error-title">Something went wrong</h2>
					<p class="error-message">{message}</p>
					<div class="error-actions">
						<button 
							class="btn btn-primary"
							on:click={() => {
								saveStatus = 'idle';
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
				<!-- Preferences Form -->
				<div class="preferences-card">
					<div class="card-header">
						<h2 class="card-title">Manage Your Subscription</h2>
						<p class="card-description">
							Personalize your newsletter experience by choosing your preferences below.
						</p>
					</div>
					
					<div class="email-display">
						<div class="email-icon">
							<Mail size={20} />
						</div>
						<span class="email-text">{email || 'No email provided'}</span>
					</div>
					
					<form on:submit|preventDefault={handleSave} class="preferences-form">
						<!-- Email Frequency -->
						<div class="preference-group">
							<h3 class="group-title">
								<Mail size={20} />
								Email Frequency
							</h3>
							<p class="group-description">
								How often would you like to receive emails?
							</p>
							<div class="frequency-options">
								<label class="frequency-option">
									<input
										type="radio"
										bind:group={preferences.frequency}
										value="weekly"
										class="frequency-input"
									/>
									<div class="option-content">
										<div class="option-title">Weekly</div>
										<div class="option-description">Get updates every week</div>
									</div>
								</label>
								
								<label class="frequency-option">
									<input
										type="radio"
										bind:group={preferences.frequency}
										value="monthly"
										class="frequency-input"
									/>
									<div class="option-content">
										<div class="option-title">Monthly</div>
										<div class="option-description">Get updates once a month</div>
									</div>
								</label>
								
								<label class="frequency-option">
									<input
										type="radio"
										bind:group={preferences.frequency}
										value="major"
										class="frequency-input"
									/>
									<div class="option-content">
										<div class="option-title">Major Updates Only</div>
										<div class="option-description">Only for new albums and books</div>
									</div>
								</label>
							</div>
						</div>
						
						<!-- Content Types -->
						<div class="preference-group">
							<h3 class="group-title">
								<Settings size={20} />
								Content Types
							</h3>
							<p class="group-description">
								Choose what type of content you want to receive:
							</p>
							<div class="content-options">
								<label class="content-option">
									<input
										type="checkbox"
										bind:checked={preferences.contentTypes.albums}
										class="content-input"
									/>
									<div class="option-icon">
										<Music size={20} />
									</div>
									<div class="option-content">
										<div class="option-title">New Album Releases</div>
										<div class="option-description">Exclusive previews and behind-the-scenes content</div>
									</div>
								</label>
								
								<label class="content-option">
									<input
										type="checkbox"
										bind:checked={preferences.contentTypes.books}
										class="content-input"
									/>
									<div class="option-icon">
										<BookOpen size={20} />
									</div>
									<div class="option-content">
										<div class="option-title">Book Updates</div>
										<div class="option-description">Early access to new chapters and insights</div>
									</div>
								</label>
								
								<label class="content-option">
									<input
										type="checkbox"
										bind:checked={preferences.contentTypes.studio}
										class="content-input"
									/>
									<div class="option-icon">
										<Camera size={20} />
									</div>
									<div class="option-content">
										<div class="option-title">Studio Sessions</div>
										<div class="option-description">Behind-the-scenes footage and stories</div>
									</div>
								</label>
								
								<label class="content-option">
									<input
										type="checkbox"
										bind:checked={preferences.contentTypes.events}
										class="content-input"
									/>
									<div class="option-icon">
										<Calendar size={20} />
									</div>
									<div class="option-content">
										<div class="option-title">Live Events</div>
										<div class="option-description">Concert dates, book signings, and meetups</div>
									</div>
								</label>
							</div>
						</div>
						
						<!-- Save Actions -->
						<div class="save-actions">
							<button
								type="submit"
								class="btn btn-primary btn-large"
								disabled={isSaving}
							>
								{#if isSaving}
									<div class="spinner"></div>
									Saving...
								{:else}
									<Save size={18} />
									Save Preferences
								{/if}
							</button>
							
							<a href="/" class="btn btn-secondary btn-large">
								<ArrowLeft size={18} />
								Back to Website
							</a>
						</div>
					</form>
					
					<div class="unsubscribe-option">
						<p class="unsubscribe-text">
							Want to unsubscribe completely? 
							<a href="/unsubscribe?email={email}" class="unsubscribe-link">
								Click here to unsubscribe
							</a>
						</p>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.preferences-page {
		min-height: 100vh;
		background: linear-gradient(180deg, #000000 0%, #0f0f0f 50%, #000000 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-lg);
		position: relative;
	}
	
	.preferences-page::before {
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
		max-width: 700px;
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
	
	.preferences-card,
	.success-card,
	.error-card {
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-xl);
		padding: var(--space-2xl);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}
	
	.card-header {
		text-align: center;
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
	
	.preferences-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xl);
	}
	
	.preference-group {
		background: var(--color-bg-secondary);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		padding: var(--space-xl);
	}
	
	.group-title {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: var(--text-xl);
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: var(--space-sm);
	}
	
	.group-description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		margin-bottom: var(--space-lg);
		line-height: 1.5;
	}
	
	.frequency-options {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}
	
	.frequency-option {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		padding: var(--space-lg);
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all var(--transition-normal);
	}
	
	.frequency-option:hover {
		border-color: var(--color-accent-primary);
		background: var(--color-bg-elevated);
	}
	
	.frequency-input {
		width: 20px;
		height: 20px;
		accent-color: var(--color-accent-primary);
	}
	
	.option-content {
		flex: 1;
	}
	
	.option-title {
		font-size: var(--text-base);
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: var(--space-xs);
	}
	
	.option-description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}
	
	.content-options {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-md);
	}
	
	.content-option {
		display: flex;
		align-items: flex-start;
		gap: var(--space-md);
		padding: var(--space-lg);
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all var(--transition-normal);
	}
	
	.content-option:hover {
		border-color: var(--color-accent-primary);
		background: var(--color-bg-elevated);
	}
	
	.content-input {
		width: 20px;
		height: 20px;
		accent-color: var(--color-accent-primary);
		margin-top: 2px;
	}
	
	.option-icon {
		color: var(--color-accent-primary);
		flex-shrink: 0;
	}
	
	.save-actions {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		margin-top: var(--space-lg);
	}
	
	.btn-large {
		width: 100%;
		padding: var(--space-md) var(--space-lg);
		font-size: var(--text-lg);
		font-weight: 600;
		gap: var(--space-sm);
	}
	
	.unsubscribe-option {
		padding-top: var(--space-lg);
		border-top: 1px solid var(--glass-border);
		text-align: center;
		margin-top: var(--space-lg);
	}
	
	.unsubscribe-text {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		margin: 0;
	}
	
	.unsubscribe-link {
		color: var(--color-accent-primary);
		text-decoration: none;
		font-weight: 500;
	}
	
	.unsubscribe-link:hover {
		text-decoration: underline;
	}
	
	.success-card,
	.error-card {
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
	
	.success-actions {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
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
	
	@media (max-width: 768px) {
		.content-options {
			grid-template-columns: 1fr;
		}
		
		.preferences-page {
			padding: var(--space-md);
		}
		
		.page-title {
			font-size: var(--text-3xl);
		}
		
		.preferences-card,
		.success-card,
		.error-card {
			padding: var(--space-xl);
		}
	}
</style>
