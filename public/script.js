document.addEventListener('DOMContentLoaded', () => {
    // 1. Digital Clock functionality
    const clockElement = document.getElementById('clock');

    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        clockElement.textContent = timeString;
    }

    // Initial call and set interval
    updateClock();
    setInterval(updateClock, 1000);

    // 2. Fetch System Stats
    async function fetchSystemStats() {
        try {
            const response = await fetch('/api/system/status');
            if (response.ok) {
                const data = await response.json();
                document.getElementById('cpu-val').textContent = data.cpu || '--%';
                document.getElementById('ram-val').textContent = data.ram || '--%';
                document.getElementById('disk-val').textContent = data.disk || '--%';
            }
        } catch (error) {
            console.error('Error fetching system stats:', error);
        }
    }

    fetchSystemStats();
    setInterval(fetchSystemStats, 10000); // Check every 10 seconds

    // 3. Fetch Status for Apps
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const appName = card.dataset.app;
        if (appName) {
            checkAppStatus(card, appName);
            // Re-check every 60 seconds
            setInterval(() => checkAppStatus(card, appName), 60000);
        }
    });

    // 3. Search Filter
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            cards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                if (title.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    async function checkAppStatus(cardElement, appName) {
        const statusText = cardElement.querySelector('.status-text');

        try {
            statusText.textContent = 'Checking...';
            statusText.className = 'status-text unknown';

            // We ping our Node.js backend proxy
            const response = await fetch(`/api/${appName}/status`);

            if (response.ok) {
                const data = await response.json();

                if (data.online) {
                    statusText.textContent = 'Online';
                    statusText.className = 'status-text online';

                    // Specific app logic can go here (e.g., parsing Sonarr queue)
                    if (data.extraInfo) {
                        statusText.textContent += ` • ${data.extraInfo}`;
                    }

                    // Render rich mocked stats elements
                    if (data.stats && data.stats.length > 0) {
                        let statsContainer = cardElement.querySelector('.card-stats');
                        if (!statsContainer) {
                            statsContainer = document.createElement('div');
                            statsContainer.className = 'card-stats';
                            cardElement.querySelector('.card-content').appendChild(statsContainer);
                        }

                        // Clear old stats
                        statsContainer.innerHTML = '';

                        data.stats.forEach((stat, index) => {
                            const statEl = document.createElement('div');
                            statEl.className = 'stat-item';
                            // Stagger animation slightly based on index
                            statEl.style.animationDelay = `${index * 0.1}s`;
                            statEl.innerHTML = `
                                <span class="stat-label">${stat.label}</span>
                                <span class="stat-value" style="color: ${stat.color}">${stat.value}</span>
                            `;
                            statsContainer.appendChild(statEl);
                        });
                    } else {
                        const existingStats = cardElement.querySelector('.card-stats');
                        if (existingStats) {
                            existingStats.remove();
                        }
                    }
                } else {
                    statusText.textContent = 'Offline';
                    statusText.className = 'status-text offline';
                }
            } else {
                statusText.textContent = 'Offline';
                statusText.className = 'status-text offline';
            }
        } catch (error) {
            console.error(`Error checking ${appName}:`, error);
            statusText.textContent = 'Offline';
            statusText.className = 'status-text offline';
        }
    }

    // 4. Theme Toggle Logic
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = themeToggleBtn.querySelector('i');

    // Check for saved theme or prefer dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        let currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun'; // Show sun when dark to switch to light
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }

    // 5. Advanced Card Interactivity (3D Tilt & Glow)
    cards.forEach(card => {
        // Glow tracking
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // 3D Tilt calculation
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            // Max rotation of 5 degrees
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        // Reset tilt on leave (glow is handled by opacity in CSS)
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
        });
    });
});
