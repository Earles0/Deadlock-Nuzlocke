// Deadlock Nuzlocke Challenge Tracker
class NuzlockeTracker {
    constructor() {
        this.heroes = [
            'Abrams', 'Bebop', 'Billy', 'Calico', 'Drifter', 'Dynamo', 'Grey Talon',
            'Haze', 'Holliday', 'Infernus', 'Ivy', 'Kelvin', 'Lady Geist', 'Lash',
            'McGinnis', 'Mina', 'Mirage', 'Mo & Krill', 'Paige', 'Paradox', 'Pocket',
            'Seven', 'Shiv', 'Sinclair', 'The Doorman', 'Vindicta', 'Viscous',
            'Warden', 'Wraith', 'Yamato', 'Victor', 'Vyper'
        ];
        
        // MANUAL EDITING: Add hero names here to mark them as dead
        // Example: this.deadHeroes = ['Abrams', 'Bebop', 'Billy'];
        this.deadHeroes = [];
        
        this.adminMode = false;
        this.heroStates = this.loadHeroStates();
        
        this.init();
    }
    
    init() {
        this.renderHeroes();
        this.updateStats();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const adminToggle = document.getElementById('adminToggle');
        adminToggle.addEventListener('click', () => this.toggleAdminMode());
    }
    
    toggleAdminMode() {
        this.adminMode = !this.adminMode;
        const adminBtn = document.getElementById('adminToggle');
        const adminPanel = document.getElementById('adminPanel');
        
        if (this.adminMode) {
            adminBtn.textContent = 'Exit Admin Mode';
            adminBtn.classList.add('active');
            adminPanel.classList.remove('hidden');
            this.addAdminModeToCards();
        } else {
            adminBtn.textContent = 'Admin Mode';
            adminBtn.classList.remove('active');
            adminPanel.classList.add('hidden');
            this.removeAdminModeFromCards();
        }
    }
    
    addAdminModeToCards() {
        const heroCards = document.querySelectorAll('.hero-card');
        heroCards.forEach(card => {
            card.classList.add('admin-mode');
            card.addEventListener('click', (e) => this.toggleHeroState(e));
        });
    }
    
    removeAdminModeFromCards() {
        const heroCards = document.querySelectorAll('.hero-card');
        heroCards.forEach(card => {
            card.classList.remove('admin-mode');
            card.removeEventListener('click', this.toggleHeroState);
        });
    }
    
    toggleHeroState(event) {
        if (!this.adminMode) return;
        
        const heroCard = event.currentTarget;
        const heroName = heroCard.dataset.hero;
        
        // Toggle hero state
        this.heroStates[heroName] = this.heroStates[heroName] === 'alive' ? 'dead' : 'alive';
        
        // Save to localStorage
        this.saveHeroStates();
        
        // Re-render the specific hero card
        this.renderHeroCard(heroName, heroCard);
        
        // Update stats
        this.updateStats();
        
        // Show feedback
        this.showFeedback(heroName, this.heroStates[heroName]);
    }
    
