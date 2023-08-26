"use client";
import React, { useEffect } from "react";
import * as THREE from "three";
import "../assets/css/style.css";

function ScrollAnimation() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  useEffect(() => {
    if (canvas) return;

    //  scene
    const scene = new THREE.Scene();

    const sizes = {
      width: innerWidth,
      height: innerHeight,
    };

    // renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    // レンダリングした時のサイズ
    renderer.setSize(sizes.width, sizes.height);
    // デバイスの画面サイズに合わせる
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xf1f1f1);

    // camera
    const camera = new THREE.PerspectiveCamera(
      75,
      innerWidth / innerHeight,
      0.1,
      1000
    );
    // カメラの位置（z：奥行き）
    camera.position.z = 10;
    // cameraの設定をsceneに追加
    scene.add(camera);

    // girdの生成
    const gridHleper = new THREE.GridHelper(30, 30);
    // gridHleperの設定をsceneに追加
    scene.add(gridHleper);

    // boxの生成
    const boxGeometry = new THREE.BoxGeometry(5, 5, 5, 10);
    // boxの詳細設定
    const boxMaterial = new THREE.MeshNormalMaterial();
    // Meshの生成（ジオメトリ：ここではbox）
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    // boxの角度調整
    boxMesh.position.set(0, 0.5, -15);
    boxMesh.rotation.set(1, 1, 0);
    // boxMeshの設定をsceneに追加
    scene.add(boxMesh);

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
        camera.lookAt(boxMesh.position);
        camera.position.set(0, 1, 10);
        //boxMesh.position.set(0, 0.5, "-15");の初期値をlerpに入れる
        // このアニメーションは、0％〜40％の挙動
        boxMesh.position.z = lerp(-15, 2, scaleParcent(0, 40));
      },
    });

    // このアニメーションは、40％〜60％の挙動
    animationScripts.push({
      start: 40,
      end: 60,
      function() {
        camera.lookAt(boxMesh.position);
        camera.position.set(0, 1, 10);
        boxMesh.rotation.z = lerp(0, Math.PI, scaleParcent(40, 60));
      },
    });

    // このアニメーションは、60％〜80％の挙動
    animationScripts.push({
      start: 60,
      end: 80,
      function() {
        camera.lookAt(boxMesh.position);
        // スクロール毎にカメラの位置が変わる。だんだん変わる。
        camera.position.x = lerp(0, 10, scaleParcent(60, 80));
        camera.position.y = lerp(1, 12, scaleParcent(60, 80));
        camera.position.z = lerp(10, 20, scaleParcent(60, 80));
      },
    });

    // このアニメーションは、80％〜101％の挙動
    animationScripts.push({
      start: 80,
      end: 101,
      function() {
        camera.lookAt(boxMesh.position);
        // 自動で動かす
        boxMesh.rotation.x += 0.02;
        boxMesh.rotation.y += 0.02;
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

    // animation用レンダリング関数
    const animate = () => {
      window.requestAnimationFrame(animate);
      playScollAnimation();
      renderer.render(scene, camera);
    };

    animate();

    // 画面サイズに合わせて描画
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
    <div className="font-loader-scrollWrap">
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

export default ScrollAnimation;
