// Three.js Scene Setup
const canvas = document.getElementById('three-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
camera.position.z = 15;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0x00aaff, 1, 100);
pointLight.position.set(-5, 5, 5);
scene.add(pointLight);

// Create Film Camera with higher detail
function createFilmCamera() {
    const cameraGroup = new THREE.Group();
    
    // Camera body - main
    const bodyGeometry = new THREE.BoxGeometry(2.2, 1.6, 1.6);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2a2a2a,
        metalness: 0.8,
        roughness: 0.2
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    cameraGroup.add(body);
    
    // Camera body details - front panel
    const frontPanelGeometry = new THREE.BoxGeometry(0.1, 1.4, 1.4);
    const frontPanel = new THREE.Mesh(frontPanelGeometry, new THREE.MeshStandardMaterial({ 
        color: 0x1a1a1a,
        metalness: 0.9,
        roughness: 0.1
    }));
    frontPanel.position.set(1.1, 0, 0);
    cameraGroup.add(frontPanel);
    
    // Lens barrel - multiple sections
    const lensBarrel1 = new THREE.CylinderGeometry(0.6, 0.65, 0.8, 64);
    const lensMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x0a0a0a,
        metalness: 0.95,
        roughness: 0.05
    });
    const lens1 = new THREE.Mesh(lensBarrel1, lensMaterial);
    lens1.rotation.z = Math.PI / 2;
    lens1.position.set(1.8, 0, 0);
    cameraGroup.add(lens1);
    
    const lensBarrel2 = new THREE.CylinderGeometry(0.5, 0.6, 0.6, 64);
    const lens2 = new THREE.Mesh(lensBarrel2, lensMaterial);
    lens2.rotation.z = Math.PI / 2;
    lens2.position.set(2.4, 0, 0);
    cameraGroup.add(lens2);
    
    // Lens rings (focus rings)
    for (let i = 0; i < 3; i++) {
        const ringGeometry = new THREE.TorusGeometry(0.52 + i * 0.05, 0.03, 16, 64);
        const ring = new THREE.Mesh(ringGeometry, new THREE.MeshStandardMaterial({ 
            color: 0x444444,
            metalness: 0.9,
            roughness: 0.2
        }));
        ring.rotation.y = Math.PI / 2;
        ring.position.set(1.8 + i * 0.3, 0, 0);
        cameraGroup.add(ring);
    }
    
    // Lens glass with reflection
    const glassGeometry = new THREE.CircleGeometry(0.45, 64);
    const glassMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2244aa,
        metalness: 0.95,
        roughness: 0.05,
        emissive: 0x001144,
        emissiveIntensity: 0.4
    });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.position.set(2.75, 0, 0);
    cameraGroup.add(glass);
    
    // Inner lens reflection
    const innerGlassGeometry = new THREE.CircleGeometry(0.3, 64);
    const innerGlass = new THREE.Mesh(innerGlassGeometry, new THREE.MeshStandardMaterial({ 
        color: 0x4466ff,
        metalness: 1,
        roughness: 0,
        emissive: 0x2244aa,
        emissiveIntensity: 0.6
    }));
    innerGlass.position.set(2.74, 0, 0);
    cameraGroup.add(innerGlass);
    
    // Viewfinder
    const viewfinderGeometry = new THREE.BoxGeometry(0.7, 0.7, 0.5);
    const viewfinder = new THREE.Mesh(viewfinderGeometry, bodyMaterial);
    viewfinder.position.set(-0.6, 1.2, 0);
    cameraGroup.add(viewfinder);
    
    // Viewfinder eyepiece
    const eyepieceGeometry = new THREE.CylinderGeometry(0.2, 0.25, 0.3, 32);
    const eyepiece = new THREE.Mesh(eyepieceGeometry, new THREE.MeshStandardMaterial({ 
        color: 0x1a1a1a,
        metalness: 0.8,
        roughness: 0.3
    }));
    eyepiece.rotation.z = Math.PI / 2;
    eyepiece.position.set(-1.2, 1.2, 0);
    cameraGroup.add(eyepiece);
    
    // Top handle
    const handleGeometry = new THREE.BoxGeometry(1.5, 0.2, 0.3);
    const handle = new THREE.Mesh(handleGeometry, bodyMaterial);
    handle.position.set(0, 1.5, 0);
    cameraGroup.add(handle);
    
    // Side buttons/details
    for (let i = 0; i < 3; i++) {
        const buttonGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 16);
        const button = new THREE.Mesh(buttonGeometry, new THREE.MeshStandardMaterial({ 
            color: 0xff3333,
            metalness: 0.7,
            roughness: 0.3
        }));
        button.rotation.z = Math.PI / 2;
        button.position.set(-0.5 + i * 0.4, 0.5, 0.85);
        cameraGroup.add(button);
    }
    
    // Microphone mount on top
    const micMountGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.6);
    const micMount = new THREE.Mesh(micMountGeometry, new THREE.MeshStandardMaterial({ 
        color: 0x1a1a1a,
        metalness: 0.6,
        roughness: 0.4
    }));
    micMount.position.set(0.5, 1.2, 0);
    cameraGroup.add(micMount);
    
    cameraGroup.position.set(-8, 3, 0);
    return cameraGroup;
}

