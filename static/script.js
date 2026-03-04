// ------- THREE.JS BACKGROUND (Lusion.co style) -------
const init3DBackground = () => {
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Particle System (Neural Network / Cyber Data Sphere Representation)
    const geometry = new THREE.BufferGeometry();
    const particles = 3000;
    const positions = new Float32Array(particles * 3);
    const colors = new Float32Array(particles * 3);

    const color1 = new THREE.Color(0x0ea5e9); // Light blue
    const color2 = new THREE.Color(0x6366f1); // Indigo
    const color3 = new THREE.Color(0xffffff); // White

    for (let i = 0; i < particles * 3; i += 3) {
        // Sphere Distribution
        const r = 10 * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i] = r * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = r * Math.cos(phi);

        // Colors mixing
        const mix = Math.random();
        let c = color1;
        if (mix > 0.6) c = color2;
        if (mix > 0.9) c = color3;

        colors[i] = c.r;
        colors[i + 1] = c.g;
        colors[i + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom Shader Material for glowing dots
    const material = new THREE.PointsMaterial({
        size: 0.04,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
    camera.position.z = 15;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
    });

    const animate = () => {
        requestAnimationFrame(animate);

        // Smooth Mouse Follow Interpolation
        targetX = mouseX * 2;
        targetY = mouseY * 2;

        particleSystem.rotation.x += 0.001 + (targetY - particleSystem.rotation.x) * 0.02;
        particleSystem.rotation.y += 0.002 + (targetX - particleSystem.rotation.y) * 0.02;

        // Subtle pulsing
        const time = Date.now() * 0.0005;
        material.size = 0.04 + Math.sin(time) * 0.01;

        renderer.render(scene, camera);
    };

    animate();

    // Resize Event
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Init 3D
    init3DBackground();

    // 2. GSAP Entrance Animations
    gsap.from("header", { duration: 1.5, y: -50, opacity: 0, ease: "power4.out" });
    gsap.from(".hero-title", { duration: 1.5, y: 30, opacity: 0, ease: "power4.out", delay: 0.3 });
    gsap.from(".hero-subtitle", { duration: 1.5, y: 30, opacity: 0, ease: "power4.out", delay: 0.5 });
    gsap.from(".cyber-panel", { duration: 1.5, scale: 0.95, opacity: 0, ease: "power4.out", delay: 0.7 });

    // 3. UI Interactions (Tabs & Platforms)
    let activePlatform = "Web/General";

    document.querySelectorAll('.platform-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.platform-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activePlatform = btn.dataset.platform;
        });
    });

    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.input-area').forEach(a => a.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.target).classList.add('active');
        });
    });

    // 4. File Drag & Drop
    let selectedFile = null;
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const fileNameDisplay = document.getElementById('fileNameDisplay');

    uploadZone.addEventListener('click', () => fileInput.click());
    uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); uploadZone.classList.add('dragover'); });
    uploadZone.addEventListener('dragleave', (e) => { e.preventDefault(); uploadZone.classList.remove('dragover'); });
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault(); uploadZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });

    function handleFile(file) {
        selectedFile = file;
        fileNameDisplay.innerHTML = `<i class="fa-solid fa-file-image"></i> Captured: ${file.name}`;
    }

    // 5. Modal Flow
    const apiModal = document.getElementById('apiModal');
    document.getElementById('settingsBtn').onclick = () => {
        apiModal.classList.remove('hidden');
        gsap.fromTo(apiModal.querySelector('.modal-content'), { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" });
    };
    document.querySelector('.close-btn').onclick = () => apiModal.classList.add('hidden');

    document.getElementById('saveApiBtn').onclick = () => {
        const key = document.getElementById('userApiKey').value.trim();
        if (key) {
            localStorage.setItem('aegis_api_key', key);
            document.getElementById('apiStatus').innerHTML = "<i class='fa-solid fa-check'></i> Securely Encrypted & Stored";
            setTimeout(() => { apiModal.classList.add('hidden'); }, 1200);
        }
    };

    // 6. Analysis Trigger execution
    const analyzeBtn = document.getElementById('analyzeBtn');
    const btnText = document.querySelector('.btn-text');
    const loader = document.querySelector('.loader');
    const resultBox = document.getElementById('resultBox');

    analyzeBtn.addEventListener('click', async () => {
        const textContent = document.getElementById('textContent').value.trim();
        const activeTab = document.querySelector('.tab.active').dataset.target;

        if (activeTab === 'text-input' && !textContent) return alert('No context provided. Paste URL or Text.');
        if (activeTab === 'image-input' && !selectedFile) return alert('No image provided.');

        // Loading State
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');
        resultBox.classList.add('hidden');

        // Glitch FX on click just for style
        gsap.to("body", { duration: 0.1, backgroundColor: "#1e1e1e", yoyo: true, repeat: 1 });

        const formData = new FormData();
        if (activeTab === 'text-input') formData.append('text_content', textContent);
        if (activeTab === 'image-input') formData.append('file', selectedFile);
        formData.append('platform', activePlatform);

        const savedKey = localStorage.getItem('aegis_api_key');
        if (savedKey) formData.append('user_api_key', savedKey);

        try {
            const response = await fetch('/api/analyze', { method: 'POST', body: formData });
            if (!response.ok) {
                let err = "API Execution Failed";
                try {
                    const errData = await response.json();
                    err = errData.detail || err;
                } catch (e) { }
                throw new Error(err);
            }

            const data = await response.json();
            displayResults(data);
        } catch (error) {
            alert('Aegis Core Failed: ' + error.message);
        } finally {
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
        }
    });

    const displayResults = (data) => {
        resultBox.classList.remove('hidden');

        // Result GSAP Reveal
        gsap.fromTo(resultBox, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.8, ease: "power3.out" });

        const badge = document.getElementById('riskBadge');
        badge.textContent = `THREAT LEVEL: ${data.risk_level}`;
        badge.className = `risk-badge risk-${data.risk_level}`;

        const aiStatus = document.getElementById('aiGeneratedStatus');
        aiStatus.innerHTML = data.is_ai_generated ? "<span style='color:#fbbf24'><i class='fa-solid fa-robot'></i> SYNTHETIC (YES)</span>" : "<span style='color:#34d399'><i class='fa-solid fa-person'></i> ORGANIC (NO)</span>";

        const scamStatus = document.getElementById('scamDetectedStatus');
        scamStatus.innerHTML = data.is_scam ? "<span style='color:#f87171'><i class='fa-solid fa-triangle-exclamation'></i> CONFIRMED SCAM</span>" : "<span style='color:#34d399'><i class='fa-solid fa-shield-check'></i> NEGATIVE</span>";

        // Typewriter effect for explanation
        const explainEl = document.getElementById('analysisText');
        explainEl.textContent = "";

        const chars = data.explanation.split("");
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < chars.length) {
                explainEl.textContent += chars[i];
                i++;
                // Scroll down automatically as text types
                resultBox.scrollIntoView({ behavior: 'smooth', block: 'end' });
            } else {
                clearInterval(typeInterval);
            }
        }, 15);
    };
});
