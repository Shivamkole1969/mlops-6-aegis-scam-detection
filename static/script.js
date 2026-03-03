document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    const tabs = document.querySelectorAll('.tab');
    const inputAreas = document.querySelectorAll('.input-area');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            inputAreas.forEach(area => area.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(tab.dataset.target).classList.add('active');
        });
    });

    // File Upload handling
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    let selectedFile = null;

    uploadZone.addEventListener('click', () => fileInput.click());

    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '#3b82f6';
        uploadZone.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
    });

    uploadZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        uploadZone.style.backgroundColor = 'transparent';
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        uploadZone.style.backgroundColor = 'transparent';

        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });

    function handleFile(file) {
        selectedFile = file;
        fileNameDisplay.textContent = `Attached: ${file.name}`;
        fileNameDisplay.style.color = '#10b981';
    }

    // Modal Handling
    const settingsBtn = document.getElementById('settingsBtn');
    const apiModal = document.getElementById('apiModal');
    const closeBtn = document.querySelector('.close-btn');
    const saveApiBtn = document.getElementById('saveApiBtn');
    const userApiKeyInput = document.getElementById('userApiKey');
    const apiStatus = document.getElementById('apiStatus');

    settingsBtn.onclick = () => apiModal.classList.remove('hidden');
    closeBtn.onclick = () => apiModal.classList.add('hidden');
    window.onclick = (e) => { if (e.target == apiModal) apiModal.classList.add('hidden') };

    saveApiBtn.onclick = () => {
        const key = userApiKeyInput.value.trim();
        if (key) {
            localStorage.setItem('aegis_api_key', key);
            apiStatus.textContent = "✓ Key saved securely in your browser.";
            setTimeout(() => { apiModal.classList.add('hidden'); }, 1500);
        }
    };

    // Main Analysis Trigger
    const analyzeBtn = document.getElementById('analyzeBtn');
    const btnText = document.querySelector('.btn-text');
    const loader = document.querySelector('.loader');
    const resultBox = document.getElementById('resultBox');

    analyzeBtn.addEventListener('click', async () => {
        const textContent = document.getElementById('textContent').value.trim();
        const activeTab = document.querySelector('.tab.active').dataset.target;

        if (activeTab === 'text-input' && !textContent) {
            alert('Please paste some text or link to analyze.');
            return;
        }
        if (activeTab === 'image-input' && !selectedFile) {
            alert('Please upload an image screenshot.');
            return;
        }

        // Setup UI for loading
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');
        analyzeBtn.disabled = true;
        resultBox.classList.add('hidden');

        // Form Data
        const formData = new FormData();
        if (activeTab === 'text-input') formData.append('text_content', textContent);
        if (activeTab === 'image-input') formData.append('file', selectedFile);

        const savedKey = localStorage.getItem('aegis_api_key');
        if (savedKey) formData.append('user_api_key', savedKey);

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('API Request Failed');
            const data = await response.json();

            displayResults(data);

        } catch (error) {
            alert('Analysis failed: ' + error.message);
        } finally {
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
            analyzeBtn.disabled = false;
        }
    });

    function displayResults(data) {
        resultBox.classList.remove('hidden');

        const badge = document.getElementById('riskBadge');
        badge.textContent = `${data.risk_level} RISK`;
        badge.className = `risk-badge risk-${data.risk_level}`;

        const aiStatus = document.getElementById('aiGeneratedStatus');
        aiStatus.textContent = data.is_ai_generated ? "Yes (Generative AI Detected)" : "No (Human Like)";
        aiStatus.style.color = data.is_ai_generated ? "#f59e0b" : "#10b981";

        const scamStatus = document.getElementById('scamDetectedStatus');
        scamStatus.textContent = data.is_scam ? "Yes (Phishing / Scam Logic)" : "No (Appears Safe)";
        scamStatus.style.color = data.is_scam ? "#ef4444" : "#10b981";

        document.getElementById('analysisText').textContent = data.explanation;

        // Scroll to results
        resultBox.scrollIntoView({ behavior: 'smooth' });
    }
});
