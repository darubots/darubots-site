document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcher = document.querySelector('.theme-switcher');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');

    // Theme switcher logic
    themeSwitcher.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            themeSwitcher.textContent = '🌙';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeSwitcher.textContent = '☀️';
        }
    });

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Set initial theme based on user preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeSwitcher.textContent = '☀️';
    }

    // Scroll animation logic
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1
    });

    const elementsToAnimate = document.querySelectorAll('section, .tim-card, #prestasi li, .galeri-item');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });

    // Header scroll effect
    const heroContent = document.querySelector('.hero-content');
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling

        // Parallax effect for hero content
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrollTop * 0.3}px)`;
        }
    });

    // Modal logic
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const modalTags = document.getElementById('modal-tags');
    const modalSource = document.getElementById('modal-source');
    const closeButton = document.querySelector('.close-button');

    document.querySelectorAll('.galeri-item').forEach(item => {
        item.addEventListener('click', () => {
            const imageUrlMatch = item.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
            const imageUrl = imageUrlMatch ? imageUrlMatch[1] : '';
            const itemId = item.id;

            // Update URL hash
            window.location.hash = itemId;

            modal.classList.add('show');
            modalImage.src = imageUrl;
            modalImage.alt = item.dataset.description.replace(/<[^>]*>?/gm, '').substring(0, 100); // Use description for alt, strip HTML, limit length
            modalDescription.innerHTML = item.dataset.description;
            modalTags.textContent = item.dataset.tags;
            modalSource.textContent = `Sumber: ${item.dataset.source}`;

            // Share button logic
            const shareInstagram = document.getElementById('share-instagram');
            const shareCopy = document.getElementById('share-copy');
            const shareWhatsapp = document.getElementById('share-whatsapp');

            const currentShareUrl = window.location.href;

            shareInstagram.onclick = () => {
                alert('Untuk berbagi ke Instagram, silakan unduh gambar dan unggah secara manual. API Instagram tidak mengizinkan berbagi langsung dari web.');
                window.open(imageUrl, '_blank'); // Open image in new tab for easy download
            };

            shareCopy.onclick = () => {
                navigator.clipboard.writeText(currentShareUrl).then(() => {
                    alert('URL halaman telah disalin ke clipboard!');
                }).catch(console.error);
            };

            shareWhatsapp.onclick = () => {
                const shareText = `Lihat gambar ini dari Tim Robotik SMK Telekomunikasi Darul Ulum: ${currentShareUrl}`; 
                window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
            };
        });
    });

    const closeModal = () => {
        modal.classList.remove('show');
        window.history.pushState('', document.title, window.location.pathname + window.location.search); // Clear hash
    }

    closeButton.addEventListener('click', closeModal);

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

    // Handle direct access via URL hash
    const openModalFromHash = () => {
        if (window.location.hash) {
            const itemId = window.location.hash.substring(1); // Remove #
            const galleryItem = document.getElementById(itemId);
            if (galleryItem) {
                galleryItem.click(); // Simulate click to open modal
            }
        }
    };

    // Open modal on page load if hash exists
    openModalFromHash();

    // Listen for hash changes (e.g., back/forward button)
    window.addEventListener('hashchange', () => {
        if (!window.location.hash) {
            closeModal(); // Close modal if hash is cleared manually
        } else {
            openModalFromHash();
        }
    });
});
