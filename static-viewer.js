import * as THREE from 'https://unpkg.com/three@0.176.0/build/three.module.js?module';
import { OrbitControls } from 'https://unpkg.com/three@0.176.0/examples/jsm/controls/OrbitControls.js?module';
import { GLTFLoader } from 'https://unpkg.com/three@0.176.0/examples/jsm/loaders/GLTFLoader.js?module';

const characters = [
  { id: 'ryuk', name: 'Ryuk', path: './public/models/shinigami_stance_ryuk.glb', rig: 'static', poseProfile: 'static' },
  { id: 'luffy-afro', name: 'Luffy (Afro)', path: './public/models/monkey_d._luffy_afro.glb', rig: 'static', poseProfile: 'static' },
  { id: 'morrigan-aensland', name: 'Morrigan Aensland', path: './public/models/morrigan_aensland.glb', rig: 'static', poseProfile: 'static', hiddenByCode: true },
  { id: 'chunli-fortnite', name: 'Chun-Li Fortnite', path: './public/models/chunli.glb', rig: 'sf-chunli-a', poseProfile: 'chunli-fortnite', hiddenByCode: true },
  { id: 'nami-bikini', name: 'Nami Bikini', path: './public/models/model-2.glb', rig: 'static', poseProfile: 'static', hiddenByCode: true },
  { id: 'chunli-alt', name: 'Chun-Li Alt', path: './public/models/model-3.glb', rig: 'sf-chunli-b', poseProfile: 'chunli-alt', hiddenByCode: true },
  { id: 'mizuki-shiranui', name: 'Mizuki Shiranui', path: './public/models/model-4.glb', rig: 'static', poseProfile: 'static', modelRotation: [-Math.PI / 2, 0, 0], hiddenByCode: true },
];

const poses = [
  { id: 'idle', name: 'Idle', description: 'Original downloaded pose.' },
  { id: 'sitting', name: 'Sitting', description: 'Seated pose with bent legs.' },
  { id: 'bent-over', name: 'Bent Over', description: 'Forward lean pose.' },
  { id: 'mid-air-jump', name: 'Mid-Air Jump', description: 'Dynamic airborne jump pose.' },
  { id: 'laying', name: 'Laying', description: 'Horizontal reclined pose.' },
];

