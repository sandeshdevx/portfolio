import * as THREE from 'three';

export interface HeroSceneOptions {
  canvas: HTMLCanvasElement;
  host: HTMLElement;
  reducedMotion?: boolean;
  onReady?: () => void;
}

export interface HeroSceneHandle {
  dispose: () => void;
}

interface OrbitSpec {
  radius: number;
  tube: number;
  rotation: [number, number, number];
  speed: number;
  color: number;
  opacity: number;
  satelliteColor: number;
  satelliteSize: number;
  satelliteShape: 'sphere' | 'octahedron';
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const seededRandom = () => {
  let seed = 918273;
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
};

export async function createHeroScene({
  canvas,
  host,
  reducedMotion = false,
  onReady,
}: HeroSceneOptions): Promise<HeroSceneHandle> {
  const compact = window.matchMedia('(max-width: 640px)').matches;
  const dprLimit = compact ? 1.35 : 1.9;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !compact,
    powerPreference: 'high-performance',
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprLimit));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
  camera.position.set(0, 0, 9.4);

  const pmrem = new THREE.PMREMGenerator(renderer);

  // Declarations at function scope for access in dispose
  let roomEnvironment: any;
  let environmentTarget: any;

  // Initialize the RoomEnvironment dynamically (restores metallic reflections)
  await (async () => {
    const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');
    roomEnvironment = new RoomEnvironment();
    environmentTarget = pmrem.fromScene(roomEnvironment, 0.045);
    scene.environment = environmentTarget.texture;
    scene.environmentIntensity = 0.88;
  })();

  const system = new THREE.Group();
  system.rotation.set(-0.08, -0.22, 0.04);
  scene.add(system);

  const baseSystemRotation = new THREE.Vector3(-0.08, -0.22, 0.04);

  const coreGeometry = new THREE.IcosahedronGeometry(1.17, 1);
  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x171a14,
    metalness: 1,
    roughness: 0.26,
    clearcoat: 0.35,
    clearcoatRoughness: 0.35,
    flatShading: true,
    envMapIntensity: 1.15,
    emissive: new THREE.Color(0x0d1207),
    emissiveIntensity: 0.8,
  });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  system.add(core);

  const edgeGeometry = new THREE.EdgesGeometry(coreGeometry);
  const edgeMaterial = new THREE.LineBasicMaterial({
    color: 0xc9f45a,
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
  });
  const coreEdges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
  core.add(coreEdges);

  const innerGeometry = new THREE.IcosahedronGeometry(0.76, 1);
  const innerMaterial = new THREE.MeshStandardMaterial({
    color: 0x060806,
    metalness: 0.5,
    roughness: 0.42,
    flatShading: true,
  });
  const innerCore = new THREE.Mesh(innerGeometry, innerMaterial);
  system.add(innerCore);

  const innerWireGeometry = new THREE.WireframeGeometry(innerGeometry);
  const innerWireMaterial = new THREE.LineBasicMaterial({
    color: 0x7f9fff,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
  });
  const innerWire = new THREE.LineSegments(innerWireGeometry, innerWireMaterial);
  innerCore.add(innerWire);

  const axisGeometry = new THREE.CylinderGeometry(0.004, 0.004, 4.5, 6);
  const axisMaterial = new THREE.MeshStandardMaterial({
    color: 0xc9c6b9,
    metalness: 1,
    roughness: 0.3,
    transparent: true,
    opacity: 0.38,
  });
  const axis = new THREE.Mesh(axisGeometry, axisMaterial);
  system.add(axis);

  const capGeometry = new THREE.SphereGeometry(0.035, 12, 12);
  const capMaterial = new THREE.MeshBasicMaterial({ color: 0xc9f45a });
  const topCap = new THREE.Mesh(capGeometry, capMaterial);
  topCap.position.y = 2.25;
  const bottomCap = new THREE.Mesh(capGeometry, capMaterial);
  bottomCap.position.y = -2.25;
  bottomCap.scale.setScalar(0.7);
  system.add(topCap, bottomCap);

  const accents = new THREE.Group();
  accents.rotation.set(1.15, 0.1, 0.26);
  system.add(accents);

  const tickCount = 64;
  const tickGeometry = new THREE.BoxGeometry(0.004, 0.06, 0.004);
  const tickMaterial = new THREE.MeshBasicMaterial({
    color: 0xb4b1a6,
    transparent: true,
    opacity: 0.38,
    depthWrite: false,
  });
  const ticks = new THREE.InstancedMesh(tickGeometry, tickMaterial, tickCount);
  const tickDummy = new THREE.Object3D();

  for (let index = 0; index < tickCount; index += 1) {
    const angle = (index / tickCount) * Math.PI * 2;
    const major = index % 8 === 0;
    tickDummy.position.set(Math.cos(angle) * 2.88, Math.sin(angle) * 2.88, 0);
    tickDummy.rotation.z = angle - Math.PI / 2;
    tickDummy.scale.set(1, major ? 2.1 : 1, 1);
    tickDummy.updateMatrix();
    ticks.setMatrixAt(index, tickDummy.matrix);
  }

  ticks.instanceMatrix.needsUpdate = true;
  accents.add(ticks);

  const orbitSpecs: OrbitSpec[] = [
    {
      radius: 2.08,
      tube: 0.011,
      rotation: [1.38, 0.12, -0.15],
      speed: 0.18,
      color: 0xc9f45a,
      opacity: 0.55,
      satelliteColor: 0xc9f45a,
      satelliteSize: 0.055,
      satelliteShape: 'sphere',
    },
    {
      radius: 2.5,
      tube: 0.008,
      rotation: [1.05, -0.34, 0.4],
      speed: -0.11,
      color: 0xc9c6b9,
      opacity: 0.5,
      satelliteColor: 0x7f9fff,
      satelliteSize: 0.06,
      satelliteShape: 'octahedron',
    },
    {
      radius: 1.78,
      tube: 0.005,
      rotation: [0.48, 0.48, 1.18],
      speed: 0.24,
      color: 0x7f9fff,
      opacity: 0.36,
      satelliteColor: 0xf1efe6,
      satelliteSize: 0.032,
      satelliteShape: 'sphere',
    },
  ];

  const orbitGroups: { group: THREE.Group; initialZ: number; speed: number }[] = [];

  orbitSpecs.forEach((spec) => {
    const orbit = new THREE.Group();
    orbit.rotation.set(...spec.rotation);

    const ringMaterial = new THREE.MeshStandardMaterial({
      color: spec.color,
      metalness: spec.color === 0xc9c6b9 ? 1 : 0.65,
      roughness: 0.24,
      transparent: true,
      opacity: spec.opacity,
      depthWrite: false,
    });

    if (spec.color !== 0xc9c6b9) {
      ringMaterial.emissive = new THREE.Color(spec.color);
      ringMaterial.emissiveIntensity = 0.16;
    }

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(spec.radius, spec.tube, 6, compact ? 150 : 260),
      ringMaterial,
    );
    orbit.add(ring);

    const satelliteGeometry =
      spec.satelliteShape === 'octahedron'
        ? new THREE.OctahedronGeometry(spec.satelliteSize, 0)
        : new THREE.SphereGeometry(spec.satelliteSize, 16, 16);

    const satelliteMaterial = new THREE.MeshStandardMaterial({
      color: spec.satelliteColor,
      metalness: 0.5,
      roughness: 0.25,
      emissive: new THREE.Color(spec.satelliteColor),
      emissiveIntensity: 0.42,
    });

    const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
    satellite.position.set(spec.radius, 0, 0);
    orbit.add(satellite);

    orbitGroups.push({ group: orbit, initialZ: spec.rotation[2], speed: spec.speed });
    system.add(orbit);
  });

  const dotCount = compact ? 140 : 280;
  const dotPositions = new Float32Array(dotCount * 3);
  const dotGeometry = new THREE.BufferGeometry();

  for (let index = 0; index < dotCount; index += 1) {
    const angle = (index / dotCount) * Math.PI * 2;
    const radius = 2.64 + (index % 3) * 0.012;
    dotPositions[index * 3] = Math.cos(angle) * radius;
    dotPositions[index * 3 + 1] = 0;
    dotPositions[index * 3 + 2] = Math.sin(angle) * radius;
  }

  dotGeometry.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));
  const dotMaterial = new THREE.PointsMaterial({
    color: 0xf1efe6,
    size: 0.017,
    transparent: true,
    opacity: 0.36,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const dotOrbit = new THREE.Points(dotGeometry, dotMaterial);
  dotOrbit.rotation.set(1.4, 0.22, -0.35);
  system.add(dotOrbit);

  const random = seededRandom();
  const particleCount = compact ? 240 : 560;
  const particlePositions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);
  const palette = [new THREE.Color(0xc9f45a), new THREE.Color(0x7f9fff), new THREE.Color(0xf1efe6)];

  for (let index = 0; index < particleCount; index += 1) {
    const radius = 3 + random() * 3.3;
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    const flatten = 0.65 + random() * 0.35;

    particlePositions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
    particlePositions[index * 3 + 1] = radius * Math.cos(phi) * flatten;
    particlePositions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

    const color = palette[Math.floor(random() * palette.length)];
    const brightness = 0.4 + random() * 0.6;
    particleColors[index * 3] = color.r * brightness;
    particleColors[index * 3 + 1] = color.g * brightness;
    particleColors[index * 3 + 2] = color.b * brightness;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: compact ? 0.024 : 0.021,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  const hemisphere = new THREE.HemisphereLight(0xf1efe6, 0x080a06, 0.75);
  scene.add(hemisphere);

  const keyLight = new THREE.DirectionalLight(0xfff2d8, 2.6);
  keyLight.position.set(4.5, 6, 6);
  scene.add(keyLight);

  const limeLight = new THREE.PointLight(0xc9f45a, 34, 16, 2);
  limeLight.position.set(-4.5, -2.2, 3.5);
  scene.add(limeLight);

  const blueLight = new THREE.PointLight(0x7f9fff, 22, 15, 2);
  blueLight.position.set(3.8, -3.5, -2.5);
  scene.add(blueLight);

  const pointerTarget = new THREE.Vector2(0, 0);
  const pointerCurrent = new THREE.Vector2(0, 0);
  let scrollProgress = 0;
  let visible = true;
  let running = false;
  let raf = 0;
  let lastTime = performance.now();
  let elapsed = 0;
  let ready = false;

  const markReady = () => {
    if (ready) return;
    ready = true;
    onReady?.();
  };

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    pointerTarget.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      (event.clientY / window.innerHeight) * 2 - 1,
    );
  };

  const onScroll = () => {
    scrollProgress = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 0, 1);
  };

  const resize = () => {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (width === 0 || height === 0) return;

    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const frame = (now: number) => {
    raf = 0;
    if (!running) return;

    const delta = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    elapsed += delta;

    pointerCurrent.x = THREE.MathUtils.damp(pointerCurrent.x, pointerTarget.x, 3.4, delta);
    pointerCurrent.y = THREE.MathUtils.damp(pointerCurrent.y, pointerTarget.y, 3.4, delta);

    system.rotation.x = THREE.MathUtils.damp(
      system.rotation.x,
      baseSystemRotation.x + pointerCurrent.y * 0.14,
      3.2,
      delta,
    );
    system.rotation.y = THREE.MathUtils.damp(
      system.rotation.y,
      baseSystemRotation.y + pointerCurrent.x * 0.26,
      3.2,
      delta,
    );
    system.rotation.z = baseSystemRotation.z + scrollProgress * 0.16;
    system.position.y = Math.sin(elapsed * 0.42) * 0.055 - scrollProgress * 0.52;

    core.rotation.y += delta * 0.11;
    core.rotation.x = Math.sin(elapsed * 0.22) * 0.08;
    innerCore.rotation.y -= delta * 0.19;
    innerCore.rotation.z += delta * 0.05;

    orbitGroups.forEach(({ group, initialZ, speed }) => {
      group.rotation.z = initialZ + elapsed * speed;
    });

    accents.rotation.z = 0.26 + elapsed * 0.018;
    dotOrbit.rotation.z = -0.35 + elapsed * 0.024;
    particles.rotation.y = elapsed * 0.008;
    particles.rotation.x = Math.sin(elapsed * 0.04) * 0.05;

    camera.position.x = pointerCurrent.x * 0.24;
    camera.position.y = -pointerCurrent.y * 0.18;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    markReady();
    raf = requestAnimationFrame(frame);
  };

  const start = () => {
    if (running || reducedMotion) return;
    if (document.hidden || !visible) return;
    running = true;
    lastTime = performance.now();
    raf = requestAnimationFrame(frame);
  };

  const stop = () => {
    running = false;
    if (raf !== 0) cancelAnimationFrame(raf);
    raf = 0;
  };

  const onVisibilityChange = () => {
    if (document.hidden) stop();
    else start();
  };

  const onContextLost = (event: Event) => {
    event.preventDefault();
    stop();
    canvas.dataset.failed = 'true';
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);

  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      visible = Boolean(entry?.isIntersecting);
      if (visible) start();
      else stop();
    },
    { threshold: 0.01 },
  );
  intersectionObserver.observe(host);

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('visibilitychange', onVisibilityChange);
  canvas.addEventListener('webglcontextlost', onContextLost);

  resize();
  onScroll();

  if (reducedMotion) {
    renderer.render(scene, camera);
    markReady();
  } else {
    start();
  }

  // Return the handle after a brief wait for environment initialization
  return new Promise<HeroSceneHandle>(resolve => {
    const initialize = () => {
      resolve({
        dispose: () => {
          stop();
          resizeObserver.disconnect();
          intersectionObserver.disconnect();
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('scroll', onScroll);
          document.removeEventListener('visibilitychange', onVisibilityChange);
          canvas.removeEventListener('webglcontextlost', onContextLost);

          const geometries = new Set<THREE.BufferGeometry>();
          const materials = new Set<THREE.Material>();

          scene.traverse((object) => {
            const renderable = object as THREE.Mesh | THREE.Points | THREE.LineSegments;
            if ('geometry' in renderable && renderable.geometry) {
              geometries.add(renderable.geometry as THREE.BufferGeometry);
            }
            if ('material' in renderable && renderable.material) {
              const list = Array.isArray(renderable.material)
                ? renderable.material
                : [renderable.material];
              list.forEach((material) => materials.add(material));
            }
          });

          geometries.forEach((geometry) => geometry.dispose());
          materials.forEach((material) => {
            Object.values(material).forEach((value) => {
              if (value instanceof THREE.Texture) value.dispose();
            });
            material.dispose();
          });

          if (environmentTarget) environmentTarget.dispose();
          if (pmrem) pmrem.dispose();
          if (roomEnvironment) roomEnvironment.dispose();

          scene.clear();
          renderer.dispose();
          renderer.forceContextLoss();
        },
      });
    };

    const checkReady = () => {
      if (environmentTarget && roomEnvironment) {
        initialize();
      } else {
        setTimeout(checkReady, 50);
      }
    };
    checkReady();
  });
}