// Platform Selector - Blender-inspired Download Page
(function() {
    'use strict';

    // Detect user's operating system
    function detectOS() {
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i.test(userAgent)) {
            return 'mobile';
        } else if (userAgent.includes('mac')) {
            return 'macos';
        } else if (userAgent.includes('linux')) {
            return 'linux';
        }
        return 'windows';
    }

    // Get download URL for platform
    function getDownloadUrl(platform) {
        const urls = {
            'windows': 'https://download.osgeo.org/osgeo4w/v2/osgeo4w-setup.exe',
            'macos': '/downloads/macos/qgis-macos-ltr.dmg',
            'linux': '/resources/installation-guide#linux',
            'mobile': 'https://play.google.com/store/apps/details?id=ch.opengis.qfield',
            'other': '/downloads/qgis-latest-ltr.tar.bz2'
        };
        return urls[platform] || urls['windows'];
    }

    // Get download button text for platform
    function getDownloadButtonText(platform) {
        const texts = {
            'windows': 'Download for Windows',
            'macos': 'Download for macOS',
            'linux': 'Download for Linux',
            'mobile': 'Download for Mobile',
            'other': 'Download Source Code'
        };
        return texts[platform] || 'Download QGIS';
    }

    // Get download subtitle for platform
    function getDownloadSubtitle(platform) {
        const subtitles = {
            'windows': 'Long Term Release (Recommended)',
            'macos': 'Long Term Release',
            'linux': 'View Installation Instructions',
            'mobile': 'QField for Android & iOS',
            'other': 'Source Code & Other Platforms'
        };
        return subtitles[platform] || 'Long Term Release';
    }

    // Initialize platform selector on page load
    function initPlatformSelector() {
        const dropdown = document.getElementById('platform-dropdown');
        const downloadButton = document.getElementById('primary-download-button');
        const downloadSubtitle = document.getElementById('download-button-subtitle');
        const platformContents = document.querySelectorAll('.platform-content');
        
        if (!dropdown || !downloadButton) {
            return; // Not on download page
        }

        // Detect and set default platform
        const defaultPlatform = checkStoredPreference() || detectOS();
        dropdown.value = defaultPlatform;
        activatePlatform(defaultPlatform);

        // Update download button for current platform
        function updateDownloadButton(platform) {
            const url = getDownloadUrl(platform);
            const text = getDownloadButtonText(platform);
            const subtitle = getDownloadSubtitle(platform);
            
            downloadButton.querySelector('.download-text').textContent = text;
            if (downloadSubtitle) {
                downloadSubtitle.textContent = subtitle;
            }
            
            // Update click handler
            downloadButton.onclick = function(e) {
                e.preventDefault();
                if (platform === 'linux') {
                    window.location.href = url;
                } else {
                    window.open(url, '_blank');
                    // Redirect to thank you page after a short delay
                    setTimeout(function() {
                        window.location.href = '/download/thank-you';
                    }, 500);
                }
            };
        }

        // Handle dropdown change
        dropdown.addEventListener('change', function() {
            const platform = this.value;
            activatePlatform(platform);
            updateDownloadButton(platform);
        });

        // Initial button setup
        updateDownloadButton(defaultPlatform);
    }

    // Activate a specific platform
    function activatePlatform(platform) {
        const platformContents = document.querySelectorAll('.platform-content');

        // Update content visibility
        platformContents.forEach(content => {
            if (content.dataset.platform === platform) {
                content.classList.add('active');
                content.setAttribute('aria-hidden', 'false');
            } else {
                content.classList.remove('active');
                content.setAttribute('aria-hidden', 'true');
            }
        });

        // Store preference
        try {
            localStorage.setItem('qgis-preferred-platform', platform);
        } catch (e) {
            // localStorage might not be available
        }

        // Scroll to platform content (smooth scroll)
        const activeContent = document.querySelector(`.platform-content[data-platform="${platform}"]`);
        if (activeContent) {
            const offset = 100; // Offset for fixed header
            const elementPosition = activeContent.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Check for stored preference on load
    function checkStoredPreference() {
        try {
            const storedPlatform = localStorage.getItem('qgis-preferred-platform');
            if (storedPlatform) {
                const dropdown = document.getElementById('platform-dropdown');
                if (dropdown) {
                    // Check if the stored platform is a valid option
                    const options = Array.from(dropdown.options).map(opt => opt.value);
                    if (options.includes(storedPlatform)) {
                        return storedPlatform;
                    }
                }
            }
        } catch (e) {
            // localStorage might not be available
        }
        return null;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPlatformSelector);
    } else {
        initPlatformSelector();
    }

    // Expose function globally for potential external use
    window.qgisPlatformSelector = {
        activatePlatform: activatePlatform,
        detectOS: detectOS
    };
})();
