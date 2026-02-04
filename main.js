const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 450,
        height: 750,
        webPreferences: {
            nodeIntegration: false, // Security best practice
            contextIsolation: true,
        },
        autoHideMenuBar: true,
        resizable: true,
        icon: path.join(__dirname, 'icon.png') // Note: Icon optional, will default if missing
    });

    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
