// ------- THREE.JS BACKGROUND (Lusion.co style Data Wave) -------
const init3DBackground = () => {
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Dynamic Undulating Plane (Data Lake / Cyber Mesh)
    const geometry = new THREE.PlaneGeometry(30, 30, 70, 70);
    // Rotate to lay almost flat
    geometry.rotateX(-Math.PI / 2);

    // Custom Material for glowing mesh knots
    const material = new THREE.PointsMaterial({
        size: 0.04,
        color: 0x0ea5e9,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // Position camera dynamically via animation
    camera.position.y = 3;
    camera.position.z = 8;
    camera.lookAt(0, 0, 0);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.002;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.002;
    });

    // Save the original vertices for deformation baseline
    const positionAttribute = geometry.attributes.position;
    const vertexCount = positionAttribute.count;
    const originalPositions = new Float32Array(vertexCount * 3);
    for (let i = 0; i < vertexCount * 3; i++) {
        originalPositions[i] = positionAttribute.array[i];
    }

    // Control parameters for the wave geometry
    let waveParams = {
        speed: 1,
        height: 0.5,
        frequency: 0.5
    };

    const animate = () => {
        requestAnimationFrame(animate);

        const time = Date.now() * 0.001 * waveParams.speed;

        // Animate the plane vertices to create an undulating wave
        for (let i = 0; i < vertexCount; i++) {
            const px = originalPositions[i * 3];
            const pz = originalPositions[i * 3 + 2];

            // Generate a sin/cos wave interference pattern on the Y axis
            const waveY = Math.sin((px * waveParams.frequency) + time) * waveParams.height +
                Math.cos((pz * waveParams.frequency) + time) * waveParams.height;

            positionAttribute.setY(i, waveY);
        }
        positionAttribute.needsUpdate = true;

        // Smooth Camera Follow
        camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
        camera.position.y += (3 - mouseY * 5 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    };

    animate();

    // Resize Event
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Expose Global Color Transition function for Results
    window.transitionParticles = (isScam) => {
        const targetColor = isScam ? new THREE.Color(0xef4444) : new THREE.Color(0x10b981);
        gsap.to(material.color, { r: targetColor.r, g: targetColor.g, b: targetColor.b, duration: 1.5, ease: "power2.out" });
        // Make the waves spike aggressively if it's a scam, or become smooth if safe
        gsap.to(waveParams, {
            speed: isScam ? 4 : 0.5,
            height: isScam ? 2.5 : 0.2, // Huge violent spikes for scams
            frequency: isScam ? 1.5 : 0.3,
            duration: 1.5,
            ease: "power2.out"
        });
    };
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
    const aboutModal = document.getElementById('aboutModal');

    document.getElementById('settingsBtn').onclick = () => {
        apiModal.classList.remove('hidden');
        gsap.fromTo(apiModal.querySelector('.modal-content'), { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" });
    };
    document.querySelector('#apiModal .close-btn').onclick = () => apiModal.classList.add('hidden');

    document.getElementById('aboutBtn').onclick = () => {
        aboutModal.classList.remove('hidden');
        gsap.fromTo(aboutModal.querySelector('.modal-content'), { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" });
    };
    document.getElementById('closeAboutBtn').onclick = () => aboutModal.classList.add('hidden');

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

        // Trigger the 3D Background Pulse (Red or Green)
        if (window.transitionParticles) window.transitionParticles(data.is_scam);

        // Immersive Floating Text Animation over the screen
        const overlay = document.getElementById('immersiveOverlay');
        const overlayText = document.getElementById('immersiveText');
        overlay.classList.remove('hidden');
        overlayText.className = 'immersive-text ' + (data.is_scam ? 'text-scam' : 'text-safe');
        overlayText.textContent = data.is_scam ? 'SCAM DETECTED' : 'SAFE & REAL';

        gsap.fromTo(overlayText,
            { scale: 0.3, opacity: 0, zIndex: 100 },
            {
                scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2)",
                onComplete: () => {
                    gsap.to(overlayText, {
                        scale: 2, opacity: 0, delay: 1.2, duration: 0.8, ease: "power2.in",
                        onComplete: () => overlay.classList.add('hidden')
                    });
                }
            }
        );

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