const poseTweaks = {
  'chunli-fortnite': {
    idle: null,
    sitting: {
      hips: { rotation: [-0.38, 0, 0] },
      spine: [0.18, 0, 0],
      chest: [0.12, 0, 0],
      neck: [-0.06, 0, 0],
      head: [-0.04, 0, 0],
      leftUpperArm: [0.18, 0, -0.08],
      rightUpperArm: [0.18, 0, 0.08],
      leftLowerArm: [-0.16, 0, -0.05],
      rightLowerArm: [-0.16, 0, 0.05],
      leftUpperLeg: [-1.35, 0.08, -0.06],
      rightUpperLeg: [-1.35, -0.08, 0.06],
      leftLowerLeg: [1.6, 0, 0],
      rightLowerLeg: [1.6, 0, 0],
    },
    'bent-over': {
      hips: { rotation: [0.22, 0, 0] },
      spine: [0.52, 0, 0],
      chest: [0.32, 0, 0],
      neck: [-0.2, 0, 0],
      head: [-0.12, 0, 0],
      leftUpperArm: [-0.16, 0, -0.08],
      rightUpperArm: [-0.16, 0, 0.08],
      leftLowerArm: [-0.1, 0, -0.04],
      rightLowerArm: [-0.1, 0, 0.04],
      leftUpperLeg: [-0.16, 0, 0],
      rightUpperLeg: [-0.16, 0, 0],
    },
    'mid-air-jump': {
      hips: { rotation: [-0.18, 0, 0] },
      spine: [-0.14, 0, 0],
      chest: [-0.08, 0, 0],
      leftUpperArm: [-1.0, 0, -0.28],
      rightUpperArm: [-0.72, 0, 0.38],
      leftLowerArm: [-0.34, 0, -0.1],
      rightLowerArm: [-0.42, 0, 0.14],
      leftUpperLeg: [0.92, 0.18, -0.14],
      rightUpperLeg: [-0.72, -0.14, 0.1],
      leftLowerLeg: [0.62, 0, 0],
      rightLowerLeg: [1.18, 0, 0],
    },
    laying: {
      hips: { rotation: [0, 0, 1.57] },
      spine: [0.08, 0, 0],
      chest: [0.06, 0, 0],
      neck: [0.04, 0, 0],
      head: [0, 0, -0.1],
      leftUpperArm: [0.1, 0, -0.2],
      rightUpperArm: [0.1, 0, 0.2],
      leftUpperLeg: [0.06, 0, 0],
      rightUpperLeg: [0.06, 0, 0],
    },
  },
  'chunli-alt': {
    idle: null,
    sitting: {
      hips: { rotation: [-0.52, 0, 0] },
      spine: [0.24, 0, 0],
      chest: [0.18, 0, 0],
      neck: [-0.08, 0, 0],
      head: [-0.05, 0, 0],
      leftUpperArm: [0.22, 0, -0.1],
      rightUpperArm: [0.22, 0, 0.1],
      leftLowerArm: [-0.18, 0, -0.06],
      rightLowerArm: [-0.18, 0, 0.06],
      leftUpperLeg: [-1.6, 0.08, -0.06],
      rightUpperLeg: [-1.6, -0.08, 0.06],
      leftLowerLeg: [1.9, 0, 0],
      rightLowerLeg: [1.9, 0, 0],
    },
    'bent-over': {
      hips: { rotation: [0.3, 0, 0] },
      spine: [0.62, 0, 0],
      chest: [0.42, 0, 0],
      neck: [-0.24, 0, 0],
      head: [-0.16, 0, 0],
      leftUpperArm: [-0.18, 0, -0.08],
      rightUpperArm: [-0.18, 0, 0.08],
      leftLowerArm: [-0.1, 0, -0.04],
      rightLowerArm: [-0.1, 0, 0.04],
      leftUpperLeg: [-0.2, 0, 0],
      rightUpperLeg: [-0.2, 0, 0],
    },
    'mid-air-jump': {
      hips: { rotation: [-0.24, 0, 0] },
      spine: [-0.16, 0, 0],
      chest: [-0.1, 0, 0],
      leftUpperArm: [-1.18, 0, -0.34],
      rightUpperArm: [-0.86, 0, 0.46],
      leftLowerArm: [-0.36, 0, -0.12],
      rightLowerArm: [-0.5, 0, 0.16],
      leftUpperLeg: [1.08, 0.2, -0.16],
      rightUpperLeg: [-0.86, -0.16, 0.12],
      leftLowerLeg: [0.74, 0, 0],
      rightLowerLeg: [1.34, 0, 0],
    },
    laying: {
      hips: { rotation: [0, 0, 1.57] },
      spine: [0.1, 0, 0],
      chest: [0.08, 0, 0],
      neck: [0.05, 0, 0],
      head: [0, 0, -0.12],
      leftUpperArm: [0.12, 0, -0.22],
      rightUpperArm: [0.12, 0, 0.22],
      leftUpperLeg: [0.08, 0, 0],
      rightUpperLeg: [0.08, 0, 0],
    },
  },
  static: {
    idle: null,
    sitting: null,
    'bent-over': null,
    'mid-air-jump': null,
    laying: null,
  },
};