// Create Clapperboard with higher detail
function createClapperboard() {
    const clapperGroup = new THREE.Group();
    
    // Base board
    const baseGeometry = new THREE.BoxGeometry(2.8, 2.2, 0.15);
    const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1a1a1a,
        metalness: 0.4,
        roughness: 0.6
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    clapperGroup.add(base);
    
    // White info sections on base
    const infoSection1 = new THREE.BoxGeometry(1.2, 0.3, 0.16);
    const infoMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xeeeeee,
        metalness: 0.1,
        roughness: 0.9
    });
    const info1 = new THREE.Mesh(infoSection1, infoMaterial);
    info1.position.set(-0.7, 0.6, 0);
    clapperGroup.add(info1);
    
    const info2 = new THREE.Mesh(infoSection1, infoMaterial);
    info2.position.set(0.7, 0.6, 0);
    clapperGroup.add(info2);
    
    const info3 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.3, 0.16), infoMaterial);
    info3.position.set(0, 0.1, 0);
    clapperGroup.add(info3);
    
    const info4 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.3, 0.16), infoMaterial);
    info4.position.set(0, -0.4, 0);
    clapperGroup.add(info4);
    
    // Top clapper (striped) - thicker
    const topGeometry = new THREE.BoxGeometry(2.8, 0.6, 0.2);
    const topMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        metalness: 0.3,
        roughness: 0.7
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.set(0, 1.4, 0);
    clapperGroup.add(top);
    
    // Black stripes - more detailed
    for (let i = 0; i < 7; i++) {
        const stripeGeometry = new THREE.BoxGeometry(0.35, 0.6, 0.21);
        const stripeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x000000,
            metalness: 0.2,
            roughness: 0.8
        });
        const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        stripe.position.set(-1.2 + i * 0.4, 1.4, 0);
        clapperGroup.add(stripe);
    }
    
    // Hinge details
    for (let i = 0; i < 2; i++) {
        const hingeGeometry = new THREE.CylinderGeometry(0.08, 0.08, 2.8, 16);
        const hingeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x666666,
            metalness: 0.9,
            roughness: 0.2
        });
        const hinge = new THREE.Mesh(hingeGeometry, hingeMaterial);
        hinge.rotation.z = Math.PI / 2;
        hinge.position.set(0, 1.1 + i * 0.05, 0.1);
        clapperGroup.add(hinge);
    }
    
    // Side sticks
    const stickGeometry = new THREE.BoxGeometry(0.15, 2.8, 0.15);
    const stickMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8B4513,
        metalness: 0.2,
        roughness: 0.8
    });
    const stick1 = new THREE.Mesh(stickGeometry, stickMaterial);
    stick1.position.set(-1.4, 0.2, 0);
    clapperGroup.add(stick1);
    
    const stick2 = new THREE.Mesh(stickGeometry, stickMaterial);
    stick2.position.set(1.4, 0.2, 0);
    clapperGroup.add(stick2);
    
    clapperGroup.position.set(8, -2, 0);
    clapperGroup.rotation.z = Math.PI / 6;
    return clapperGroup;
}

