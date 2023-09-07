"use client";
import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

function BoxPage() {
  let canvas: HTMLCanvasElement;

  // useEffectフックを使用してコンポーネントがマウントされた際に呼ばれる処理を定義します
  useEffect(() => {
    // canvasが既に存在する場合は処理をスキップします
    if (canvas) return;

    // canvas要素を取得します
    canvas = document.getElementById("canvas") as HTMLCanvasElement;

    // シーンの作成
    const scene = new THREE.Scene();

    // ウィンドウのサイズを取得します
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // カメラの作成
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height, // アスペクト比をウィンドウのアスペクト比に設定
      1,
      1000
    );
    camera.position.set(10, 0, 0); // カメラの位置を設定

    // レンダラーの作成
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    renderer.setSize(sizes.width, sizes.height); // レンダラーのサイズを設定

    // カメラのコントロールを設定
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // ボックスの数と位置の設定
    let boxCount = 500; // ボックスの数
    let range = [-100, 100]; // 位置の範囲
    let v3Array: string[] = [];
    let counter = 0;
    let v3 = new THREE.Vector3();
    while (counter < boxCount) {
      let v3 = [
        THREE.MathUtils.randInt(range[0], range[1]).toFixed(0),
        THREE.MathUtils.randInt(range[0], range[1]).toFixed(0),
        THREE.MathUtils.randInt(range[0], range[1]).toFixed(0),
      ].join("|");
      if (!v3Array.includes(v3)) {
        v3Array.push(v3);
        counter++;
      }
    }

    // ボックスを作成してシーンに追加
    v3Array.map((p) => {
      let o = new THREE.Mesh(
        new THREE.BoxGeometry(),
        new THREE.MeshBasicMaterial({
          color: Math.random() * 0xffffff,
        })
      );
      let pos = p.split("|").map((c) => {
        return parseInt(c);
      });
      o.position.set(pos[0], pos[1], pos[2]);
      scene.add(o);
    });

    // ボックス範囲を示すヘルパーを作成してシーンに追加
    let boxHelper = new THREE.Box3Helper(
      new THREE.Box3(
        new THREE.Vector3().setScalar(range[0] - 0.5),
        new THREE.Vector3().setScalar(range[1] + 0.5)
      )
    );
    scene.add(boxHelper);

    // レンダリングループを設定
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    // ウィンドウリサイズ時の処理を追加
    window.addEventListener("resize", () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(window.devicePixelRatio);
    });

    // useEffectの第2引数に空の配列を渡すことで、コンポーネントのアンマウント時にクリーンアップが行われるようになります
  }, []);

  return <canvas id="canvas"></canvas>;
}

export default BoxPage;