const boneAliases = {
  hips: ['hips', 'pelvis', 'pelvis_175', 'pelvis_183', 'root', 'mixamorighips', 'j_bip_c_hips', 'rootjoint'],
  spine: ['spine', 'spine_01', 'spine_01_152', 'spine_01_160', 'mixamorigspine', 'j_bip_c_spine'],
  chest: ['chest', 'upperchest', 'spine1', 'spine2', 'spine_03', 'spine_03_150', 'spine_03_158', 'spine_04', 'spine_04_149', 'spine_04_157', 'spine_05', 'spine_05_132', 'spine_05_140', 'mixamorigspine1', 'mixamorigspine2'],
  neck: ['neck', 'neck_01', 'neck_01_131', 'neck_01_136', 'neck_02', 'neck_02_130', 'neck_02_135', 'mixamorigneck', 'j_bip_c_neck'],
  head: ['head', 'head_129', 'head_134', 'chunlihead186', 'chunlihead', 'mixamorighead', 'j_bip_c_head'],
  leftUpperArm: ['leftarm', 'leftupperarm', 'upperarm_l', 'upperarm_l_30', 'mixamorigleftarm', 'j_bip_l_upperarm'],
  rightUpperArm: ['rightarm', 'rightupperarm', 'upperarm_r', 'upperarm_r_63', 'mixamorigrightarm', 'j_bip_r_upperarm'],
  leftLowerArm: ['leftforearm', 'leftlowerarm', 'lowerarm_l', 'lowerarm_l_25', 'mixamorigleftforearm', 'j_bip_l_lowerarm'],
  rightLowerArm: ['rightforearm', 'rightlowerarm', 'lowerarm_r', 'lowerarm_r_58', 'mixamorigrightforearm', 'j_bip_r_lowerarm'],
  leftUpperLeg: ['leftupleg', 'leftthigh', 'leftupperleg', 'thigh_l', 'thigh_l_163', 'thigh_l_171', 'mixamorigleftupleg', 'j_bip_l_upperleg'],
  rightUpperLeg: ['rightupleg', 'rightthigh', 'rightupperleg', 'thigh_r', 'thigh_r_174', 'thigh_r_182', 'mixamorigrightupleg', 'j_bip_r_upperleg'],
  leftLowerLeg: ['leftleg', 'leftcalf', 'leftlowerleg', 'calf_l', 'calf_l_159', 'calf_l_167', 'mixamorigleftleg', 'j_bip_l_lowerleg'],
  rightLowerLeg: ['rightleg', 'rightcalf', 'rightlowerleg', 'calf_r', 'calf_r_170', 'calf_r_178', 'mixamorigrightleg', 'j_bip_r_lowerleg'],
};

const canvas = document.getElementById('viewer');
const statusEl = document.getElementById('status');
const poseNameEl = document.getElementById('poseName');
const poseDescriptionEl = document.getElementById('poseDescription');
const posePanelEl = document.getElementById('posePanel');
const characterListEl = document.getElementById('characterList');
const resetCameraBtn = document.getElementById('resetCameraBtn');
const tunerControlsEl = document.getElementById('tunerControls');
const viewerFrameEl = document.getElementById('viewerFrame');
const fullscreenToggleBtn = document.getElementById('fullscreenToggleBtn');
const mobileFullscreenHintEl = document.getElementById('mobileFullscreenHint');
const appTitleEl = document.getElementById('appTitle');

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(canvas.clientWidth || window.innerWidth, canvas.clientHeight || 560, false);
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#11131a');

const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
camera.position.set(0, 1.4, 7);

const controls = new OrbitControls(camera, canvas);
controls.enablePan = true;
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.screenSpacePanning = true;
controls.minDistance = 1.5;
controls.maxDistance = 20;
controls.target.set(0, 1, 0);
controls.update();

scene.add(new THREE.AmbientLight(0xffffff, 1.8));
const hemi = new THREE.HemisphereLight(0xffffff, 0x080a0f, 1.3);
scene.add(hemi);
const dir = new THREE.DirectionalLight(0xffffff, 3);
dir.position.set(4, 8, 4);
dir.castShadow = true;
scene.add(dir);
const spot = new THREE.SpotLight(0xffffff, 1.8, 0, 0.35, 0.5);
spot.position.set(-5, 8, 6);
scene.add(spot);
const grid = new THREE.GridHelper(20, 20, '#2f3544', '#202532');
grid.position.y = -2.85;
scene.add(grid);

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(10, 64),
  new THREE.MeshBasicMaterial({ color: '#141925', side: THREE.DoubleSide })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -2.9;
scene.add(floor);