// Create Film Reel with higher detail
function createFilmReel() {
    const reelGroup = new THREE.Group();
    
    // Outer rim - double layer
    const outerGeometry = new THREE.TorusGeometry(1.6, 0.12, 32, 100);
    const outerMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x3a3a3a,
        metalness: 0.85,
        roughness: 0.15
    });
    const outer = new THREE.Mesh(outerGeometry, outerMaterial);
    reelGroup.add(outer);
    
    // Inner rim
    const innerRimGeometry = new THREE.TorusGeometry(1.3, 0.08, 24, 100);
    const innerRim = new THREE.Mesh(innerRimGeometry, outerMaterial);
    reelGroup.add(innerRim);
    
    // Center hub - detailed
    const hubGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.35, 64);
    const hubMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2a2a2a,
        metalness: 0.8,
        roughness: 0.2
    });
    const hub = new THREE.Mesh(hubGeometry, hubMaterial);
    hub.rotation.x = Math.PI / 2;
    reelGroup.add(hub);
    
    // Center hole
    const holeGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.36, 32);
    const holeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x0a0a0a,
        metalness: 0.9,
        roughness: 0.1
    });
    const hole = new THREE.Mesh(holeGeometry, holeMaterial);
    hole.rotation.x = Math.PI / 2;
    reelGroup.add(hole);
    
    // Spokes - more detailed
    for (let i = 0; i < 8; i++) {
        const spokeGeometry = new THREE.BoxGeometry(2.9, 0.15, 0.08);
        const spoke = new THREE.Mesh(spokeGeometry, new THREE.MeshStandardMaterial({ 
            color: 0x444444,
            metalness: 0.8,
            roughness: 0.25
        }));
        spoke.rotation.z = (Math.PI / 4) * i;
        reelGroup.add(spoke);
        
        // Spoke reinforcement
        const reinforcementGeometry = new THREE.BoxGeometry(1.5, 0.12, 0.1);
        const reinforcement = new THREE.Mesh(reinforcementGeometry, outerMaterial);
        reinforcement.rotation.z = (Math.PI / 4) * i;
        reinforcement.position.set(
            Math.cos((Math.PI / 4) * i) * 0.7,
            Math.sin((Math.PI / 4) * i) * 0.7,
            0
        );
        reelGroup.add(reinforcement);
    }
    
    // Film texture on reel
    const filmGeometry = new THREE.TorusGeometry(1.0, 0.3, 16, 100);
    const filmMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1a1a1a,
        metalness: 0.3,
        roughness: 0.7
    });
    const film = new THREE.Mesh(filmGeometry, filmMaterial);
    reelGroup.add(film);
    
    // Decorative circles
    for (let i = 0; i < 3; i++) {
        const circleGeometry = new THREE.TorusGeometry(0.4 + i * 0.15, 0.02, 16, 64);
        const circle = new THREE.Mesh(circleGeometry, new THREE.MeshStandardMaterial({ 
            color: 0x555555,
            metalness: 0.9,
            roughness: 0.1
        }));
        reelGroup.add(circle);
    }
    
    reelGroup.position.set(-5, -4, 0);
    return reelGroup;
}

