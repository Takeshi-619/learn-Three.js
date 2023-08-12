"use client";
import React, { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "../../assets/css/style.css";

function BoxPage() {
  let canvas: HTMLCanvasElement;
  useEffect(() => {
    if (canvas) return;
    canvas = document.getElementById("canvas") as HTMLCanvasElement;

    // シーン -- 描画のためのフィールド -- //
    const scene = new THREE.Scene();

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // レンダラー -- 描画するためのレンダリング -- //
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    // カメラ -- 視点 -- //
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    camera.position.z = 3;

    const controls = new OrbitControls(camera, renderer.domElement);

    // box -- boxの詳細設定 -- //
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1); //boxの生成
    const boxEdges = new THREE.EdgesGeometry(boxGeometry); //枠線の生成
    const boxLineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff }); //枠線の詳細（ここでは色のみ）
    const boxFrame = new THREE.LineSegments(boxEdges, boxLineMaterial); //枠線をboxに追加
    scene.add(boxFrame); //シーンに追加（これで描画される）
    // 絵文字のテクスチャを読み込む
    const emojiTexture = new THREE.TextureLoader().load("/logo.png"); // 絵文字の画像ファイルを指定

    const boxMaterial = new THREE.MeshBasicMaterial({
      map: emojiTexture,
    });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    scene.add(box);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.2);
    pointLight.position.set(0, 300, 200);
    scene.add(pointLight);

    const clock = new THREE.Clock();
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      box.rotation.x = elapsedTime;
      box.rotation.y = elapsedTime;
      boxFrame.rotation.x = elapsedTime;
      boxFrame.rotation.y = elapsedTime;
      window.requestAnimationFrame(tick);
      controls.update();
      renderer.render(scene, camera);
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

  return <canvas id="canvas"></canvas>;
}

export default BoxPage;
