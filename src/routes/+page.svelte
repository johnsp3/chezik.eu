<script lang="ts">
	import { onMount } from 'svelte';
	import Hero from '../components/Hero.svelte';
	import Navigation from '../components/Navigation.svelte';
	import AlbumsSection from '../components/AlbumsSection.svelte';
	import BooksSection from '../components/BooksSection.svelte';
	import BlogSection from '../components/BlogSection.svelte';
	import AboutSection from '../components/AboutSection.svelte';
	import ContactSection from '../components/ContactSection.svelte';
	import Footer from '../components/Footer.svelte';
	
	let mounted = false;
	
	onMount(() => {
		mounted = true;
		
		// Initialize intersection observer for scroll animations
		const observerOptions = {
			threshold: 0.1,
			rootMargin: '0px 0px -50px 0px'
		};
		
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('animate-fade-in');
				}
			});
		}, observerOptions);
		
		// Observe all sections
		const sections = document.querySelectorAll('.section');
		sections.forEach((section) => observer.observe(section));
		
		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>John Chezik - Platinum-Selling Songwriter-Singer & Guitar Player</title>
	<meta name="description" content="Official website of John Chezik. Explore 6 albums and 2 books from a platinum-selling songwriter-singer, guitar player and published author with decades of creating." />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://chezik.eu/" />
	<meta property="og:title" content="John Chezik - Platinum-Selling Songwriter-Singer & Guitar Player" />
	<meta property="og:description" content="Explore 6 albums and 2 books from a platinum-selling songwriter-singer, guitar player and published author with decades of creating." />
	<meta property="og:image" content="https://chezik.eu/John_Studio_High_quality.png" />
	<meta property="og:site_name" content="John Chezik" />
	
	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://chezik.eu/" />
	<meta property="twitter:title" content="John Chezik - Platinum-Selling Songwriter-Singer & Guitar Player" />
	<meta property="twitter:description" content="Explore 6 albums and 2 books from a platinum-selling songwriter-singer, guitar player and published author with decades of creating." />
	<meta property="twitter:image" content="https://chezik.eu/John_Studio_High_quality.png" />
	
	<!-- Additional SEO -->
	<meta name="author" content="John Chezik" />
	<meta name="keywords" content="John Chezik, musician, songwriter, singer, guitar player, platinum selling, rock music, books, author, The Alpha Code, The Visual Man" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="https://chezik.eu/" />
	
	<!-- Preload critical resources -->
	<link rel="preload" href="/John_Studio_High_quality.png" as="image" type="image/png" />
	<link rel="preload" href="/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
	
	<!-- JSON-LD Structured Data -->
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Person",
			"name": "John Chezik",
			"jobTitle": "Musician, Songwriter, Author",
			"description": "Platinum-selling songwriter-singer, guitar player and published author",
			"url": "https://chezik.eu",
			"image": "https://chezik.eu/John_Studio_High_quality.png",
			"sameAs": [
				"https://twitter.com/johnchezik",
				"https://instagram.com/johnchezik",
				"https://linkedin.com/in/johnchezik"
			],
			"worksFor": {
				"@type": "Organization",
				"name": "Independent Artist"
			},
			"hasOccupation": {
				"@type": "Occupation",
				"name": "Musician",
				"occupationalCategory": "Arts, Entertainment, and Recreation"
			},
			"knowsAbout": ["Music Production", "Songwriting", "Guitar Playing", "Book Writing", "Music Publishing"],
			"award": "Platinum-selling Artist",
			"alumniOf": {
				"@type": "EducationalOrganization",
				"name": "Music Industry"
			}
		}
	</script>
	
	<!-- Music Albums Structured Data -->
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "MusicGroup",
			"name": "John Chezik",
			"member": {
				"@type": "Person",
				"name": "John Chezik"
			},
			"album": [
				{
					"@type": "MusicAlbum",
					"name": "Don't Say It's Over",
					"datePublished": "2025",
					"genre": "Hard Rock",
					"byArtist": {
						"@type": "Person",
						"name": "John Chezik"
					}
				},
				{
					"@type": "MusicAlbum",
					"name": "The Visual Man",
					"datePublished": "2024",
					"genre": "Hard Rock",
					"byArtist": {
						"@type": "Person",
						"name": "John Chezik"
					}
				},
				{
					"@type": "MusicAlbum",
					"name": "The Revealing",
					"datePublished": "2023",
					"genre": "Hard Rock/Blues/Instrumental",
					"byArtist": {
						"@type": "Person",
						"name": "John Chezik"
					}
				}
			]
		}
	</script>
	
	<!-- Books Structured Data -->
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Book",
			"name": "The Alpha Code",
			"author": {
				"@type": "Person",
				"name": "John Chezik"
			},
			"datePublished": "2024",
			"genre": "Self-Development",
			"description": "A bold guide for men ready to rise above mediocrity and step into their power.",
			"publisher": {
				"@type": "Organization",
				"name": "John Chezik Publishing"
			}
		}
	</script>
</svelte:head>

<!-- Skip to content link for accessibility -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<div class="page" class:mounted>
	<Navigation />
	<main id="main-content" aria-label="Main content">
		<Hero />
		<AlbumsSection />
		<BooksSection />
		<BlogSection />
		<AboutSection />
		<ContactSection />
	</main>
	<Footer />
</div>

<style>
	.page {
		opacity: 0;
		transition: opacity 0.6s ease-out;
	}
	
	.page.mounted {
		opacity: 1;
	}
</style>
