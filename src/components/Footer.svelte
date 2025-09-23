<script lang="ts">
	import { Music, BookOpen, Heart, Github, Twitter, Instagram, Linkedin } from 'lucide-svelte';
	
	const currentYear = new Date().getFullYear();
	let showPrivacyPolicy = false;
	let showTermsOfService = false;
	
	function openPrivacyPolicy() {
		showPrivacyPolicy = true;
	}
	
	function closePrivacyPolicy() {
		showPrivacyPolicy = false;
	}
	
	function openTermsOfService() {
		showTermsOfService = true;
	}
	
	function closeTermsOfService() {
		showTermsOfService = false;
	}
	
	const socialLinks = [
		{ icon: Github, href: 'https://github.com/johnchezik', label: 'GitHub' },
		{ icon: Twitter, href: 'https://twitter.com/johnchezik', label: 'Twitter' },
		{ icon: Instagram, href: 'https://instagram.com/johnchezik', label: 'Instagram' },
		{ icon: Linkedin, href: 'https://linkedin.com/in/johnchezik', label: 'LinkedIn' }
	];
	
	const quickLinks = [
		{ href: '#home', label: 'Home' },
		{ href: '#albums', label: 'Albums' },
		{ href: '#books', label: 'Books' },
		{ href: '#about', label: 'About' },
		{ href: '#contact', label: 'Contact' }
	];
	
	function scrollToSection(href: string) {
		const element = document.querySelector(href);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<footer class="footer">
	<div class="container">
		<!-- Main Footer Content -->
		<div class="footer-content">
			<!-- Brand Section -->
			<div class="footer-brand">
				<div class="brand-logo">
					<span class="logo-text">John Chezik</span>
				</div>
				<p class="brand-description">
					Platinum-selling songwriter-singer, guitar player and published author with 6 albums and 2 books 
					spanning decades of creating music and literature.
				</p>
				<div class="brand-stats">
					<div class="stat">
						<Music size={16} />
						<span>6 Albums</span>
					</div>
					<div class="stat">
						<BookOpen size={16} />
						<span>2 Books</span>
					</div>
				</div>
			</div>
			
			<!-- Quick Links -->
			<div class="footer-section">
				<h3 class="section-title">Quick Links</h3>
				<ul class="link-list">
					{#each quickLinks as link}
						<li>
							<a 
								href={link.href} 
								on:click|preventDefault={() => scrollToSection(link.href)}
								class="footer-link"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>
			
			<!-- Latest Work -->
			<div class="footer-section">
				<h3 class="section-title">Latest Work</h3>
				<div class="latest-items">
					<div class="latest-item">
						<div class="item-icon music-icon">
							<Music size={14} />
						</div>
						<div class="item-content">
							<div class="item-title">Don't Say It's Over</div>
							<div class="item-meta">Album • 2025</div>
						</div>
					</div>
					<div class="latest-item">
						<div class="item-icon book-icon">
							<BookOpen size={14} />
						</div>
						<div class="item-content">
							<div class="item-title">The Alpha Code</div>
							<div class="item-meta">Book • 2024</div>
						</div>
					</div>
				</div>
			</div>
			
		</div>
		
		<!-- Footer Bottom -->
		<div class="footer-bottom">
			<div class="footer-bottom-content">
				<div class="copyright">
					<p>© {currentYear} John Chezik. All rights reserved.</p>
				</div>
				
				
				<div class="footer-links">
					<button class="footer-link-small" on:click={openPrivacyPolicy}>Privacy Policy</button>
					<button class="footer-link-small" on:click={openTermsOfService}>Terms of Service</button>
				</div>
			</div>
		</div>
	</div>
</footer>

<!-- Privacy Policy Modal -->
{#if showPrivacyPolicy}
	<div class="privacy-overlay" on:click={closePrivacyPolicy} role="button" tabindex="0" on:keydown={(e) => e.key === 'Escape' && closePrivacyPolicy()} aria-label="Close privacy policy">
		<div class="privacy-content" role="document">
			<button class="privacy-close" on:click={closePrivacyPolicy}>&times;</button>
			
			<div class="privacy-header">
				<h2 class="privacy-title">Privacy Policy</h2>
				<p class="privacy-subtitle">How we protect your information</p>
			</div>
			
			<div class="privacy-body">
				<div class="privacy-section">
					<h3 class="privacy-section-title">Information We Collect</h3>
					<p class="privacy-text">
						When you contact us through our website, we may collect your name, email address, and any message you choose to send. This information is used solely to respond to your inquiry and is not shared with third parties.
					</p>
				</div>
				
				<div class="privacy-section">
					<h3 class="privacy-section-title">How We Use Your Information</h3>
					<p class="privacy-text">
						Your contact information is used exclusively to respond to your professional inquiries, media requests, or business-related matters. We do not use your information for marketing purposes or share it with external parties.
					</p>
				</div>
				
				<div class="privacy-section">
					<h3 class="privacy-section-title">Data Security</h3>
					<p class="privacy-text">
						We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your data is handled with the utmost care and professionalism.
					</p>
				</div>
				
				<div class="privacy-section">
					<h3 class="privacy-section-title">Audio Content</h3>
					<p class="privacy-text">
						Music samples on this website are provided for preview purposes only. They are protected against downloading and are intended solely for your listening experience while visiting our site.
					</p>
				</div>
				
				<div class="privacy-section">
					<h3 class="privacy-section-title">Contact</h3>
					<p class="privacy-text">
						If you have any questions about this Privacy Policy or how your information is handled, please contact us at media@johnchezik.com.
					</p>
				</div>
				
				<div class="privacy-footer">
					<p class="privacy-note">Last updated: {currentYear} • This policy applies to www.chezik.eu</p>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Terms of Service Modal -->
{#if showTermsOfService}
	<div class="terms-overlay" on:click={closeTermsOfService} role="button" tabindex="0" on:keydown={(e) => e.key === 'Escape' && closeTermsOfService()} aria-label="Close terms of service">
		<div class="terms-content" role="document">
			<button class="terms-close" on:click={closeTermsOfService}>&times;</button>
			
			<div class="terms-header">
				<h2 class="terms-title">Terms of Service</h2>
				<p class="terms-subtitle">Website usage and content policies</p>
			</div>
			
			<div class="terms-body">
				<div class="terms-section">
					<h3 class="terms-section-title">Acceptance of Terms</h3>
					<p class="terms-text">
						By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
					</p>
				</div>
				
				<div class="terms-section">
					<h3 class="terms-section-title">Intellectual Property Rights</h3>
					<p class="terms-text">
						All content on this website, including but not limited to music, audio recordings, book excerpts, images, text, and design elements, is the exclusive property of John Chezik and is protected by copyright and intellectual property laws. Unauthorized reproduction, distribution, or use is strictly prohibited.
					</p>
				</div>
				
				<div class="terms-section">
					<h3 class="terms-section-title">Audio Content Usage</h3>
					<p class="terms-text">
						Music samples and audio content provided on this website are for personal listening and preview purposes only. You may not download, reproduce, distribute, or use any audio content for commercial purposes without explicit written permission.
					</p>
				</div>
				
				<div class="terms-section">
					<h3 class="terms-section-title">Book Preview Content</h3>
					<p class="terms-text">
						Book previews and excerpts are provided for informational purposes only. The content remains the intellectual property of John Chezik and may not be reproduced, shared, or used without permission. Full books are available through authorized retailers only.
					</p>
				</div>
				
				<div class="terms-section">
					<h3 class="terms-section-title">Professional Contact</h3>
					<p class="terms-text">
						Contact forms and email communications are intended for legitimate professional inquiries, media requests, and business matters only. Spam, harassment, or inappropriate communications are not tolerated and may result in legal action.
					</p>
				</div>
				
				<div class="terms-section">
					<h3 class="terms-section-title">Limitation of Liability</h3>
					<p class="terms-text">
						John Chezik and this website shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of this website or its content. Use of this website is at your own risk.
					</p>
				</div>
				
				<div class="terms-section">
					<h3 class="terms-section-title">Changes to Terms</h3>
					<p class="terms-text">
						These terms may be updated at any time without prior notice. Continued use of the website constitutes acceptance of any changes. It is your responsibility to review these terms periodically.
					</p>
				</div>
				
				<div class="terms-footer">
					<p class="terms-note">Last updated: {currentYear} • These terms apply to www.chezik.eu and all associated content</p>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.footer {
		background: linear-gradient(180deg, #000000 0%, #0a0a0a 100%);
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		padding: var(--space-4xl) 0 var(--space-xl) 0;
		margin-top: var(--space-4xl);
	}
	
	.footer-content {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr 1.2fr;
		gap: var(--space-3xl);
		margin-bottom: var(--space-3xl);
	}
	
	.footer-brand {
		max-width: 350px;
	}
	
	.brand-logo {
		margin-bottom: var(--space-lg);
	}
	
	.logo-text {
		font-size: var(--text-2xl);
		font-weight: 800;
		background: linear-gradient(135deg, #ffffff, #007aff);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	
	.brand-description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: 1.6;
		margin-bottom: var(--space-lg);
	}
	
	.brand-stats {
		display: flex;
		gap: var(--space-lg);
	}
	
	.stat {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		background: var(--glass-bg);
		padding: var(--space-sm) var(--space-md);
		border-radius: var(--radius-md);
		border: 1px solid var(--glass-border);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}
	
	.footer-section {
		display: flex;
		flex-direction: column;
	}
	
	.section-title {
		font-size: var(--text-lg);
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: var(--space-lg);
		position: relative;
	}
	
	.section-title::after {
		content: '';
		position: absolute;
		bottom: -8px;
		left: 0;
		width: 30px;
		height: 2px;
		background: var(--color-accent-primary);
		border-radius: 1px;
	}
	
	.link-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}
	
	.footer-link {
		color: var(--color-text-secondary);
		text-decoration: none;
		font-size: var(--text-sm);
		transition: all var(--transition-normal);
		padding: var(--space-xs) 0;
		border-bottom: 1px solid transparent;
	}
	
	.footer-link:hover {
		color: var(--color-text-primary);
		border-bottom-color: var(--color-accent-primary);
	}
	
	.latest-items {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}
	
	.latest-item {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm);
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-md);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		transition: all var(--transition-normal);
	}
	
	.latest-item:hover {
		border-color: var(--color-accent-primary);
		transform: translateY(-1px);
	}
	
	.item-icon {
		flex-shrink: 0;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.music-icon {
		background: rgba(0, 122, 255, 0.2);
		color: #007aff;
	}
	
	.book-icon {
		background: rgba(48, 209, 88, 0.2);
		color: #30d158;
	}
	
	.item-content {
		flex: 1;
	}
	
	.item-title {
		font-size: var(--text-xs);
		font-weight: 600;
		color: var(--color-text-primary);
		line-height: 1.2;
	}
	
	.item-meta {
		font-size: var(--text-xs);
		color: var(--color-text-tertiary);
		margin-top: 2px;
	}
	
	
	.footer-bottom {
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		padding-top: var(--space-xl);
	}
	
	.footer-bottom-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: var(--space-md);
	}
	
	.copyright p {
		font-size: var(--text-sm);
		color: var(--color-text-tertiary);
		margin: 0;
	}
	
	
	
	@keyframes heartbeat {
		0% { transform: scale(1); }
		14% { transform: scale(1.1); }
		28% { transform: scale(1); }
		42% { transform: scale(1.1); }
		70% { transform: scale(1); }
	}
	
	.footer-links {
		display: flex;
		gap: var(--space-lg);
	}
	
	.footer-link-small {
		font-size: var(--text-sm);
		color: var(--color-text-tertiary);
		text-decoration: none;
		transition: color var(--transition-normal);
	}
	
	.footer-link-small:hover {
		color: var(--color-text-secondary);
	}
	
	button.footer-link-small {
		background: none;
		border: none;
		padding: 0;
		font-family: inherit;
		cursor: pointer;
	}
	
	button.footer-link-small:focus {
		outline: none;
	}
	
	/* Privacy Policy Modal Styles */
	.privacy-overlay {
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
	
	.privacy-content {
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
	
	.privacy-close {
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
	
	.privacy-close:hover {
		background: var(--color-bg-elevated);
		color: var(--color-text-primary);
	}
	
	.privacy-header {
		padding: var(--space-2xl) var(--space-2xl) var(--space-lg);
		border-bottom: 1px solid var(--glass-border);
		text-align: center;
	}
	
	.privacy-title {
		font-size: var(--text-3xl);
		font-weight: 800;
		color: var(--color-text-primary);
		margin-bottom: var(--space-sm);
		background: linear-gradient(135deg, #ffffff, #007aff);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	
	.privacy-subtitle {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
		font-weight: 500;
	}
	
	.privacy-body {
		padding: var(--space-xl);
		max-height: 60vh;
		overflow-y: auto;
	}
	
	.privacy-section {
		margin-bottom: var(--space-2xl);
		padding-bottom: var(--space-xl);
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}
	
	.privacy-section:last-of-type {
		border-bottom: none;
	}
	
	.privacy-section-title {
		font-size: var(--text-xl);
		font-weight: 700;
		color: var(--color-accent-primary);
		margin-bottom: var(--space-lg);
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}
	
	.privacy-section-title::before {
		content: '';
		width: 4px;
		height: 20px;
		background: var(--color-accent-primary);
		border-radius: 2px;
	}
	
	.privacy-text {
		font-size: var(--text-base);
		line-height: 1.7;
		color: var(--color-text-secondary);
		margin-bottom: var(--space-lg);
	}
	
	.privacy-text:last-child {
		margin-bottom: 0;
	}
	
	.privacy-footer {
		background: var(--color-bg-secondary);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
		margin-top: var(--space-xl);
	}
	
	.privacy-note {
		font-size: var(--text-sm);
		color: var(--color-text-tertiary);
		text-align: center;
		font-style: italic;
		margin: 0;
	}
	
	/* Terms of Service Modal Styles */
	.terms-overlay {
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
	
	.terms-content {
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
	
	.terms-close {
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
	
	.terms-close:hover {
		background: var(--color-bg-elevated);
		color: var(--color-text-primary);
	}
	
	.terms-header {
		padding: var(--space-2xl) var(--space-2xl) var(--space-lg);
		border-bottom: 1px solid var(--glass-border);
		text-align: center;
	}
	
	.terms-title {
		font-size: var(--text-3xl);
		font-weight: 800;
		color: var(--color-text-primary);
		margin-bottom: var(--space-sm);
		background: linear-gradient(135deg, #ffffff, #007aff);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	
	.terms-subtitle {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
		font-weight: 500;
	}
	
	.terms-body {
		padding: var(--space-xl);
		max-height: 60vh;
		overflow-y: auto;
	}
	
	.terms-section {
		margin-bottom: var(--space-2xl);
		padding-bottom: var(--space-xl);
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}
	
	.terms-section:last-of-type {
		border-bottom: none;
	}
	
	.terms-section-title {
		font-size: var(--text-xl);
		font-weight: 700;
		color: var(--color-accent-primary);
		margin-bottom: var(--space-lg);
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}
	
	.terms-section-title::before {
		content: '';
		width: 4px;
		height: 20px;
		background: var(--color-accent-primary);
		border-radius: 2px;
	}
	
	.terms-text {
		font-size: var(--text-base);
		line-height: 1.7;
		color: var(--color-text-secondary);
		margin-bottom: var(--space-lg);
	}
	
	.terms-text:last-child {
		margin-bottom: 0;
	}
	
	.terms-footer {
		background: var(--color-bg-secondary);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
		margin-top: var(--space-xl);
	}
	
	.terms-note {
		font-size: var(--text-sm);
		color: var(--color-text-tertiary);
		text-align: center;
		font-style: italic;
		margin: 0;
	}
	
	@media (max-width: 968px) {
		.footer-content {
			grid-template-columns: 1fr 1fr;
			gap: var(--space-2xl);
		}
		
		.footer-brand {
			grid-column: 1 / -1;
			max-width: none;
		}
	}
	
	@media (max-width: 640px) {
		.footer-content {
			grid-template-columns: 1fr;
			gap: var(--space-xl);
		}
		
		.footer-bottom-content {
			flex-direction: column;
			text-align: center;
			gap: var(--space-lg);
		}
		
		.brand-stats {
			justify-content: center;
		}
		
		
		.footer-links {
			justify-content: center;
		}
	}
</style>
