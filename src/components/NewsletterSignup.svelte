<script lang="ts">
	import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-svelte';
	
	let email = '';
	let isSubmitting = false;
	let status: 'idle' | 'success' | 'error' = 'idle';
	let message = '';
	
	async function handleSubmit(event: Event) {
		event.preventDefault();
		
		if (!email || isSubmitting) return;
		
		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			status = 'error';
			message = 'Please enter a valid email address.';
			return;
		}
		
		isSubmitting = true;
		status = 'idle';
		
	try {
		const response = await fetch('/api/newsletter', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email })
		});
		
		const result = await response.json();
		
		if (response.ok) {
			status = 'success';
			message = result.message;
			email = '';
		} else {
			status = 'error';
			message = result.error || 'Something went wrong. Please try again.';
		}
	} catch (error) {
		console.error('Newsletter signup error:', error);
		status = 'error';
		message = 'Something went wrong. Please try again.';
	} finally {
		isSubmitting = false;
		
		// Clear status after 5 seconds
		setTimeout(() => {
			status = 'idle';
			message = '';
		}, 5000);
	}
	}
</script>

<div class="newsletter-signup">
	<div class="newsletter-header">
		<div class="newsletter-icon">
			<Mail size={24} />
		</div>
		<h3 class="newsletter-title">Stay Updated</h3>
		<p class="newsletter-description">
			Get notified about new albums, book releases, and exclusive content.
		</p>
	</div>
	
	<form class="newsletter-form" on:submit={handleSubmit}>
		<div class="input-group">
			<input
				type="email"
				bind:value={email}
				placeholder="Enter your email address"
				class="newsletter-input"
				disabled={isSubmitting}
				required
			/>
			<button
				type="submit"
				class="newsletter-button"
				disabled={isSubmitting || !email}
				aria-label="Subscribe to newsletter"
			>
				{#if isSubmitting}
					<div class="spinner"></div>
				{:else}
					<Send size={18} />
				{/if}
			</button>
		</div>
		
		{#if status !== 'idle' && message}
			<div class="status-message" class:success={status === 'success'} class:error={status === 'error'}>
				<div class="status-icon">
					{#if status === 'success'}
						<CheckCircle size={16} />
					{:else}
						<AlertCircle size={16} />
					{/if}
				</div>
				<span class="status-text">{message}</span>
			</div>
		{/if}
	</form>
	
	<div class="newsletter-features">
		<div class="feature">
			<span class="feature-bullet">🎵</span>
			<span>New album releases</span>
		</div>
		<div class="feature">
			<span class="feature-bullet">📚</span>
			<span>Book updates & previews</span>
		</div>
		<div class="feature">
			<span class="feature-bullet">🎸</span>
			<span>Behind-the-scenes content</span>
		</div>
	</div>
	
	<p class="newsletter-privacy">
		No spam, unsubscribe at any time. Your email is safe with us.
	</p>
</div>

<style>
	.newsletter-signup {
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-xl);
		padding: var(--space-2xl);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		text-align: center;
		transition: all var(--transition-normal);
	}
	
	.newsletter-signup:hover {
		border-color: var(--color-accent-primary);
		transform: translateY(-2px);
		box-shadow: 0 10px 30px rgba(0, 122, 255, 0.1);
	}
	
	.newsletter-header {
		margin-bottom: var(--space-xl);
	}
	
	.newsletter-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		background: var(--color-accent-primary);
		color: white;
		border-radius: 50%;
		margin-bottom: var(--space-md);
	}
	
	.newsletter-title {
		font-size: var(--text-xl);
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: var(--space-sm);
	}
	
	.newsletter-description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: 1.5;
		max-width: 280px;
		margin: 0 auto;
	}
	
	.newsletter-form {
		margin-bottom: var(--space-lg);
	}
	
	.input-group {
		display: flex;
		gap: var(--space-sm);
		margin-bottom: var(--space-md);
	}
	
	.newsletter-input {
		flex: 1;
		padding: var(--space-md);
		background: var(--color-bg-secondary);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-md);
		color: var(--color-text-primary);
		font-size: var(--text-sm);
		transition: all var(--transition-normal);
		font-family: inherit;
	}
	
	.newsletter-input:focus {
		outline: none;
		border-color: var(--color-accent-primary);
		box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
	}
	
	.newsletter-input::placeholder {
		color: var(--color-text-tertiary);
	}
	
	.newsletter-input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	
	.newsletter-button {
		flex-shrink: 0;
		width: 48px;
		height: 48px;
		background: var(--color-accent-primary);
		border: none;
		border-radius: var(--radius-md);
		color: white;
		cursor: pointer;
		transition: all var(--transition-normal);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.newsletter-button:hover:not(:disabled) {
		background: var(--color-accent-hover);
		transform: translateY(-1px);
	}
	
	.newsletter-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}
	
	.spinner {
		width: 16px;
		height: 16px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top: 2px solid white;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}
	
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
	
	.status-message {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: 500;
		animation: slideIn 0.3s ease-out;
	}
	
	.status-message.success {
		background: rgba(48, 209, 88, 0.1);
		border: 1px solid rgba(48, 209, 88, 0.3);
		color: #30d158;
	}
	
	.status-message.error {
		background: rgba(255, 69, 58, 0.1);
		border: 1px solid rgba(255, 69, 58, 0.3);
		color: #ff453a;
	}
	
	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	.newsletter-features {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		margin-bottom: var(--space-lg);
	}
	
	.feature {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-sm);
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}
	
	.feature-bullet {
		font-size: var(--text-base);
	}
	
	.newsletter-privacy {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		margin: 0;
		line-height: 1.4;
	}
	
	@media (max-width: 480px) {
		.newsletter-signup {
			padding: var(--space-lg);
		}
		
		.input-group {
			flex-direction: column;
		}
		
		.newsletter-button {
			width: 100%;
		}
	}
</style>
