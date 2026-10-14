import {app, BrowserWindow, screen, ipcMain, globalShortcut} from 'electron'
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 650,
    transparent: false,
    resizable: false,
    fullscreenable: false,
    maximizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile(path.join(__dirname, '../../src/main/main.html'))
}
  const createTransparentWindow = () => {
    const primaryDisplay = screen.getPrimaryDisplay();
    const {width, height} = primaryDisplay.bounds;

    const win = new BrowserWindow({
      width: width,
      height: height,
      x: 0,
      y: 0,
      resizable: false,
      transparent: true,
      frame: false,
      alwaysOnTop: true,
      hasShadow: false,
      fullscreen: true,
      skipTaskbar: true
    });
    win.setIgnoreMouseEvents(true);
    win.setBackgroundColor('#00000000');
    win.loadFile(path.join(__dirname, '../../src/renderer/index.html'));
  }

ipcMain.on('start-transparent', (event) => {
  const mainWindow = BrowserWindow.fromWebContents(event.sender);

  createTransparentWindow();

  mainWindow?.close();
})


app.whenReady().then(() => {
  createWindow();
  
  globalShortcut.register('CommandOrControl+Shift+Q', () => {
    app.quit();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

})

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
})