// Create Spotlight with higher detail
function createSpotlight() {
    const spotGroup = new THREE.Group();
    
    // Base stand
    const baseGeometry = new THREE.CylinderGeometry(0.35, 0.55, 0.6, 64);
    const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1a1a1a,
        metalness: 0.85,
        roughness: 0.15
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    spotGroup.add(base);
    
    // Adjustment joint
    const jointGeometry = new THREE.SphereGeometry(0.25, 32, 32);
    const joint = new THREE.Mesh(jointGeometry, new THREE.MeshStandardMaterial({ 
        color: 0x444444,
        metalness: 0.9,
        roughness: 0.1
    }));
    joint.position.y = 0.4;
    spotGroup.add(joint);
    
    // Light housing - main cone
    const coneGeometry = new THREE.ConeGeometry(0.9, 1.8, 64);
    const coneMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2a2a2a,
        metalness: 0.8,
        roughness: 0.2
    });
    const cone = new THREE.Mesh(coneGeometry, coneMaterial);
    cone.position.y = 1.3;
    cone.rotation.x = Math.PI;
    spotGroup.add(cone);
    
    // Light housing rim
    const rimGeometry = new THREE.TorusGeometry(0.9, 0.05, 16, 64);
    const rim = new THREE.Mesh(rimGeometry, new THREE.MeshStandardMaterial({ 
        color: 0x555555,
        metalness: 0.9,
        roughness: 0.1
    }));
    rim.position.y = 0.45;
    rim.rotation.x = Math.PI / 2;
    spotGroup.add(rim);
    
    // Ventilation slots
    for (let i = 0; i < 8; i++) {
        const slotGeometry = new THREE.BoxGeometry(0.1, 0.4, 0.05);
        const slot = new THREE.Mesh(slotGeometry, new THREE.MeshStandardMaterial({ 
            color: 0x0a0a0a,
            metalness: 0.5,
            roughness: 0.5
        }));
        const angle = (Math.PI * 2 / 8) * i;
        slot.position.set(
            Math.cos(angle) * 0.7,
            1.0,
            Math.sin(angle) * 0.7
        );
        slot.rotation.y = angle;
        spotGroup.add(slot);
    }
    
    // Light bulb glow - inner
    const innerGlowGeometry = new THREE.CircleGeometry(0.5, 64);
    const innerGlowMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffaa,
        emissive: 0xffffaa,
        emissiveIntensity: 1
    });
    const innerGlow = new THREE.Mesh(innerGlowGeometry, innerGlowMaterial);
    innerGlow.position.y = 0.35;
    innerGlow.rotation.x = Math.PI / 2;
    spotGroup.add(innerGlow);
    
    // Light bulb glow - outer
    const glowGeometry = new THREE.CircleGeometry(0.8, 64);
    const glowMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffff88,
        emissive: 0xffff88,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.6
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.y = 0.3;
    glow.rotation.x = Math.PI / 2;
    spotGroup.add(glow);
    
    // Barn doors (flaps)
    const flapGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.05);
    const flapMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1a1a1a,
        metalness: 0.8,
        roughness: 0.3
    });
    
    const flap1 = new THREE.Mesh(flapGeometry, flapMaterial);
    flap1.position.set(0.7, 0.5, 0);
    flap1.rotation.y = Math.PI / 6;
    spotGroup.add(flap1);
    
    const flap2 = new THREE.Mesh(flapGeometry, flapMaterial);
    flap2.position.set(-0.7, 0.5, 0);
    flap2.rotation.y = -Math.PI / 6;
    spotGroup.add(flap2);
    
    spotGroup.position.set(6, 4, 0);
    spotGroup.rotation.z = Math.PI / 4;
    return spotGroup;
}

// Create Microphone
function createMicrophone() {
    const micGroup = new THREE.Group();
    
    // Mic head
    const headGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x666666,
        metalness: 0.9,
        roughness: 0.1
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 2;
    micGroup.add(head);
    
    // Mic body
    const bodyGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 32);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333,
        metalness: 0.8,
        roughness: 0.2
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1;
    micGroup.add(body);
    
    // Stand
    const standGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 32);
    const stand = new THREE.Mesh(standGeometry, bodyMaterial);
    stand.position.y = 0;
    micGroup.add(stand);
    
    micGroup.position.set(0, -5, 0);
    return micGroup;
}

// Create Director's Chair
function createDirectorChair() {
    const chairGroup = new THREE.Group();
    
    // Seat
    const seatGeometry = new THREE.BoxGeometry(1.5, 0.1, 1.2);
    const seatMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8B4513,
        metalness: 0.2,
        roughness: 0.8
    });
    const seat = new THREE.Mesh(seatGeometry, seatMaterial);
    chairGroup.add(seat);
    
    // Backrest
    const backGeometry = new THREE.BoxGeometry(1.5, 1.5, 0.1);
    const backMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x000000,
        metalness: 0.1,
        roughness: 0.9
    });
    const back = new THREE.Mesh(backGeometry, backMaterial);
    back.position.set(0, 0.8, -0.6);
    chairGroup.add(back);
    
    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 16);
    const legMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8B4513,
        metalness: 0.3,
        roughness: 0.7
    });
    
    const positions = [
        [-0.6, -0.5, 0.5],
        [0.6, -0.5, 0.5],
        [-0.6, -0.5, -0.5],
        [0.6, -0.5, -0.5]
    ];
    
    positions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(...pos);
        chairGroup.add(leg);
    });
    
    chairGroup.position.set(4, -6, 0);
    chairGroup.rotation.y = Math.PI / 6;
    return chairGroup;
}