const loader = new GLTFLoader();
let currentModel = null;
let hiddenModelsUnlocked = false;
let secretTapCount = 0;
let secretTapTimer = null;
let currentCharacterId = characters.find((character) => !character.hiddenByCode)?.id || characters[0].id;
let currentPoseId = 'idle';
let currentCharacter = characters.find((character) => character.id === currentCharacterId) || characters[0];
let lastFramedCenter = new THREE.Vector3(0, 1, 0);
let lastCameraOffset = new THREE.Vector3(0, 1.2, 6.5);
let liveTweaks = {};
const originalBoneState = new Map();
const tunerBoneOrder = ['hips', 'spine', 'chest', 'neck', 'head', 'leftUpperArm', 'rightUpperArm', 'leftLowerArm', 'rightLowerArm', 'leftUpperLeg', 'rightUpperLeg', 'leftLowerLeg', 'rightLowerLeg'];

function normalize(name) {
  return (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function findBone(root, aliases) {
  const aliasSet = aliases.map(normalize);
  let match = null;
  root.traverse((child) => {
    if (match || !child.isBone) return;
    if (aliasSet.includes(normalize(child.name))) match = child;
  });
  return match;
}

function prepareModel(model) {
  if (currentCharacter.modelRotation) {
    model.rotation.set(...currentCharacter.modelRotation);
  }

  model.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x || 1, size.y || 1, size.z || 1);
  const scale = 3.8 / maxDim;
  model.scale.setScalar(scale);
  model.position.set(-center.x * scale, -center.y * scale - 0.4, -center.z * scale);
  model.updateMatrixWorld(true);

  const reframedBox = new THREE.Box3().setFromObject(model);
  const reframedCenter = reframedBox.getCenter(new THREE.Vector3());
  lastFramedCenter.copy(reframedCenter);
  lastCameraOffset.set(0, 1.2, 6.5);
  controls.target.copy(reframedCenter);
  camera.position.copy(reframedCenter).add(lastCameraOffset);
  controls.update();

  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.filter(Boolean).forEach((material) => {
        material.side = THREE.DoubleSide;
        material.transparent = false;
        material.opacity = 1;
        if ('depthWrite' in material) material.depthWrite = true;
      });
    }
  });
}

function cacheOriginalBoneState(model) {
  originalBoneState.clear();
  model.traverse((child) => {
    if (!child.isBone) return;
    originalBoneState.set(child.uuid, {
      rotation: child.rotation.clone(),
      position: child.position.clone(),
    });
  });
}

function restoreOriginalBoneState(model) {
  model.traverse((child) => {
    if (!child.isBone) return;
    const original = originalBoneState.get(child.uuid);
    if (!original) return;
    child.rotation.copy(original.rotation);
    child.position.copy(original.position);
  });
}

function applySingleTweakToBone(bone, key, value) {
  if (!bone) return false;
  if (key === 'hips' && typeof value === 'object' && !Array.isArray(value)) {
    if (value.position) {
      bone.position.set(
        bone.position.x + value.position[0],
        bone.position.y + value.position[1],
        bone.position.z + value.position[2]
      );
    }
    if (value.rotation) {
      bone.rotation.x += value.rotation[0];
      bone.rotation.y += value.rotation[1];
      bone.rotation.z += value.rotation[2];
    }
    return true;
  }

  bone.rotation.x += value[0];
  bone.rotation.y += value[1];
  bone.rotation.z += value[2];
  return true;
}

