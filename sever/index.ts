import express from 'express';
import cors from 'cors';
import { renderPointCloudImage } from './pointcloud-simulation';

const app = express();
const PORT = 3000;

// 配置 CORS
app.use(cors());

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendImage = async () => {
    const imageBuffer = renderPointCloudImage();
    const dataBuffer = await imageBuffer
    // res.write(`data: ${dataBuffer.toString('base64')}\n\n`);
    const base64Image = dataBuffer.toString('base64')
    res.write(`data:${base64Image}\n\n`);
  };

  const interval = setInterval(sendImage, 200);

  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
