"use client";

import React, { useEffect } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import "../assets/css/style.css";

function Font() {
  // let canvas: HTMLCanvasElement;
  useEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (canvas) return;

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
    renderer.setClearColor(0xf1f1f1);

    // カメラ -- 視点 -- //
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    camera.position.z = 30;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;

    // フォントローダー
    const fontLoader = new FontLoader();
    fontLoader.load("/fonts/cherry_bomb_one_regular.json", (font) => {
      const textGeometry = new TextGeometry("デモサイトのFVだよぉ〜", {
        font: font,
        size: 1.2,
        height: 0.4,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      });
      textGeometry.center();

      const textMaterial = new THREE.MeshBasicMaterial({
        color: 0x000,
      });
      const text = new THREE.Mesh(textGeometry, textMaterial);
      text.castShadow = true;
      text.position.z = 10;
      scene.add(text);
    });

    const tick = () => {
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

export default Font;
