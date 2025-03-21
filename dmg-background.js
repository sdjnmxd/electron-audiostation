const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

async function createDmgBackground() {
    // 创建画布
    const canvas = createCanvas(540, 380);
    const ctx = canvas.getContext('2d');

    // 设置背景
    ctx.fillStyle = '#F5F5F5';
    ctx.fillRect(0, 0, 540, 380);

    // 添加标题
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'center';
    ctx.fillText('Electron AudioStation', 270, 80);

    // 添加安装说明
    ctx.font = '16px Arial';
    ctx.fillStyle = '#666666';
    ctx.fillText('Drag to Applications folder to install', 270, 120);

    // 绘制箭头
    ctx.beginPath();
    ctx.moveTo(180, 180);
    ctx.lineTo(360, 180);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#007AFF';
    ctx.stroke();

    // 绘制箭头头部
    ctx.beginPath();
    ctx.moveTo(350, 170);
    ctx.lineTo(360, 180);
    ctx.lineTo(350, 190);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#007AFF';
    ctx.stroke();

    // 确保 assets 目录存在
    const assetsDir = path.join(__dirname, 'assets');
    if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
    }

    // 保存图片
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(assetsDir, 'dmg-background.png'), buffer);

    console.log('DMG 背景图片已生成：assets/dmg-background.png');
}

createDmgBackground().catch(console.error);