function applyPose(model, poseId) {
  if (!model) return { applied: false, reason: 'No model loaded' };
  restoreOriginalBoneState(model);

  const profile = poseTweaks[currentCharacter.poseProfile] || poseTweaks['chunli-fortnite'];
  const tweaks = profile?.[poseId];
  const bones = {};
  Object.entries(boneAliases).forEach(([key, aliases]) => {
    bones[key] = findBone(model, aliases);
  });

  if (!tweaks) {
    if (currentCharacter.poseProfile === 'static' && poseId !== 'idle') {
      model.updateMatrixWorld(true);
      return { applied: false, reason: 'This model is not rigged for posing' };
    }
  }

  let appliedCount = 0;
  if (tweaks) {
    Object.entries(tweaks).forEach(([key, value]) => {
      if (applySingleTweakToBone(bones[key], key, value)) appliedCount += 1;
    });
  }

  Object.entries(liveTweaks).forEach(([key, value]) => {
    if (applySingleTweakToBone(bones[key], key, value)) appliedCount += 1;
  });

  model.updateMatrixWorld(true);
  if (appliedCount === 0 && currentCharacter.poseProfile === 'static' && poseId !== 'idle') {
    return { applied: false, reason: 'This model is not rigged for posing' };
  }
  return appliedCount > 0
    ? { applied: true, reason: `Applied ${appliedCount} bone tweaks` }
    : { applied: true, reason: 'Default pose restored' };
}

function resetCamera() {
  controls.target.copy(lastFramedCenter);
  camera.position.copy(lastFramedCenter).add(lastCameraOffset);
  controls.update();
}

function handleSecretTitleTap() {
  secretTapCount += 1;
  if (secretTapTimer) clearTimeout(secretTapTimer);

  if (secretTapCount >= 3) {
    hiddenModelsUnlocked = !hiddenModelsUnlocked;
    secretTapCount = 0;
    renderCharacterButtons();
    statusEl.textContent = hiddenModelsUnlocked ? 'Hidden models unlocked' : 'Hidden models hidden';
    return;
  }

  secretTapTimer = setTimeout(() => {
    secretTapCount = 0;
  }, 700);
}

async function toggleViewerFullscreen() {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    try {
      if (viewerFrameEl.requestFullscreen) {
        await viewerFrameEl.requestFullscreen();
      } else if (viewerFrameEl.webkitRequestFullscreen) {
        viewerFrameEl.webkitRequestFullscreen();
      } else {
        const isFullscreen = viewerFrameEl.classList.toggle('mobile-fullscreen');
        document.body.classList.toggle('viewer-fullscreen-active', isFullscreen);
      }
    } catch {
      const isFullscreen = viewerFrameEl.classList.toggle('mobile-fullscreen');
      document.body.classList.toggle('viewer-fullscreen-active', isFullscreen);
    }
  } else {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else {
        viewerFrameEl.classList.remove('mobile-fullscreen');
        document.body.classList.remove('viewer-fullscreen-active');
      }
    } catch {
      viewerFrameEl.classList.remove('mobile-fullscreen');
      document.body.classList.remove('viewer-fullscreen-active');
    }
  }

  const cssFullscreen = viewerFrameEl.classList.contains('mobile-fullscreen');
  const nativeFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
  const isFullscreen = cssFullscreen || nativeFullscreen;

  fullscreenToggleBtn.textContent = isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Viewer';
  statusEl.textContent = isFullscreen ? 'Fullscreen mode on' : 'Fullscreen mode off';
  if (mobileFullscreenHintEl) {
    mobileFullscreenHintEl.textContent = isFullscreen ? 'fullscreen-on' : 'fullscreen-off';
  }

  setTimeout(() => {
    resize();
    resetCamera();
  }, 80);
}

function getVisibleCharacters() {
  return characters.filter((character) => hiddenModelsUnlocked || !character.hiddenByCode);
}

function renderCharacterButtons() {
  characterListEl.innerHTML = '';
  getVisibleCharacters().forEach((character) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `character-chip${character.id === currentCharacterId ? ' active' : ''}`;
    button.dataset.characterId = character.id;
    button.textContent = character.name;
    button.addEventListener('click', () => loadCharacter(character));
    characterListEl.appendChild(button);
  });
}

function updateCharacterButtons() {
  [...characterListEl.querySelectorAll('.character-chip')].forEach((button) => {
    button.classList.toggle('active', button.dataset.characterId === currentCharacterId);
  });
}

function updatePoseButtons() {
  [...posePanelEl.querySelectorAll('.pose-card')].forEach((button) => {
    button.classList.toggle('active', button.dataset.poseId === currentPoseId);
  });
}