// Add all equipment to scene
const filmCamera = createFilmCamera();
const clapperboard = createClapperboard();
const filmReel = createFilmReel();
const spotlight = createSpotlight();
const microphone = createMicrophone();
const directorChair = createDirectorChair();

scene.add(filmCamera);
scene.add(clapperboard);
scene.add(filmReel);
scene.add(spotlight);
scene.add(microphone);
scene.add(directorChair);

// GSAP ScrollTrigger Setup
gsap.registerPlugin(ScrollTrigger);

// Animate section content on scroll
gsap.utils.toArray('.section-content').forEach((section, i) => {
    gsap.to(section, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 20%',
            toggleActions: 'play none none reverse'
        }
    });
});

// Film Camera Animation
gsap.to(filmCamera.position, {
    x: 2,
    y: 0,
    scrollTrigger: {
        trigger: '.section-1',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
    }
});

gsap.to(filmCamera.rotation, {
    y: Math.PI * 2,
    scrollTrigger: {
        trigger: '.section-1',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
    }
});

// Clapperboard Animation
gsap.to(clapperboard.position, {
    x: -3,
    y: 2,
    scrollTrigger: {
        trigger: '.section-2',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
    }
});

gsap.to(clapperboard.rotation, {
    z: -Math.PI / 6,
    scrollTrigger: {
        trigger: '.section-2',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
    }
});

// Film Reel Animation
gsap.to(filmReel.position, {
    x: 5,
    y: 0,
    scrollTrigger: {
        trigger: '.section-2',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
    }
});

gsap.to(filmReel.rotation, {
    z: Math.PI * 4,
    scrollTrigger: {
        trigger: '.section-2',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
    }
});

// Spotlight Animation
gsap.to(spotlight.position, {
    x: -4,
    y: -1,
    scrollTrigger: {
        trigger: '.section-3',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
    }
});

gsap.to(spotlight.rotation, {
    z: -Math.PI / 4,
    scrollTrigger: {
        trigger: '.section-3',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
    }
});

// Microphone Animation
gsap.to(microphone.position, {
    x: 3,
    y: 0,
    scrollTrigger: {
        trigger: '.section-3',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
    }
});

gsap.to(microphone.rotation, {
    y: Math.PI * 2,
    scrollTrigger: {
        trigger: '.section-3',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
    }
});

// Director Chair Animation
gsap.to(directorChair.position, {
    x: -2,
    y: 0,
    scrollTrigger: {
        trigger: '.section-4',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
    }
});

gsap.to(directorChair.rotation, {
    y: Math.PI / 2,
    scrollTrigger: {
        trigger: '.section-4',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
    }
});

// Camera movement based on scroll
ScrollTrigger.create({
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
        camera.position.y = self.progress * 5 - 2.5;
    }
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    // Continuous subtle rotations
    filmCamera.rotation.x += 0.001;
    filmReel.rotation.z += 0.005;
    spotlight.rotation.y += 0.002;
    
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Smooth scroll with active state
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Remove active class from all nav links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Smooth scroll to target
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Video Carousel - Infinite Loop Setup
function setupVideoCarousel() {
    const carousel = document.querySelector('.video-carousel');
    if (!carousel) return;
    
    const videoItems = Array.from(carousel.children);
    
    // Clone all videos to create seamless loop
    videoItems.forEach(item => {
        const clone = item.cloneNode(true);
        carousel.appendChild(clone);
    });
    
    // Add click handlers to all video items (original and cloned)
    document.querySelectorAll('.video-item').forEach(item => {
        // Pause animation on hover
        item.addEventListener('mouseenter', () => {
            carousel.style.animationPlayState = 'paused';
        });
        
        item.addEventListener('mouseleave', () => {
            carousel.style.animationPlayState = 'running';
        });
        
        // Click to open YouTube video
        item.addEventListener('click', () => {
            const videoId = item.getAttribute('data-video-id');
            if (videoId) {
                window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
            }
        });
    });
}

// Initialize carousel when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupVideoCarousel);
} else {
    setupVideoCarousel();
}

