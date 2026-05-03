import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Html, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const poseTweaks = {
  idle: {
    hips: { position: [0, -1.8, 0], rotation: [0, 0, 0] },
    spine: [0.05, 0, 0],
    leftUpperArm: [0.18, 0, -0.12],
    rightUpperArm: [0.18, 0, 0.12],
    leftUpperLeg: [-0.05, 0, 0],
    rightUpperLeg: [-0.05, 0, 0],
  },
  sitting: {
    hips: { position: [0, -2.45, 0.15], rotation: [0.08, 0, 0] },
    spine: [0.25, 0, 0],
    leftUpperArm: [0.25, 0, -0.08],
    rightUpperArm: [0.25, 0, 0.08],
    leftUpperLeg: [-1.35, -0.08, -0.06],
    rightUpperLeg: [-1.35, 0.08, 0.06],
    leftLowerLeg: [1.35, 0, 0],
    rightLowerLeg: [1.35, 0, 0],
  },
  'bent-over': {
    hips: { position: [0, -1.92, 0], rotation: [0.08, 0, 0] },
    spine: [0.9, 0, 0],
    chest: [0.28, 0, 0],
    neck: [-0.38, 0, 0],
    head: [-0.25, 0, 0],
    leftUpperLeg: [-0.35, 0, 0],
    rightUpperLeg: [-0.35, 0, 0],
    leftLowerArm: [-0.22, 0, -0.15],
    rightLowerArm: [-0.22, 0, 0.15],
  },
  'mid-air-jump': {
    hips: { position: [0, -1.15, 0], rotation: [0, 0, 0] },
    spine: [-0.12, 0, 0],
    chest: [-0.08, 0, 0],
    leftUpperArm: [-1.35, 0, -0.35],
    rightUpperArm: [-0.95, 0, 0.45],
    leftLowerArm: [-0.25, 0, -0.1],
    rightLowerArm: [-0.6, 0, 0.2],
    leftUpperLeg: [0.95, 0.22, -0.15],
    rightUpperLeg: [-0.85, -0.18, 0.12],
    leftLowerLeg: [0.45, 0, 0],
    rightLowerLeg: [1.15, 0, 0],
  },
  laying: {
    hips: { position: [0, -2.65, 0], rotation: [0, 0, 1.57] },
    spine: [0.05, 0, 0],
    chest: [0.02, 0, 0],
    head: [0, 0, -0.15],
    leftUpperArm: [0.12, 0, -0.3],
    rightUpperArm: [0.12, 0, 0.3],
    leftUpperLeg: [0.06, 0, 0],
    rightUpperLeg: [0.02, 0, 0],
  },
};

const boneAliases = {
  hips: ['hips', 'pelvis', 'root', 'mixamorigHips', 'j_bip_c_hips', 'rootjoint'],
  spine: ['spine', 'mixamorigSpine', 'j_bip_c_spine'],
  chest: ['chest', 'upperchest', 'spine1', 'spine2', 'mixamorigSpine1', 'mixamorigSpine2'],
  neck: ['neck', 'mixamorigNeck', 'j_bip_c_neck'],
  head: ['head', 'mixamorigHead', 'j_bip_c_head'],
  leftUpperArm: ['leftarm', 'leftupperarm', 'mixamorigLeftArm', 'j_bip_l_upperarm'],
  rightUpperArm: ['rightarm', 'rightupperarm', 'mixamorigRightArm', 'j_bip_r_upperarm'],
  leftLowerArm: ['leftforearm', 'leftlowerarm', 'mixamorigLeftForeArm', 'j_bip_l_lowerarm'],
  rightLowerArm: ['rightforearm', 'rightlowerarm', 'mixamorigRightForeArm', 'j_bip_r_lowerarm'],
  leftUpperLeg: ['leftupleg', 'leftthigh', 'leftupperleg', 'mixamorigLeftUpLeg', 'j_bip_l_upperleg'],
  rightUpperLeg: ['rightupleg', 'rightthigh', 'rightupperleg', 'mixamorigRightUpLeg', 'j_bip_r_upperleg'],
  leftLowerLeg: ['leftleg', 'leftcalf', 'leftlowerleg', 'mixamorigLeftLeg', 'j_bip_l_lowerleg'],
  rightLowerLeg: ['rightleg', 'rightcalf', 'rightlowerleg', 'mixamorigRightLeg', 'j_bip_r_lowerleg'],
};

