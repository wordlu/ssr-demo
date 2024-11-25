// import { createCanvas } from 'canvas';
// import Jimp from "jimp"
// import * as Jimp from 'jimp';

import { JSDOM } from "jsdom"
import * as THREE from "three"
// @ts-ignore
import { loadFont } from "@jimp/plugin-print/load-font";
const { window } = new JSDOM();
global.document = window.document;
const width = 500;
const height = 500;

export function renderPointCloudImage() {
  const gl = require('gl')(width, height, {  preserveDrawingBuffer: true })
  const renderer = new THREE.WebGLRenderer({ context: gl });
  const mesh = new THREE.Mesh()
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000);
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  const material = new THREE.PointsMaterial({
    size: 0.5,
    // color: 0xff0000,
    vertexColors: true,
  });
  renderer.setSize(width, height)
  renderer.outputEncoding = THREE.sRGBEncoding
  const geometry = new THREE.BufferGeometry();
  const positions: number[] = [];
  const colors: number[] = [];

  // 模拟 1000 个随机点作为点云数据
  for (let i = 0; i < 100; i++) {
    positions.push(Math.random() * 50 - 20); // x
    positions.push(Math.random() * 50 - 20); // y
    positions.push(Math.random() * 10); // z

    // 随机颜色
    colors.push(Math.random()); // r
    colors.push(Math.random()); // g
    colors.push(Math.random()); // b
  }

  // 将点的位置和颜色数据添加到几何体中
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const pointCloud = new THREE.Points(geometry, material);
  pointCloud.frustumCulled = false;
  scene.add(pointCloud)

  camera.position.z = 30

  renderer.render(scene, camera)

  const bitmapData = new Uint8Array(width * height * 4)
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData)
  const Jimp: any = require('jimp');
  return new Promise<Buffer>((resolve, reject) => {
    new Jimp(width, height, (err, image) => {
      if (err) {
        reject(err);
        return;
      }
      image.bitmap.data = bitmapData;
      image.getBuffer("image/png", (err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(Buffer.from(buffer));
        }
      });
    });
  });
}
