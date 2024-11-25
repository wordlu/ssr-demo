"use strict";
// import { createCanvas } from 'canvas';
// import Jimp from "jimp"
// import * as Jimp from 'jimp';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderPointCloudImage = void 0;
const jsdom_1 = require("jsdom");
const THREE = __importStar(require("three"));
const { window } = new jsdom_1.JSDOM();
global.document = window.document;
const width = 500;
const height = 500;
function renderPointCloudImage() {
    const gl = require('gl')(width, height, { preserveDrawingBuffer: true });
    const renderer = new THREE.WebGLRenderer({ context: gl });
    const mesh = new THREE.Mesh();
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    // const canvas = createCanvas(width, height);
    // const context = canvas.getContext('2d');
    const material = new THREE.PointsMaterial({
        size: 0.5,
        // color: 0xff0000,
        vertexColors: true,
    });
    renderer.setSize(width, height);
    renderer.outputEncoding = THREE.sRGBEncoding;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
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
    scene.add(pointCloud);
    camera.position.z = 30;
    renderer.render(scene, camera);
    const bitmapData = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);
    const Jimp = require('jimp');
    // new Jimp(width, height, (err: object, image: any) => {
    //   image.bitmap.data = bitmapData
    //   image.getBuffer("image/png", (err: object, buffer: Uint8Array) => {
    //     return Buffer.from(buffer)
    //   });
    // })
    return new Promise((resolve, reject) => {
        new Jimp(width, height, (err, image) => {
            if (err) {
                reject(err);
                return;
            }
            image.bitmap.data = bitmapData;
            image.getBuffer("image/png", (err, buffer) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(Buffer.from(buffer));
                }
            });
        });
    });
    // // 绘制背景
    // context.fillStyle = '#000';
    // context.fillRect(0, 0, width, height);
    // // 模拟点云数据为随机点
    // for (let i = 0; i < 1000; i++) {
    //   const x = Math.random() * width;
    //   const y = Math.random() * height;
    //   const color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    //   context.fillStyle = color;
    //   context.beginPath();
    //   context.arc(x, y, 3, 0, Math.PI * 2);
    //   context.fill();
    // }
    // 返回图片 Buffer
    // return canvas.toBuffer('image/png');
}
exports.renderPointCloudImage = renderPointCloudImage;