function normalize(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function findBone(root, aliases) {
  const aliasSet = aliases.map(normalize);
  let match = null;
  root.traverse((child) => {
    if (match || !child.isBone) return;
    const childName = normalize(child.name);
    if (aliasSet.includes(childName)) {
      match = child;
    }
  });
  return match;
}

function prepareModel(model) {
  model.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x || 1, size.y || 1, size.z || 1);
  const scale = 3.8 / maxDim;

  model.scale.setScalar(scale);
  model.position.set(-center.x * scale, -center.y * scale - 0.4, -center.z * scale);
  model.updateMatrixWorld(true);

  const meshNames = [];
  let meshCount = 0;
  model.traverse((child) => {
    if (child.isMesh) {
      meshCount += 1;
      if (meshNames.length < 8) meshNames.push(child.name || '(unnamed mesh)');
      child.castShadow = true;
      child.receiveShadow = true;
      if (Array.isArray(child.material)) {
        child.material.forEach((material) => {
          material.side = THREE.DoubleSide;
          material.transparent = false;
          material.opacity = 1;
          if ('depthWrite' in material) material.depthWrite = true;
          if ('color' in material && material.color) material.color.convertSRGBToLinear?.();
        });
      } else if (child.material) {
        child.material.side = THREE.DoubleSide;
        child.material.transparent = false;
        child.material.opacity = 1;
        if ('depthWrite' in child.material) child.material.depthWrite = true;
        if ('color' in child.material && child.material.color) child.material.color.convertSRGBToLinear?.();
      }
    }
  });

  return {
    box,
    size,
    center,
    scale,
    meshCount,
    meshNames,
  };
}

function applyPose(scene, poseId) {
  if (!scene) return;

  const tweaks = poseTweaks[poseId] ?? poseTweaks.idle;
  const bones = {};

  Object.entries(boneAliases).forEach(([key, aliases]) => {
    bones[key] = findBone(scene, aliases);
  });

  scene.traverse((child) => {
    if (child.isBone) {
      child.rotation.set(0, 0, 0);
    }
  });

  Object.entries(tweaks).forEach(([key, value]) => {
    const bone = bones[key];
    if (!bone) return;

    if (key === 'hips' && value.position) {
      bone.position.set(...value.position);
      bone.rotation.set(...value.rotation);
      return;
    }

    bone.rotation.set(...value);
  });
}

function Model({ modelPath, poseId, onDebug }) {
  const { scene } = useGLTF(modelPath);
  const [loadError, setLoadError] = useState(null);

  const model = useMemo(() => {
    try {
      const cloned = scene.clone(true);
      const debugInfo = prepareModel(cloned);
      onDebug?.({ ok: true, ...debugInfo });
      return cloned;
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : String(error));
      onDebug?.({ ok: false, error: error instanceof Error ? error.message : String(error) });
      return null;
    }
  }, [scene, onDebug]);

  const groupRef = useRef();

  useEffect(() => {
    if (!groupRef.current) return;
    applyPose(groupRef.current, poseId);
  }, [model, poseId]);

  if (loadError || !model) {
    return (
      <Html center>
        <div className="debug-html">Model failed: {loadError ?? 'unknown error'}</div>
      </Html>
    );
  }

  return <primitive ref={groupRef} object={model} />;
}

function DebugOverlay({ debug }) {
  if (!debug) return <div className="debug-panel">Loading model…</div>;
  if (!debug.ok) return <div className="debug-panel error">Model error: {debug.error}</div>;

  const { size, center, scale, meshCount, meshNames } = debug;
  return (
    <div className="debug-panel">
      <div><strong>Debug</strong></div>
      <div>meshes: {meshCount}</div>
      <div>size: {size.x.toFixed(2)} × {size.y.toFixed(2)} × {size.z.toFixed(2)}</div>
      <div>center: {center.x.toFixed(2)}, {center.y.toFixed(2)}, {center.z.toFixed(2)}</div>
      <div>scale: {scale.toFixed(3)}</div>
      <div>sample meshes: {meshNames.join(', ')}</div>
    </div>
  );
}

export default function CharacterViewer({ character, pose }) {
  const [debug, setDebug] = useState(null);

  return (
    <div className="viewer-frame">
      <Canvas camera={{ position: [0, 1.4, 7], fov: 34 }} shadows>
        <color attach="background" args={['#11131a']} />
        <ambientLight intensity={1.8} />
        <hemisphereLight intensity={1.3} groundColor="#080a0f" />
        <directionalLight position={[4, 8, 4]} intensity={3} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
        <spotLight position={[-5, 8, 6]} intensity={1.8} angle={0.35} penumbra={0.5} />

        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.25, 0.25, 0.25]} />
          <meshStandardMaterial color="#ff4d6d" emissive="#44111d" />
        </mesh>

        <Suspense fallback={null}>
          <group rotation={[0, Math.PI, 0]}>
            <Model modelPath={character.modelPath} poseId={pose.id} onDebug={setDebug} />
          </group>
          <Environment preset="city" />
        </Suspense>

        <axesHelper args={[2]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.9, 0]} receiveShadow>
          <circleGeometry args={[10, 64]} />
          <shadowMaterial opacity={0.35} />
        </mesh>
        <gridHelper args={[20, 20, '#2f3544', '#202532']} position={[0, -2.85, 0]} />
        <OrbitControls enablePan={false} minDistance={3.5} maxDistance={10} target={[0, -0.1, 0]} />
      </Canvas>
      <div className="viewer-overlay">
        <span className="viewer-badge">Loaded model</span>
        <strong>{character.name}</strong>
      </div>
      <DebugOverlay debug={debug} />
    </div>
  );
}

useGLTF.preload('/models/chunli.glb');
