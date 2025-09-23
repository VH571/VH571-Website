"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// If you're on three r165+ you can use "three/addons/...". If you're on older versions,
// switch these to "three/examples/jsm/..." imports.
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Water } from "three/addons/objects/Water.js";
import { Sky } from "three/addons/objects/Sky.js";

type Props = {
  height?: number | string;
};

export default function OceanViewer({ height = "100%" }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- basic setup ---
    const container = containerRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      1,
      20000
    );
    camera.position.set(30, 30, 100);

    const sun = new THREE.Vector3();

    // --- water ---
    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
    const water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
        "/textures/waternormals.jpg",
        (tex) => {
          tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        }
      ),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001a33,
      distortionScale: 3.7,
      fog: scene.fog !== undefined,
    });
    water.rotation.x = -Math.PI / 2;
    scene.add(water);

    // --- sky ---
    const sky = new Sky();
    sky.scale.setScalar(10000);
    scene.add(sky);

    const skyUniforms = (sky.material as THREE.ShaderMaterial).uniforms;
    skyUniforms["turbidity"].value = 19.5;
    skyUniforms["rayleigh"].value = 1.591;
    skyUniforms["mieCoefficient"].value = 0.08;
    skyUniforms["mieDirectionalG"].value = 0.939;

    const parameters = { elevation: 0, azimuth: -72.2 };

    // PMREM env from sky
    const pmrem = new THREE.PMREMGenerator(renderer);
    const sceneEnv = new THREE.Scene();
    let renderTarget: THREE.WebGLRenderTarget | undefined;

    const updateSun = () => {
      const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
      const theta = THREE.MathUtils.degToRad(parameters.azimuth);

      sun.setFromSphericalCoords(1, phi, theta);

      skyUniforms["sunPosition"].value.copy(sun);
      (water.material as THREE.ShaderMaterial).uniforms["sunDirection"].value
        .copy(sun)
        .normalize();

      if (renderTarget) renderTarget.dispose();

      sceneEnv.add(sky);
      renderTarget = pmrem.fromScene(sceneEnv);
      scene.add(sky);

      scene.environment = renderTarget.texture;
    };

    updateSun();

    // --- demo mesh (box) ---
    const boxGeo = new THREE.BoxGeometry(30, 30, 30);
    const boxMat = new THREE.MeshStandardMaterial({ roughness: 0 });
    const mesh = new THREE.Mesh(boxGeo, boxMat);
    scene.add(mesh);

    // --- controls ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set(0, 10, 0);
    controls.minDistance = 40.0;
    controls.maxDistance = 200.0;
    controls.update();

    // --- stats ---
    const stats = new Stats();
    container.appendChild(stats.dom);

    // --- GUI ---
    const gui = new GUI();
    const folderSky = gui.addFolder("Sky");
    folderSky.add(parameters, "elevation", 0, 90, 0.1).onChange(updateSun);
    folderSky.add(parameters, "azimuth", -180, 180, 0.1).onChange(updateSun);
    folderSky.open();

    const waterUniforms = (water.material as THREE.ShaderMaterial).uniforms;
    const folderWater = gui.addFolder("Water");
    folderWater
      .add(waterUniforms.distortionScale, "value", 0, 8, 0.1)
      .name("distortionScale");
    folderWater.add(waterUniforms.size, "value", 0.1, 10, 0.1).name("size");
    folderWater.open();

    // --- resize handling ---
    const onResize = () => {
      const { clientWidth, clientHeight } = container;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };
    window.addEventListener("resize", onResize);

    // --- animate loop ---
    let stop = false;
    const animate = () => {
      if (stop) return;
      const time = performance.now() * 0.001;

      mesh.position.y = Math.sin(time) * 20 + 5;
      mesh.rotation.x = time * 0.5;
      mesh.rotation.z = time * 0.51;

      waterUniforms["time"].value += 1.0 / 60.0;

      renderer.render(scene, camera);
      stats.update();
      // use rAF to avoid implicit internal loop and simplify cleanup
      requestId = requestAnimationFrame(animate);
    };

    // prefer rAF so we can cancel; (renderer.setAnimationLoop is fine too)
    let requestId = requestAnimationFrame(animate);

    // --- cleanup ---
    return () => {
      stop = true;
      cancelAnimationFrame(requestId);
      window.removeEventListener("resize", onResize);
      gui.destroy();
      stats.dom.remove();

      controls.dispose();
      pmrem.dispose();
      if (renderTarget) renderTarget.dispose();

      waterGeometry.dispose();
      boxGeo.dispose();
      boxMat.dispose();

      renderer.dispose();
      // remove canvas
      if (renderer.domElement.parentElement === container)
        container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height,
        position: "relative",
        overflow: "hidden",
      }}
    />
  );
}
