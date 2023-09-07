"use client";

import React, { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

function EarthPage() {
  let canvas: HTMLCanvasElement;
  useEffect(() => {
    if (canvas) return;
    let rot = 0;
    canvas = document.getElementById("canvas") as HTMLCanvasElement;

    const scene = new THREE.Scene();

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);

    const camera = new THREE.PerspectiveCamera(
      45,
      sizes.width / sizes.height,
      1,
      10000
    );
    camera.position.set(0, 0, +1000);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 球体を生成s
    const geometry = new THREE.SphereGeometry(350, 30, 30);
    // const loader = new THREE.TextureLoader();

    const material = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load("/earth.jpeg"),
    });

    const earthMesh = new THREE.Mesh(geometry, material);
    scene.add(earthMesh);

    const createStarFeild = () => {
      // 頂点情報を格納する配列
      const vertices = [];
      for (let i = 0; i < 1000; i++) {
        const x = 3000 * (Math.random() - 0.5);
        const y = 3000 * (Math.random() - 0.5);
        const z = 3000 * (Math.random() - 0.5);

        vertices.push(x, y, z);
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
      );

      const material = new THREE.PointsMaterial({
        size: 10,
        color: "0xffffff",
      });

      const mesh = new THREE.Points(geometry, material);
      scene.add(mesh);
    };

    createStarFeild();

    // 並行光源
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const tick = () => {
      rot += 0.2;
      const radian = (rot * Math.PI) / 180;
      // 角度に応じてカメラの位置を設定
      camera.position.x = 1000 * Math.sin(radian);
      camera.position.z = 1000 * Math.cos(radian);
      // 原点方向を見つめる
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      // earthMesh.rotation.y += 0.01;
      window.requestAnimationFrame(tick);
      renderer.render(scene, camera);
      controls.update();
    };

    tick();

    window.addEventListener("resize", () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(window.devicePixelRatio);
    });
  }, []);
  return <canvas id="canvas" className="scrollCanvas"></canvas>;
}

export default EarthPage;
