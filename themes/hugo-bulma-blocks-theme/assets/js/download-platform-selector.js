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

    // Initialize platform selector on page load
    function initPlatformSelector() {
        const platformTabs = document.querySelectorAll('.platform-tab');
        const platformContents = document.querySelectorAll('.platform-content');
        
        if (platformTabs.length === 0 || platformContents.length === 0) {
            return; // Not on download page
        }

        // Detect and activate default platform
        const defaultPlatform = detectOS();
        let activated = false;

        // Try to activate the detected platform
        platformTabs.forEach(tab => {
            if (tab.dataset.platform === defaultPlatform) {
                activatePlatform(defaultPlatform);
                activated = true;
            }
        });

        // If no match found, activate first tab
        if (!activated && platformTabs.length > 0) {
            const firstPlatform = platformTabs[0].dataset.platform;
            activatePlatform(firstPlatform);
        }

        // Add click event listeners to all tabs
        platformTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const platform = this.dataset.platform;
                activatePlatform(platform);
            });
        });

        // Add keyboard navigation
        platformTabs.forEach((tab, index) => {
            tab.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    const nextTab = platformTabs[index + 1] || platformTabs[0];
                    nextTab.focus();
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prevTab = platformTabs[index - 1] || platformTabs[platformTabs.length - 1];
                    prevTab.focus();
                }
            });
        });
    }

    // Activate a specific platform
    function activatePlatform(platform) {
        const platformTabs = document.querySelectorAll('.platform-tab');
        const platformContents = document.querySelectorAll('.platform-content');

        // Update tabs
        platformTabs.forEach(tab => {
            if (tab.dataset.platform === platform) {
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
            } else {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
            }
        });

        // Update content
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

        // Scroll to top of download section
        const downloadSection = document.querySelector('.download-platform-selector');
        if (downloadSection) {
            const offset = 100; // Offset for fixed header
            const elementPosition = downloadSection.getBoundingClientRect().top;
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
                const tab = document.querySelector(`.platform-tab[data-platform="${storedPlatform}"]`);
                if (tab) {
                    return storedPlatform;
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
