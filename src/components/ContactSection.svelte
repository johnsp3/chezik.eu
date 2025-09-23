<script lang="ts">
	import { onMount } from 'svelte';
	import { Mail, MessageCircle, Send, MapPin, Phone, Globe } from 'lucide-svelte';
	import NewsletterSignup from './NewsletterSignup.svelte';
	import SocialShare from './SocialShare.svelte';
	
	let mounted = false;
	let form = {
		name: '',
		email: '',
		subject: '',
		message: ''
	};
	let isSubmitting = false;
	let submitStatus = '';
	
	const contactInfo = [
		{
			icon: Mail,
			title: 'Email',
			value: 'media@johnchezik.com',
			href: '#',
			color: 'text-blue-400'
		},
		{
			icon: Globe,
			title: 'Website',
			value: 'www.chezik.eu',
			href: '#',
			color: 'text-orange-400'
		}
	];
	
	onMount(() => {
		mounted = true;
	});
	
	async function handleSubmit(event: Event) {
		event.preventDefault();
		
		if (isSubmitting) return;
		
		// Basic validation
		if (!form.name || !form.email || !form.message) {
			submitStatus = 'Please fill in all required fields.';
			return;
		}
		
		isSubmitting = true;
		submitStatus = '';
		
		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(form)
			});
			
			const result = await response.json();
			
			if (response.ok) {
				submitStatus = result.message;
				// Reset form
				form = {
					name: '',
					email: '',
					subject: '',
					message: ''
				};
			} else {
				submitStatus = result.error || 'Something went wrong. Please try again.';
			}
		} catch (error) {
			console.error('Form submission error:', error);
			submitStatus = 'Sorry, there was an error sending your message. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<section id="contact" class="section contact-section">
	<div class="container">
		<!-- Section Header -->
		<div class="section-header" class:mounted>
			<div class="section-badge">
				<MessageCircle size={16} />
				<span>Get In Touch</span>
			</div>
			
			<h2 class="section-title">Professional Contact</h2>
			
			<p class="section-description">
				For professional inquiries, media requests, or business-related matters.
			</p>
		</div>
		
		<div class="contact-content" class:mounted>
			<!-- Main Contact Section -->
			<div class="main-contact-section">
				<!-- Professional Photo & Bio -->
				<div class="photo-bio-section">
					<div class="photo-wrapper">
						<img 
							src="/John_Studio_1300x1040.png" 
							alt="John Chezik in his professional studio"
							class="contact-photo"
						/>
						<div class="photo-glow"></div>
					</div>
					<div class="bio-content">
						<h3 class="bio-title">John Chezik</h3>
						<p class="bio-subtitle">Platinum-selling songwriter-singer, guitar player and published author</p>
					</div>
				</div>
				
				<!-- Contact Form -->
				<div class="contact-form-section">
					<div class="form-header">
						<h3 class="form-title">Send a Message</h3>
						<p class="form-description">
							For professional inquiries
						</p>
					</div>
					
					<form on:submit={handleSubmit} class="contact-form">
						<div class="form-group">
							<label for="name" class="form-label">Name *</label>
							<input
								id="name"
								type="text"
								class="form-input"
								placeholder="Your full name"
								bind:value={form.name}
								required
								disabled={isSubmitting}
							/>
						</div>
						
						<div class="form-group">
							<label for="email" class="form-label">Email *</label>
							<input
								id="email"
								type="email"
								class="form-input"
								placeholder="your.email@example.com"
								bind:value={form.email}
								required
								disabled={isSubmitting}
							/>
						</div>
						
						<div class="form-group">
							<label for="subject" class="form-label">Subject</label>
							<input
								id="subject"
								type="text"
								class="form-input"
								placeholder="What's this about?"
								bind:value={form.subject}
								disabled={isSubmitting}
							/>
						</div>
						
						<div class="form-group">
							<label for="message" class="form-label">Message *</label>
							<textarea
								id="message"
								class="form-textarea"
								placeholder="Tell me about your project, question, or collaboration idea..."
								bind:value={form.message}
								required
								disabled={isSubmitting}
							></textarea>
						</div>
						
						{#if submitStatus}
							<div class="submit-status {submitStatus.includes('Thank you') ? 'success' : 'error'}">
								{submitStatus}
							</div>
						{/if}
						
						<button
							type="submit"
							class="btn btn-primary btn-large"
							disabled={isSubmitting}
						>
							{#if isSubmitting}
								<div class="spinner"></div>
								Sending...
							{:else}
								<Send size={18} />
								Send Message
							{/if}
						</button>
					</form>
				</div>
			</div>
			
			<!-- Stay Connected Section -->
			<div class="stay-connected-section">
				<NewsletterSignup />
				
				<div class="social-sharing">
					<h4 class="social-title">Share This Page</h4>
					<p class="social-description">
						Help others discover John's music and books.
					</p>
					<div class="social-actions">
						<SocialShare 
							title="John Chezik - Platinum-Selling Artist"
							description="Explore 6 albums and 2 books from a platinum-selling songwriter-singer and author"
							hashtags="JohnChezik,Music,Rock,Books,Artist"
						/>
					</div>
				</div>
				
				<!-- Contact Methods -->
				<div class="contact-methods-section">
					<h4 class="contact-section-title">Direct Contact</h4>
					<p class="contact-section-description">
						For professional inquiries
					</p>
					
					<div class="contact-methods">
						{#each contactInfo as info, index}
							<div 
								class="contact-method"
								style="--delay: {index * 100}ms"
							>
								<div class="method-icon {info.color}">
									<svelte:component this={info.icon} size={20} />
								</div>
								<div class="method-content">
									<div class="method-title">{info.title}</div>
									<div class="method-value">{info.value}</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.contact-section {
		background: linear-gradient(180deg, #000000 0%, #0f0f0f 50%, #000000 100%);
		position: relative;
	}
	
	.contact-section::before {
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
	
	.contact-content {
		display: grid;
		grid-template-columns: 1fr 0.6fr;
		gap: var(--space-4xl);
		opacity: 0;
		transition: opacity 1s ease-out 0.3s;
		align-items: start;
	}
	
	.contact-content.mounted {
		opacity: 1;
	}
	
	.main-contact-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xl);
		height: 100%;
	}
	
	.photo-bio-section {
		display: flex;
		align-items: center;
		gap: var(--space-xl);
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-xl);
		padding: var(--space-xl);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}
	
	.photo-wrapper {
		position: relative;
		width: 200px;
		height: 200px;
		flex-shrink: 0;
	}
	
	.contact-photo {
		width: 100%;
		height: 100%;
		border-radius: var(--radius-lg);
		object-fit: cover;
		transition: all var(--transition-normal);
		position: relative;
		z-index: 2;
		border: 3px solid rgba(255, 255, 255, 0.1);
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
	}
	
	.contact-photo:hover {
		transform: translateY(-2px);
		border-color: var(--color-accent-primary);
		box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
	}
	
	.photo-glow {
		position: absolute;
		inset: -20px;
		background: conic-gradient(from 0deg, #007aff, #5856d6, #ff2d92, #ff6b35, #30d158, #007aff);
		border-radius: var(--radius-xl);
		opacity: 0.2;
		filter: blur(30px);
		animation: rotate 10s linear infinite;
		z-index: 1;
	}
	
	@keyframes rotate {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
	
	.bio-content {
		flex: 1;
	}
	
	.bio-title {
		font-size: var(--text-2xl);
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: var(--space-sm);
		background: linear-gradient(135deg, #ffffff, #007aff);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	
	.bio-subtitle {
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		line-height: 1.5;
	}
	
	.contact-form-section {
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-xl);
		padding: var(--space-xl);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}
	
	.contact-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}
	
	.form-header {
		margin-bottom: var(--space-2xl);
		text-align: center;
	}
	
	.form-title {
		font-size: var(--text-2xl);
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: var(--space-sm);
	}
	
	.form-description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}
	
	.form-group {
		margin-bottom: var(--space-lg);
	}
	
	.form-label {
		display: block;
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-text-primary);
		margin-bottom: var(--space-sm);
	}
	
	.form-input,
	.form-textarea {
		width: 100%;
		padding: var(--space-md);
		background: var(--color-bg-secondary);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-md);
		color: var(--color-text-primary);
		font-size: var(--text-base);
		transition: all var(--transition-normal);
		font-family: inherit;
	}
	
	.form-input:focus,
	.form-textarea:focus {
		outline: none;
		border-color: var(--color-accent-primary);
		box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
	}
	
	.form-input::placeholder,
	.form-textarea::placeholder {
		color: var(--color-text-tertiary);
	}
	
	.form-textarea {
		resize: vertical;
		min-height: 120px;
	}
	
	.submit-status {
		padding: var(--space-md);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		margin-bottom: var(--space-lg);
		text-align: center;
	}
	
	.submit-status.success {
		background: rgba(48, 209, 88, 0.1);
		border: 1px solid rgba(48, 209, 88, 0.3);
		color: #30d158;
	}
	
	.submit-status.error {
		background: rgba(255, 69, 58, 0.1);
		border: 1px solid rgba(255, 69, 58, 0.3);
		color: #ff453a;
	}
	
	.btn-large {
		width: 100%;
		padding: var(--space-md) var(--space-lg);
		font-size: var(--text-lg);
		font-weight: 600;
		gap: var(--space-sm);
	}
	
	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
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
	
	.contact-methods-section {
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-xl);
		padding: var(--space-lg);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}
	
	.contact-section-title {
		font-size: var(--text-xl);
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: var(--space-sm);
	}
	
	.contact-section-description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: 1.6;
		margin-bottom: var(--space-lg);
	}
	
	.contact-methods {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}
	
	.contact-method {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-md);
		background: var(--color-bg-secondary);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-md);
		text-decoration: none;
		color: inherit;
		transition: all var(--transition-normal);
		opacity: 0;
		transform: translateX(30px);
		animation: slideInRight 0.6s ease-out forwards;
		animation-delay: var(--delay);
	}
	
	.contact-method:hover {
		transform: translateY(-2px);
		border-color: var(--color-accent-primary);
	}
	
	@keyframes slideInRight {
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
	
	.method-icon {
		flex-shrink: 0;
	}
	
	.method-content {
		flex: 1;
	}
	
	.method-title {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: var(--space-xs);
	}
	
	.method-value {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}
	
	.text-blue-400 { color: #60a5fa; }
	.text-green-400 { color: #4ade80; }
	.text-purple-400 { color: #c084fc; }
	.text-orange-400 { color: #fb923c; }
	
	
	.stay-connected-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
		height: 100%;
		justify-content: space-between;
	}
	
	.social-sharing {
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-xl);
		padding: var(--space-xl);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		text-align: center;
	}
	
	.social-title {
		font-size: var(--text-lg);
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: var(--space-sm);
	}
	
	.social-description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: 1.5;
		margin-bottom: var(--space-lg);
	}
	
	.social-actions {
		display: flex;
		justify-content: center;
	}
	
	@media (max-width: 968px) {
		.contact-content {
			grid-template-columns: 1fr;
			gap: var(--space-2xl);
		}
		
		.photo-bio-section {
			flex-direction: column;
			text-align: center;
			gap: var(--space-lg);
		}
		
		.photo-wrapper {
			width: 150px;
			height: 150px;
		}
	}
	
	@media (max-width: 640px) {
		.contact-content {
			gap: var(--space-xl);
		}
		
		.photo-bio-section {
			padding: var(--space-lg);
		}
		
		.photo-wrapper {
			width: 120px;
			height: 120px;
		}
		
		.bio-title {
			font-size: var(--text-xl);
		}
		
		.bio-subtitle {
			font-size: var(--text-sm);
		}
		
		.contact-methods-section {
			padding: var(--space-lg);
		}
		
		.social-sharing {
			padding: var(--space-lg);
		}
	}
	
	@media (max-width: 768px) {
		.section-title {
			font-size: var(--text-4xl);
		}
		
		.cta-features {
			align-items: center;
		}
	}
</style>
