import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';

let win: BrowserWindow | null;

const installExtensions = async () => {
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

    return Promise.all(
        extensions.map(name => installer.default(installer[name], forceDownload))
    ).catch(console.log);
};

ipcMain.on('message', function (event, arg) {// 监听渲染进程发送的message

    console.log(arg);// prints "ping"

    event.sender.send('message', arg);// event.sender获取事件的发送者，并发送reply事件，‘pong’为发送的数据

});

const createWindow = async () => {
    if (process.env.NODE_ENV !== 'production') {
        await installExtensions();
    }
    // 启动一个渲染进程
    win = new BrowserWindow({
        width: 800, height: 600, 
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true,
        } 
    });

    if (process.env.NODE_ENV !== 'production') {
        process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1';
        win.loadURL(`http://localhost:3000`);
        win.webContents.on('did-finish-load', function () {
            win!.webContents.send('message', {count: 999}); // 主进程发送消息ping
            win!.webContents.openDevTools();
        });
    } else {
        win.loadURL(
            url.format({
                pathname: path.join(__dirname, 'index.html'),
                protocol: 'file:',
                slashes: true
            })
        );
    }

    if (process.env.NODE_ENV !== 'production') {
        // Open DevTools, see https://github.com/electron/electron/issues/12438 for why we wait for dom-ready
        win.webContents.once('dom-ready', () => {
            win!.webContents.openDevTools();
        });
    }

    win.on('closed', () => {
        win = null;
    });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
