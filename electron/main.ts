import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import axios, { AxiosRequestConfig } from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexHtml = path.join(__dirname, '../dist/index.html');
const createWindow = async () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 600,
        minWidth: 1000,
        minHeight: 600,
        frame: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        },
    });

    Menu.setApplicationMenu(null);

    if (process.env.VITE_DEV_SERVER_URL) {
        await win.loadURL(process.env.VITE_DEV_SERVER_URL);
        win.webContents.openDevTools();
    } else {
        await win.loadFile(indexHtml);
    }
};

// IPC 代理请求（避开浏览器同源策略）
ipcMain.handle('api-request', async (event, config: AxiosRequestConfig) => {
    const instance = axios.create({
        baseURL: 'http://localhost:8080',
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
            ...config.headers,
        },
    });
    const response = await instance.request(config);
    return response.data;
});


app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