// Sticky Navigation on Scroll
function setupStickyNavigation() {
    const navigation = document.querySelector('.navigation');
    if (!navigation) return;
    
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    // Get the initial position of navigation
    const navInitialOffset = heroSection.offsetTop + heroSection.offsetHeight - navigation.offsetHeight;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > navInitialOffset) {
            navigation.classList.add('sticky');
        } else {
            navigation.classList.remove('sticky');
        }
    });
}

// Initialize sticky navigation
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupStickyNavigation);
} else {
    setupStickyNavigation();
}

// About Section - 3D Software Icons
function setupAboutSection() {
    const aboutCanvas = document.getElementById('about-canvas');
    if (!aboutCanvas) return;
    
    const aboutSection = document.getElementById('about-section');
    const aboutScene = new THREE.Scene();
    const aboutCamera = new THREE.PerspectiveCamera(75, aboutSection.offsetWidth / aboutSection.offsetHeight, 0.1, 1000);
    const aboutRenderer = new THREE.WebGLRenderer({ canvas: aboutCanvas, alpha: true, antialias: true });
    
    aboutRenderer.setSize(aboutSection.offsetWidth, aboutSection.offsetHeight);
    aboutRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    aboutCamera.position.z = 15;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    aboutScene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x00aaff, 1.5, 100);
    pointLight1.position.set(10, 10, 10);
    aboutScene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff00ff, 1.5, 100);
    pointLight2.position.set(-10, -10, 10);
    aboutScene.add(pointLight2);
    
    // Create editing-related 3D objects
    const editingObjects = [];
    
    // Play Button (Triangle)
    const playButton = createPlayButton();
    playButton.position.set(-7, 5, 2);
    aboutScene.add(playButton);
    editingObjects.push(playButton);
    
    // Camera
    const camera3D = createCamera3D();
    camera3D.position.set(7, 5, 2);
    aboutScene.add(camera3D);
    editingObjects.push(camera3D);
    
    // Film Strip
    const filmStrip = createFilmStrip();
    filmStrip.position.set(-7, -5, 2);
    aboutScene.add(filmStrip);
    editingObjects.push(filmStrip);
    
    // Clapperboard
    const clapper = createMiniClapper();
    clapper.position.set(7, -5, 2);
    aboutScene.add(clapper);
    editingObjects.push(clapper);
    
    // Timeline bars (behind the text)
    const timeline1 = createTimelineBar();
    timeline1.position.set(-4, 0, -3);
    aboutScene.add(timeline1);
    editingObjects.push(timeline1);
    
    const timeline2 = createTimelineBar();
    timeline2.position.set(4, 0, -3);
    aboutScene.add(timeline2);
    editingObjects.push(timeline2);
    
    // Play Button
    function createPlayButton() {
        const group = new THREE.Group();
        
        // Circle background
        const circleGeometry = new THREE.CircleGeometry(1, 32);
        const circleMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xff3366,
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0xff3366,
            emissiveIntensity: 0.3
        });
        const circle = new THREE.Mesh(circleGeometry, circleMaterial);
        group.add(circle);
        
        // Triangle (play icon)
        const triangleShape = new THREE.Shape();
        triangleShape.moveTo(0.3, 0);
        triangleShape.lineTo(-0.3, 0.4);
        triangleShape.lineTo(-0.3, -0.4);
        triangleShape.lineTo(0.3, 0);
        
        const triangleGeometry = new THREE.ShapeGeometry(triangleShape);
        const triangleMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            metalness: 0.5,
            roughness: 0.3
        });
        const triangle = new THREE.Mesh(triangleGeometry, triangleMaterial);
        triangle.position.z = 0.1;
        group.add(triangle);
        
        return group;
    }
    
    // 3D Camera
    function createCamera3D() {
        const group = new THREE.Group();
        
        // Camera body
        const bodyGeometry = new THREE.BoxGeometry(1.2, 0.8, 0.8);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            metalness: 0.9,
            roughness: 0.1
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        group.add(body);
        
        // Lens
        const lensGeometry = new THREE.CylinderGeometry(0.3, 0.35, 0.6, 32);
        const lensMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x111111,
            metalness: 1,
            roughness: 0.05,
            emissive: 0x0044ff,
            emissiveIntensity: 0.3
        });
        const lens = new THREE.Mesh(lensGeometry, lensMaterial);
        lens.rotation.z = Math.PI / 2;
        lens.position.x = 0.7;
        group.add(lens);
        
        return group;
    }
    
    // Film Strip
    function createFilmStrip() {
        const group = new THREE.Group();
        
        // Main strip
        const stripGeometry = new THREE.BoxGeometry(2, 0.8, 0.1);
        const stripMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x222222,
            metalness: 0.6,
            roughness: 0.4
        });
        const strip = new THREE.Mesh(stripGeometry, stripMaterial);
        group.add(strip);
        
        // Film holes
        for (let i = -3; i <= 3; i++) {
            const holeGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.12);
            const holeMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x000000,
                metalness: 0.3,
                roughness: 0.7
            });
            const hole = new THREE.Mesh(holeGeometry, holeMaterial);
            hole.position.set(i * 0.3, 0.35, 0);
            group.add(hole);
            
            const hole2 = new THREE.Mesh(holeGeometry, holeMaterial);
            hole2.position.set(i * 0.3, -0.35, 0);
            group.add(hole2);
        }
        
        return group;
    }
    
    // Mini Clapperboard
    function createMiniClapper() {
        const group = new THREE.Group();
        
        // Base
        const baseGeometry = new THREE.BoxGeometry(1.2, 1, 0.1);
        const baseMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x1a1a1a,
            metalness: 0.5,
            roughness: 0.5
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        group.add(base);
        
        // Top (striped)
        const topGeometry = new THREE.BoxGeometry(1.2, 0.3, 0.1);
        const topMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            metalness: 0.3,
            roughness: 0.7
        });
        const top = new THREE.Mesh(topGeometry, topMaterial);
        top.position.y = 0.65;
        group.add(top);
        
        // Black stripes
        for (let i = 0; i < 3; i++) {
            const stripeGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.11);
            const stripeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
            const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
            stripe.position.set(-0.4 + i * 0.4, 0.65, 0);
            group.add(stripe);
        }
        
        return group;
    }
    
    // Timeline Bar
    function createTimelineBar() {
        const group = new THREE.Group();
        
        // Main bar
        const barGeometry = new THREE.BoxGeometry(0.3, 2, 0.3);
        const barMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x00aaff,
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0x00aaff,
            emissiveIntensity: 0.4
        });
        const bar = new THREE.Mesh(barGeometry, barMaterial);
        group.add(bar);
        
        // Segments
        for (let i = -3; i <= 3; i++) {
            const segmentGeometry = new THREE.BoxGeometry(0.4, 0.1, 0.1);
            const segmentMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xffffff,
                metalness: 0.9,
                roughness: 0.1
            });
            const segment = new THREE.Mesh(segmentGeometry, segmentMaterial);
            segment.position.y = i * 0.3;
            segment.position.z = 0.2;
            group.add(segment);
        }
        
        return group;
    }
    
    // Animation
    function animateAbout() {
        requestAnimationFrame(animateAbout);
        
        const time = Date.now() * 0.001;
        
        // Animate all editing objects
        editingObjects.forEach((obj, index) => {
            // Rotation
            obj.rotation.y += 0.008;
            obj.rotation.x = Math.sin(time + index) * 0.1;
            
            // Floating animation
            const baseY = obj.position.y;
            obj.position.z = 2 + Math.sin(time * 0.5 + index) * 0.5;
        });
        
        aboutRenderer.render(aboutScene, aboutCamera);
    }
    
    animateAbout();
    
    // Handle resize for about section
    window.addEventListener('resize', () => {
        const width = aboutSection.offsetWidth;
        const height = aboutSection.offsetHeight;
        aboutCamera.aspect = width / height;
        aboutCamera.updateProjectionMatrix();
        aboutRenderer.setSize(width, height);
    });
}

// Initialize about section
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAboutSection);
} else {
    setupAboutSection();
}
