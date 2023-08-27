"use client";

import React, { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "../../assets/css/style.css";

function PointsPage() {
  let canvas: HTMLCanvasElement;
  useEffect(() => {
    if (canvas) return;
    canvas = document.getElementById("canvas") as HTMLCanvasElement;

    const scene = new THREE.Scene();

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(0xf1f1f1);

    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    camera.position.z = 400;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;

    // Points
    const radius = 500;
    const widthSegments = 16;
    const heightSegments = 24;
    const pointsGeometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments
    );
    const material = new THREE.PointsMaterial({
      color: "red",
      size: 12, // in world units
    });
    const points = new THREE.Points(pointsGeometry, material);
    scene.add(points);

    // lerp 線形補間:滑らかに動かすもの
    function lerp(x: number, y: number, a: number) {
      return (1 - a) * x + a * y;
    }

    // スクロール率で開始、終了
    // 線形補間のaに値に相当する
    function scaleParcent(start: number, end: number) {
      return (scrollPercent - start) / (end - start);
    }

    // スクロールアニメーション関数の定義
    const animationScripts: {
      start: number;
      end: number;
      function: (() => void) | (() => void) | (() => void) | (() => void);
    }[] = [];

    // アニメーション関数開始
    animationScripts.push({
      start: 0,
      end: 40,
      function() {
        camera.lookAt(points.position);
        camera.position.set(0, 0, 0);
        //boxMesh.position.set(0, 0.5, "-15");の初期値をlerpに入れる
        // このアニメーションは、0％〜40％の挙動
        points.position.z = lerp(500, 1000, scaleParcent(0, 40));
      },
    });

    animationScripts.push({
      start: 40,
      end: 60,
      function() {
        camera.lookAt(points.position);
        camera.position.z = lerp(1000, 800, scaleParcent(60, 80));
        camera.position.x = lerp(0, 800, scaleParcent(60, 80));
        camera.position.y = lerp(0, 1200, scaleParcent(60, 80));
      },
    });

    // スクロールアニメーション開始
    function playScollAnimation() {
      animationScripts.forEach((animation) => {
        if (scrollPercent >= animation.start && scrollPercent < animation.end) {
          animation.function();
        }
      });
    }
    let scrollPercent = 0;

    document.body.onscroll = () => {
      //現在のスクロールの進捗をパーセントで計算する
      scrollPercent =
        (document.documentElement.scrollTop /
          (document.documentElement.scrollHeight -
            document.documentElement.clientHeight)) *
        100;
      console.log(document.documentElement.scrollTop); //一番上からの距離
      console.log(document.documentElement.scrollHeight); //5029
      console.log(document.documentElement.clientHeight); //927
      console.log(scrollPercent); //0~100%で取得
    };

    const tick = () => {
      window.requestAnimationFrame(tick);
      points.rotation.y += 0.01;
      controls.update();
      playScollAnimation();
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
  return (
    <div className="points-scrollWrap">
      <canvas id="canvas" className="scrollCanvas"></canvas>

      <span id="scrollProgress"></span>
      <div className="scrollContent">
        <h1>3Dスクロールアニメーション</h1>
        <section>
          <h2>スクロールを開始してください</h2>
        </section>
        <section>
          <h2>オブジェクトの位置が変わります</h2>
          <p>ボックスの位置が変わっています</p>
        </section>
        <section>
          <h2>オブジェクトの位置が変わります</h2>
          <p>ボックスの位置が変わっています</p>
        </section>
        <section>
          <h2>オブジェクトの位置が変わります</h2>
          <p>カメラの位置が変わっています</p>
        </section>

        <section>
          <h2>一番下にいます</h2>
          <p>立方体が自動回転しています</p>
          <p>上にスクロールしてアニメーションを反転できます</p>
        </section>
      </div>
    </div>
  );
}

export default PointsPage;
