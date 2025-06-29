class PlagiarismChecker {
    constructor() {
        this.form = document.getElementById('plagiarismForm');
        this.queryText = document.getElementById('query');
        this.result = document.getElementById('result');
        this.percentage = document.getElementById('percentage');
        this.resultText = document.getElementById('resultText');
        this.progressCircle = document.getElementById('progressCircle');
        this.progressTrack = document.querySelector('.progress-ring__track');
        this.submitButton = this.form.querySelector('button[type="submit"]');
        
        this.databaseText = '';
        this.originalButtonText = this.submitButton.textContent;
        
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadDatabaseText();
        this.setupProgressRing();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.checkPlagiarism();
        });
    }

    async loadDatabaseText() {
        try {
            this.setLoadingState(true, 'Loading database...');
            
            const response = await fetch('db.txt');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.databaseText = await response.text();
            
            if (!this.databaseText.trim()) {
                throw new Error('Database file is empty');
            }
            
            this.setLoadingState(false);
            
        } catch (error) {
            console.error('Error loading database:', error);
            this.setLoadingState(false, 'Check Plagiarism');
            
            // Fallback database text
            this.databaseText = `Artificial intelligence is transforming the way we live and work. Machine learning algorithms can process vast amounts of data to identify patterns and make predictions. Natural language processing enables computers to understand and generate human language. Deep learning networks mimic the structure of the human brain to solve complex problems. AI applications range from recommendation systems to autonomous vehicles. The future of technology depends heavily on advances in artificial intelligence research and development.`;
            
            // Show error message to user
            this.showError('Could not load database file. Using fallback database for demonstration.');
        }
    }

    setLoadingState(isLoading, buttonText = null) {
        if (isLoading) {
            this.submitButton.disabled = true;
            this.submitButton.textContent = buttonText || 'Loading...';
            document.body.classList.add('loading');
        } else {
            this.submitButton.disabled = false;
            this.submitButton.textContent = buttonText || this.originalButtonText;
            document.body.classList.remove('loading');
        }
    }

    setupProgressRing() {
        const radius = this.progressCircle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        
        // Set up both circles
        this.progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        this.progressTrack.style.strokeDasharray = `${circumference} ${circumference}`;
        
        // Track stays fully visible
        this.progressTrack.style.strokeDashoffset = 0;
        
        // Progress starts hidden
        this.progressCircle.style.strokeDashoffset = circumference;
    }

    preprocessText(text) {
        // Convert to lowercase and extract words (remove non-word characters)
        return text.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(word => word.length > 0);
    }

    buildUniversalVocabulary(queryWords, databaseWords) {
        const universalSet = [];
        const allWords = [...queryWords, ...databaseWords];
        
        for (const word of allWords) {
            if (word && !universalSet.includes(word)) {
                universalSet.push(word);
            }
        }
        
        return universalSet;
    }

    buildTFVector(words, vocabulary) {
        return vocabulary.map(word => words.filter(w => w === word).length);
    }

    calculateCosineSimilarity(vector1, vector2) {
        // Calculate dot product
        const dotProduct = vector1.reduce((sum, val, i) => sum + (val * vector2[i]), 0);
        
        // Calculate magnitudes
        const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0));
        const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0));
        
        // Avoid division by zero
        if (magnitude1 === 0 || magnitude2 === 0) {
            return 0;
        }
        
        // Calculate cosine similarity
        return (dotProduct / (magnitude1 * magnitude2)) * 100;
    }

    getResultClass(percentage) {
        if (percentage >= 70) return 'high-similarity';
        if (percentage >= 30) return 'warning';
        return 'success';
    }

    animateProgressRing(percentage) {
        const radius = this.progressCircle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;
        
        // Animate the progress ring
        setTimeout(() => {
            this.progressCircle.style.strokeDashoffset = offset;
        }, 100);
    }

    displayResult(percentage, inputQuery) {
        // Update result content
        this.percentage.textContent = `${percentage.toFixed(1)}%`;
        this.resultText.textContent = `Input query text matches ${percentage.toFixed(2)}% with the database`;
        
        // Reset classes and add new ones
        this.result.className = `progress-box show ${this.getResultClass(percentage)}`;
        
        // Show result with animation
        this.result.style.display = 'flex';
        
        // Animate progress ring
        this.animateProgressRing(percentage);
        
        // Scroll to result
        setTimeout(() => {
            this.result.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }

    showError(message) {
        this.result.className = 'progress-box show error';
        this.result.style.display = 'flex';
        this.percentage.textContent = 'Error';
        this.resultText.textContent = message;
        this.progressCircle.style.strokeDashoffset = 2 * Math.PI * this.progressCircle.r.baseVal.value;
    }

    async checkPlagiarism() {
        try {
            const inputQuery = this.queryText.value.trim();
            
            if (!inputQuery) {
                alert('Please enter text to check for plagiarism.');
                return;
            }
            
            if (!this.databaseText) {
                this.showError('Database not loaded. Please refresh the page and try again.');
                return;
            }
            
            this.setLoadingState(true, 'Checking...');
            
            // Small delay to show loading state
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Preprocess texts
            const queryWords = this.preprocessText(inputQuery);
            const databaseWords = this.preprocessText(this.databaseText);
            
            if (queryWords.length === 0) {
                this.setLoadingState(false);
                alert('Please enter valid text with actual words.');
                return;
            }
            
            // Build universal vocabulary
            const universalVocabulary = this.buildUniversalVocabulary(queryWords, databaseWords);
            
            // Build TF vectors
            const queryTF = this.buildTFVector(queryWords, universalVocabulary);
            const databaseTF = this.buildTFVector(databaseWords, universalVocabulary);
            
            // Calculate cosine similarity
            const matchPercentage = this.calculateCosineSimilarity(queryTF, databaseTF);
            
            this.setLoadingState(false);
            
            // Display result
            this.displayResult(matchPercentage, inputQuery);
            
        } catch (error) {
            console.error('Error during plagiarism check:', error);
            this.setLoadingState(false);
            this.showError('An error occurred while processing your request. Please try again.');
        }
    }
}

// Initialize the plagiarism checker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PlagiarismChecker();
});