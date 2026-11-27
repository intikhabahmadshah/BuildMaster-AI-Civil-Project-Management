import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Layers, RotateCw, Activity, ShieldCheck } from 'lucide-react';

export default function ThreeCanvas({ currentMode = 'blueprint', setViewMode }) {
  const mountRef = useRef(null);
  const [mode, setMode] = useState(currentMode);
  const [isRotating, setIsRotating] = useState(true);
  const [telemetry, setTelemetry] = useState({
    craneHeight: '48.5 m',
    jibRadius: '32.0 m',
    hookLoad: '4.8 tons (C30 Bucket)',
    windSpeed: '12 km/h (Safe)'
  });

  useEffect(() => {
    setMode(currentMode);
  }, [currentMode]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Scene, Camera, Renderer (Daylight Architectural Studio)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf1f5f9);
    scene.fog = new THREE.FogExp2(0xf1f5f9, 0.012);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(38, 30, 48);
    camera.lookAt(0, 15, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    // Daylight Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(35, 55, 25);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 0.8);
    fillLight.position.set(-25, 30, -20);
    scene.add(fillLight);

    // Architectural Ground Grid
    const gridHelper = new THREE.GridHelper(60, 30, 0x0284c7, 0xcbd5e1);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Groups
    const buildingGroup = new THREE.Group();
    const craneGroup = new THREE.Group();
    scene.add(buildingGroup);
    scene.add(craneGroup);

    // Skyscraper Dimensions
    const floorCount = 8;
    const buildingWidth = 14;
    const buildingDepth = 14;
    const floorHeight = 3.6;

    // Materials dictionary for Light Mode
    const materials = {
      blueprint: {
        concrete: new THREE.MeshBasicMaterial({ color: 0x0284c7, wireframe: true }),
        column: new THREE.MeshBasicMaterial({ color: 0x0369a1, wireframe: true }),
        crane: new THREE.MeshBasicMaterial({ color: 0xd97706, wireframe: true }),
        cable: new THREE.LineBasicMaterial({ color: 0x0284c7 })
      },
      stress: {
        concrete: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.8 }),
        columnHigh: new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3 }), // Base columns (high load - red)
        columnMed: new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 }),  // Mid columns (amber)
        columnLow: new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.3 }),  // Top columns (green)
        crane: new THREE.MeshStandardMaterial({ color: 0xd97706 }),
        cable: new THREE.LineBasicMaterial({ color: 0x475569 })
      },
      realistic: {
        concrete: new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8, metalness: 0.1 }),
        column: new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.7 }),
        crane: new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.3, roughness: 0.4 }),
        cable: new THREE.LineBasicMaterial({ color: 0x475569 })
      }
    };

    // Build Structural Slabs and Columns
    for (let f = 0; f < floorCount; f++) {
      const y = f * floorHeight;
      const slabGeo = new THREE.BoxGeometry(buildingWidth, 0.4, buildingDepth);
      const slabMat = mode === 'stress' ? materials.stress.concrete : 
                      mode === 'realistic' ? materials.realistic.concrete : materials.blueprint.concrete;
      const slab = new THREE.Mesh(slabGeo, slabMat);
      slab.position.set(-8, y + 0.2, 0);
      buildingGroup.add(slab);

      // 4 Main Columns + Core column
      const colHeight = floorHeight - 0.4;
      const colGeo = new THREE.BoxGeometry(0.8, colHeight, 0.8);
      const colPositions = [
        [-8 - 5.5, y + 0.2 + colHeight / 2, -5.5],
        [-8 + 5.5, y + 0.2 + colHeight / 2, -5.5],
        [-8 - 5.5, y + 0.2 + colHeight / 2, 5.5],
        [-8 + 5.5, y + 0.2 + colHeight / 2, 5.5],
        [-8, y + 0.2 + colHeight / 2, 0]
      ];

      colPositions.forEach((pos) => {
        let colMat;
        if (mode === 'stress') {
          colMat = f < 2 ? materials.stress.columnHigh : f < 5 ? materials.stress.columnMed : materials.stress.columnLow;
        } else if (mode === 'realistic') {
          colMat = materials.realistic.column;
        } else {
          colMat = materials.blueprint.column;
        }
        const col = new THREE.Mesh(colGeo, colMat);
        col.position.set(pos[0], pos[1], pos[2]);
        buildingGroup.add(col);
      });
    }

    // Tower Crane Construction
    craneGroup.position.set(10, 0, -4);
    const mastHeight = 40;
    const mastGeo = new THREE.BoxGeometry(1.6, mastHeight, 1.6);
    const craneMat = mode === 'blueprint' ? materials.blueprint.crane : 
                     mode === 'realistic' ? materials.realistic.crane : materials.stress.crane;
    const mastMesh = new THREE.Mesh(mastGeo, craneMat);
    mastMesh.position.y = mastHeight / 2;
    craneGroup.add(mastMesh);

    // Slewing Cabin
    const cabinGeo = new THREE.BoxGeometry(2, 2.2, 2);
    const cabin = new THREE.Mesh(cabinGeo, craneMat);
    cabin.position.set(0, mastHeight + 1.1, 0);
    craneGroup.add(cabin);

    // Rotating Jib Group
    const jibGroup = new THREE.Group();
    jibGroup.position.set(0, mastHeight + 2.2, 0);
    craneGroup.add(jibGroup);

    // Working Jib
    const jibLength = 32;
    const jibGeo = new THREE.BoxGeometry(1.2, 1.2, jibLength);
    const jibMesh = new THREE.Mesh(jibGeo, craneMat);
    jibMesh.position.set(0, 0, jibLength / 2 - 4);
    jibGroup.add(jibMesh);

    // Counter Jib
    const counterJibLength = 12;
    const counterJibGeo = new THREE.BoxGeometry(1.4, 1.4, counterJibLength);
    const counterJibMesh = new THREE.Mesh(counterJibGeo, craneMat);
    counterJibMesh.position.set(0, 0, -counterJibLength / 2);
    jibGroup.add(counterJibMesh);

    // Counterweights
    const weightGeo = new THREE.BoxGeometry(2.4, 2, 3);
    const weightMesh = new THREE.Mesh(weightGeo, craneMat);
    weightMesh.position.set(0, -0.5, -counterJibLength + 2);
    jibGroup.add(weightMesh);

    // Trolley & Cable & Hook
    const trolleyGeo = new THREE.BoxGeometry(1.4, 0.6, 1.4);
    const trolley = new THREE.Mesh(trolleyGeo, craneMat);
    trolley.position.set(0, -0.6, 16);
    jibGroup.add(trolley);

    const hookLineGeo = new THREE.CylinderGeometry(0.05, 0.05, 12);
    const hookLine = new THREE.Mesh(hookLineGeo, materials.blueprint.cable);
    hookLine.position.set(0, -6.6, 16);
    jibGroup.add(hookLine);

    const bucketGeo = new THREE.CylinderGeometry(0.8, 0.6, 1.4, 8);
    const bucket = new THREE.Mesh(bucketGeo, craneMat);
    bucket.position.set(0, -12.6, 16);
    jibGroup.add(bucket);

    // Mouse Interaction
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let cameraAngle = Math.PI / 4;
    let cameraRadius = 60;
    let cameraHeight = 32;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      prevMousePos = { x: e.clientX, y: e.clientY };

      cameraAngle -= deltaX * 0.008;
      cameraHeight = Math.max(10, Math.min(60, cameraHeight + deltaY * 0.15));

      camera.position.x = Math.sin(cameraAngle) * cameraRadius;
      camera.position.z = Math.cos(cameraAngle) * cameraRadius;
      camera.position.y = cameraHeight;
      camera.lookAt(0, 15, 0);
    };

    const onMouseUp = () => { isDragging = false; };

    const onWheel = (e) => {
      e.preventDefault();
      cameraRadius = Math.max(25, Math.min(100, cameraRadius + e.deltaY * 0.05));
      camera.position.x = Math.sin(cameraAngle) * cameraRadius;
      camera.position.z = Math.cos(cameraAngle) * cameraRadius;
      camera.lookAt(0, 15, 0);
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (jibGroup) {
        jibGroup.rotation.y = Math.sin(elapsedTime * 0.3) * 0.8 + 0.3;
      }
      if (bucket) {
        bucket.position.x = Math.sin(elapsedTime * 1.2) * 0.15;
      }

      if (isRotating && !isDragging) {
        cameraAngle += 0.0015;
        camera.position.x = Math.sin(cameraAngle) * cameraRadius;
        camera.position.z = Math.cos(cameraAngle) * cameraRadius;
        camera.lookAt(0, 15, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [mode, isRotating]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (setViewMode) setViewMode(newMode);
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl border border-slate-200 bg-[#f1f5f9] shadow-lg shadow-slate-200/50">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Viewport Overlay: Engineering Controls */}
      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 z-10">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md border border-slate-200 text-xs font-mono text-sky-700 shadow-sm font-semibold">
          <Activity className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
          <span>3D BIM / SITE TWIN</span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg p-0.5 text-xs shadow-sm">
          <button
            onClick={() => handleModeChange('blueprint')}
            className={`px-2.5 py-1 rounded transition-all font-mono font-medium ${
              mode === 'blueprint'
                ? 'bg-sky-100 text-sky-800 border border-sky-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Blueprint CAD
          </button>
          <button
            onClick={() => handleModeChange('stress')}
            className={`px-2.5 py-1 rounded transition-all font-mono font-medium ${
              mode === 'stress'
                ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Stress FEA
          </button>
          <button
            onClick={() => handleModeChange('realistic')}
            className={`px-2.5 py-1 rounded transition-all font-mono font-medium ${
              mode === 'realistic'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Realistic
          </button>
        </div>

        {/* Orbit Toggle */}
        <button
          onClick={() => setIsRotating(!isRotating)}
          title="Toggle Turntable Rotation"
          className={`p-1.5 rounded-lg border backdrop-blur-md text-xs transition-colors shadow-sm ${
            isRotating ? 'bg-sky-50 border-sky-300 text-sky-700' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
          }`}
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
        </button>
      </div>

      {/* Floating Bottom Telemetry Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-lg bg-white/95 backdrop-blur-md border border-slate-200 text-[11px] font-mono text-slate-700 shadow-md z-10">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-slate-500">TOWER CRANE: </span>
            <span className="text-amber-700 font-bold">{telemetry.craneHeight}</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-slate-500">JIB REACH: </span>
            <span className="text-sky-700 font-bold">{telemetry.jibRadius}</span>
          </div>
          <div className="hidden md:block">
            <span className="text-slate-500">HOOK LOAD: </span>
            <span className="text-emerald-700 font-bold">{telemetry.hookLoad}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-emerald-700 font-semibold">{telemetry.windSpeed}</span>
        </div>
      </div>
    </div>
  );
}