    showFeedback(heroName, status) {
        // Create temporary feedback element
        const feedback = document.createElement('div');
        feedback.className = `feedback ${status}`;
        feedback.textContent = `${heroName} is now ${status}!`;
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${status === 'alive' ? '#2ecc71' : '#e74c3c'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(feedback);
        
        // Remove after 3 seconds
        setTimeout(() => {
            feedback.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(feedback);
            }, 300);
        }, 3000);
    }
    
    renderHeroes() {
        const heroesGrid = document.getElementById('heroesGrid');
        heroesGrid.innerHTML = '';
        
        this.heroes.forEach(heroName => {
            const heroCard = this.createHeroCard(heroName);
            heroesGrid.appendChild(heroCard);
        });
    }
    
    createHeroCard(heroName) {
        const heroCard = document.createElement('div');
        heroCard.className = 'hero-card';
        heroCard.dataset.hero = heroName;
        
        // Check if hero is in deadHeroes array (manual editing) or localStorage
        const isManuallyDead = this.deadHeroes.includes(heroName);
        const isStoredDead = this.heroStates[heroName] === 'dead';
        const state = (isManuallyDead || isStoredDead) ? 'dead' : 'alive';
        
        heroCard.classList.add(state);
        
        // Check if this hero has a card image
        const hasImage = this.heroHasImage(heroName);
        
        heroCard.innerHTML = `
            ${hasImage ? `<img src="${this.getHeroImagePath(heroName)}" alt="${heroName}" class="hero-image" onerror="this.style.display='none'">` : ''}
            <div class="hero-name">${heroName}</div>
            <div class="hero-status ${state}">${state}</div>
        `;
        
        return heroCard;
    }
    
    renderHeroCard(heroName, existingCard) {
        // Default to alive unless explicitly marked as dead
        const state = this.heroStates[heroName] === 'dead' ? 'dead' : 'alive';
        
        // Update classes
        existingCard.className = 'hero-card';
        existingCard.classList.add(state);
        
        // Check if this hero has a card image
        const hasImage = this.heroHasImage(heroName);
        
        // Update content
        existingCard.innerHTML = `
            ${hasImage ? `<img src="${this.getHeroImagePath(heroName)}" alt="${heroName}" class="hero-image" onerror="this.style.display='none'">` : ''}
            <div class="hero-name">${heroName}</div>
            <div class="hero-status ${state}">${state}</div>
        `;
    }
    
    heroHasImage(heroName) {
        // All heroes in our list have card images available
        return this.heroes.includes(heroName);
    }
    
    getHeroImagePath(heroName) {
        // Map hero names to their image file names
        const imageMap = {
            'Abrams': '132px-Abrams_card.png',
            'Bebop': '132px-Bebop_card.png',
            'Billy': '132px-Billy_card.png',
            'Calico': '132px-Calico_card.png',
            'Drifter': '132px-Drifter_card.png',
            'Dynamo': '132px-Dynamo_card.png',
            'Grey Talon': '132px-Grey_Talon_card.png',
            'Haze': '132px-Haze_card.png',
            'Holliday': '132px-Holliday_card.png',
            'Infernus': '132px-Infernus_card.png',
            'Ivy': '132px-Ivy_card.png',
            'Kelvin': '132px-Kelvin_card.png',
            'Lady Geist': '132px-Lady_Geist_card.png',
            'Lash': '132px-Lash_card.png',
            'McGinnis': '132px-McGinnis_card.png',
            'Mina': '132px-Mina_card.png',
            'Mirage': '132px-Mirage_card.png',
            'Mo & Krill': '132px-Mo_&_Krill_card.png',
            'Paige': '132px-Paige_card.png',
            'Paradox': '132px-Paradox_card.png',
            'Pocket': '132px-Pocket_card.png',
            'Seven': '132px-Seven_card.png',
            'Shiv': '132px-Shiv_card.png',
            'Sinclair': '132px-Sinclair_card.png',
            'The Doorman': '132px-The_Doorman_card.png',
            'Vindicta': '132px-Vindicta_card.png',
            'Viscous': '132px-Viscous_card.png',
            'Warden': '132px-Warden_card.png',
            'Wraith': '132px-Wraith_card.png',
            'Yamato': '132px-Yamato_card.png',
            'Victor': 'Victor_card.png',
            'Vyper': 'Vyper_card.png'
        };
        return imageMap[heroName] || '';
    }
    
    updateStats() {
        const totalHeroes = this.heroes.length;
        
        // Count dead heroes from both manual editing and localStorage
        let deadHeroes = 0;
        this.heroes.forEach(heroName => {
            const isManuallyDead = this.deadHeroes.includes(heroName);
            const isStoredDead = this.heroStates[heroName] === 'dead';
            if (isManuallyDead || isStoredDead) {
                deadHeroes++;
            }
        });
        
        // Alive heroes = total - dead
        const aliveHeroes = totalHeroes - deadHeroes;
        
        document.getElementById('totalHeroes').textContent = totalHeroes;
        document.getElementById('aliveHeroes').textContent = aliveHeroes;
        document.getElementById('deadHeroes').textContent = deadHeroes;
        
        // Debug logging
        console.log('Stats Update:', {
            total: totalHeroes,
            alive: aliveHeroes,
            dead: deadHeroes,
            manualDead: this.deadHeroes,
            storedDead: this.heroStates
        });
    }
    
    saveHeroStates() {
        localStorage.setItem('nuzlockeHeroStates', JSON.stringify(this.heroStates));
    }
    
    loadHeroStates() {
        const saved = localStorage.getItem('nuzlockeHeroStates');
        return saved ? JSON.parse(saved) : {};
    }
    
    // Public method to reset all heroes (for admin use)
    resetAllHeroes() {
        if (confirm('Are you sure you want to reset all heroes to alive? This cannot be undone!')) {
            this.heroStates = {};
            this.saveHeroStates();
            this.renderHeroes();
            this.updateStats();
        }
    }
    
    // Public method to get current status
    getStatus() {
        const total = this.heroes.length;
        
        // Count only explicitly dead heroes by checking each hero individually
        let dead = 0;
        this.heroes.forEach(heroName => {
            if (this.heroStates[heroName] === 'dead') {
                dead++;
            }
        });
        
        const alive = total - dead;
        
        return {
            total: total,
            alive: alive,
            dead: dead,
            heroes: this.heroStates
        };
    }
}

// Add CSS animations for feedback
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the tracker when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.nuzlockeTracker = new NuzlockeTracker();
    
    // Add some helpful console commands for debugging
    console.log('Metro Nuzlocke Challenge Tracker loaded!');
    console.log('Available commands:');
    console.log('- nuzlockeTracker.getStatus() - Get current status');
    console.log('- nuzlockeTracker.resetAllHeroes() - Reset all heroes to alive');
    console.log('- nuzlockeTracker.toggleAdminMode() - Toggle admin mode');
});