function buildTunerUI() {
  tunerControlsEl.innerHTML = '';

  tunerBoneOrder.forEach((boneKey) => {
    const group = document.createElement('div');
    group.className = 'tuner-group';
    group.innerHTML = `<strong>${boneKey}</strong>`;

    ['x', 'y', 'z'].forEach((axis, index) => {
      const row = document.createElement('div');
      row.className = 'tuner-row';
      const inputId = `tuner-${boneKey}-${axis}`;
      row.innerHTML = `
        <label for="${inputId}">${axis.toUpperCase()}</label>
        <input id="${inputId}" type="range" min="-180" max="180" step="1" value="0" />
        <span>0°</span>
      `;

      const input = row.querySelector('input');
      const valueLabel = row.querySelector('span');
      input.addEventListener('input', () => {
        const deg = Number(input.value);
        valueLabel.textContent = `${deg}°`;
        if (!liveTweaks[boneKey]) liveTweaks[boneKey] = [0, 0, 0];
        liveTweaks[boneKey][index] = THREE.MathUtils.degToRad(deg);
        if (currentModel) {
          const currentPose = poses.find((item) => item.id === currentPoseId) || poses[0];
          setPose(currentPose);
        }
      });

      group.appendChild(row);
    });

    tunerControlsEl.appendChild(group);
  });
}

function resetTunerUI() {
  liveTweaks = {};
  tunerControlsEl.querySelectorAll('input[type="range"]').forEach((input) => {
    input.value = '0';
  });
  tunerControlsEl.querySelectorAll('.tuner-row span').forEach((label) => {
    label.textContent = '0°';
  });
}

function setPose(pose) {
  currentPoseId = pose.id;
  poseNameEl.textContent = pose.name;
  poseDescriptionEl.textContent = pose.description;
  updatePoseButtons();
  statusEl.textContent = `Pose selected: ${pose.name}`;
  if (currentModel) {
    const result = applyPose(currentModel, currentPoseId);
    if (result.applied) {
      statusEl.textContent = `Pose applied: ${pose.name} (${result.reason})`;
    } else {
      statusEl.textContent = `${pose.name}: ${result.reason}`;
    }
  }
}

function loadCharacter(character) {
  currentCharacter = character;
  currentCharacterId = character.id;
  updateCharacterButtons();
  statusEl.textContent = `Loading ${character.name}…`;
  resetTunerUI();

  if (currentModel) {
    scene.remove(currentModel);
    currentModel.traverse((child) => {
      if (child.isMesh) {
        child.geometry?.dispose?.();
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.filter(Boolean).forEach((material) => material.dispose?.());
      }
    });
    currentModel = null;
  }

  loader.load(
    character.path,
    (gltf) => {
      currentModel = gltf.scene;
      prepareModel(currentModel);
      cacheOriginalBoneState(currentModel);
      scene.add(currentModel);
      setPose(poses.find((pose) => pose.id === currentPoseId) || poses[0]);
      statusEl.textContent = `${character.name} loaded.`;
    },
    undefined,
    (error) => {
      console.error(error);
      statusEl.textContent = `Model failed to load: ${error?.message || error}`;
    }
  );
}

renderCharacterButtons();

poses.forEach((pose) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `pose-card${pose.id === currentPoseId ? ' active' : ''}`;
  button.dataset.poseId = pose.id;
  button.innerHTML = `<span class="pose-name">${pose.name}</span><span class="pose-description">${pose.description}</span>`;
  button.addEventListener('click', () => setPose(pose));
  posePanelEl.appendChild(button);
});

function resize() {
  const width = canvas.clientWidth || window.innerWidth;
  const height = canvas.clientHeight || 560;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}
window.addEventListener('resize', resize);
resetCameraBtn.addEventListener('click', resetCamera);
fullscreenToggleBtn.addEventListener('click', toggleViewerFullscreen);
appTitleEl.addEventListener('click', handleSecretTitleTap);
buildTunerUI();
resize();

loadCharacter(characters[0]);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
