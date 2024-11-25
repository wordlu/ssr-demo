"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pointcloud_simulation_1 = require("./pointcloud-simulation");
const app = (0, express_1.default)();
const PORT = 3000;
// 配置 CORS
app.use((0, cors_1.default)());
app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    const sendImage = () => __awaiter(void 0, void 0, void 0, function* () {
        const imageBuffer = (0, pointcloud_simulation_1.renderPointCloudImage)();
        const dataBuffer = yield imageBuffer;
        // res.write(`data: ${dataBuffer.toString('base64')}\n\n`);
        const base64Image = dataBuffer.toString('base64');
        res.write(`data:${base64Image}\n\n`);
    });
    const interval = setInterval(sendImage, 200);
    req.on('close', () => {
        clearInterval(interval);
        res.end();
    });
});
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
