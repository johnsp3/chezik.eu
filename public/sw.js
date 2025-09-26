const CACHE_NAME = "john-chezik-v2";
const STATIC_CACHE = "john-chezik-static-v2";
const DYNAMIC_CACHE = "john-chezik-dynamic-v2";
const AUDIO_CACHE = "john-chezik-audio-v2";

const STATIC_ASSETS = [
  "/",
  "/offline",
  "/favicon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/manifest.json",
  "/John_Studio_High_quality.png",
  "/John_Studio_1300x1040.png",
  "/John_Studio_600x480_Rounded.png",
  "/John Chezik_The_Revealing_album_cover.png",
  "/John_Chezik_greatest_hits.png",
  "/John_Chezik_Look_At_Me-Album_Cover.png",
  "/John_Chezik_my_favorite_ballads.png",
  "/John_Chezik_the_acoustic_album-_love_songs.png",
  "/The_visual_Man_Cover.png",
  "/The Visual Man Cover V1.png",
  "/The_Alfa_Code.png",
];

const AUDIO_ASSETS = [
  "/John Chezik don't say it's over 0m37s.mp3",
  "/John_Chezik_My_Life.mp3",
  "/John_Chezik_something_more.mp3",
  "/John_Chezik_The_Revealing.mp3",
  "/look_at_me.mp3",
  "/Tell_Me_How.mp3",
  "/visualman.mp3",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      }),
      // Pre-cache audio assets
      caches.open(AUDIO_CACHE).then((cache) => {
        console.log("Service Worker: Pre-caching audio assets");
        return Promise.all(
          AUDIO_ASSETS.map(audio => 
            cache.add(audio).catch(err => 
              console.warn(`Failed to cache ${audio}:`, err)
            )
          )
        );
      })
    ])
    .then(() => {
      console.log("Service Worker: Skip waiting");
      return self.skipWaiting();
    })
    .catch((error) => {
      console.error("Service Worker: Cache failed", error);
    }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (![STATIC_CACHE, DYNAMIC_CACHE, AUDIO_CACHE].includes(cache)) {
              console.log("Service Worker: Deleting old cache", cache);
              return caches.delete(cache);
            }
          }),
        );
      })
      .then(() => {
        console.log("Service Worker: Claiming clients");
        return self.clients.claim();
      }),
  );
});

// Fetch event - serve cached content when offline
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Handle audio files with streaming support
  if (AUDIO_ASSETS.some((asset) => request.url.includes(asset))) {
    event.respondWith(handleAudioRequest(request));
    return;
  }

  // Handle navigation requests
  if (request.mode === "navigate") {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // Handle other requests with cache-first strategy
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(request)
        .then((response) => {
          // Don't cache non-successful responses
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response for caching
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Return offline page for failed requests
          if (request.destination === "document") {
            return caches.match("/");
          }
        });
    }),
  );
});

// Handle navigation requests with network-first strategy
async function handleNavigationRequest(request) {
  try {
    // Try network first
    const response = await fetch(request);

    // Cache successful responses
    if (response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback to index page
    return caches.match("/");
  }
}

// Handle audio requests with range support for streaming
async function handleAudioRequest(request) {
  try {
    // Check if request has range header
    const range = request.headers.get("range");

    if (range) {
      // For range requests, try cache first, then network
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request);
    }

    // For non-range requests, try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fetch from network and cache
    const response = await fetch(request);
    if (response.status === 200) {
      const cache = await caches.open(AUDIO_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.error("Audio request failed:", error);
    // Return offline audio placeholder
    return new Response("Audio unavailable offline", { 
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Handle background sync for form submissions
self.addEventListener("sync", (event) => {
  if (event.tag === "contact-form") {
    event.waitUntil(syncContactForm());
  }

  if (event.tag === "newsletter-signup") {
    event.waitUntil(syncNewsletterSignup());
  }
});

// Sync contact form submissions
async function syncContactForm() {
  try {
    const formData = await getStoredFormData("contact-form");
    if (formData) {
      await submitContactForm(formData);
      await clearStoredFormData("contact-form");
    }
  } catch (error) {
    console.error("Contact form sync failed:", error);
  }
}

// Sync newsletter signups
async function syncNewsletterSignup() {
  try {
    const signupData = await getStoredFormData("newsletter-signup");
    if (signupData) {
      await submitNewsletterSignup(signupData);
      await clearStoredFormData("newsletter-signup");
    }
  } catch (error) {
    console.error("Newsletter sync failed:", error);
  }
}

// Helper functions for form data storage
async function getStoredFormData(key) {
  const cache = await caches.open("form-data");
  const response = await cache.match(`/form-data/${key}`);
  return response ? response.json() : null;
}

async function clearStoredFormData(key) {
  const cache = await caches.open("form-data");
  return cache.delete(`/form-data/${key}`);
}

async function submitContactForm(data) {
  // Implement actual form submission
  console.log("Submitting contact form:", data);
}

async function submitNewsletterSignup(data) {
  // Implement actual newsletter signup
  console.log("Submitting newsletter signup:", data);
}

// Handle push notifications (for future use)
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: "/icon-192.png",
    badge: "/favicon.svg",
    tag: data.tag || "general",
    data: data.data,
    actions: data.actions || [],
    requireInteraction: data.requireInteraction || false,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const action = event.action;
  const data = event.notification.data;

  // Handle different notification actions
  if (action === 'open') {
    event.waitUntil(clients.openWindow(data.url || "/"));
  } else {
    // Default action - just open the main page
    event.waitUntil(clients.openWindow("/"));
  }
});

console.log("Service Worker: Loaded");
