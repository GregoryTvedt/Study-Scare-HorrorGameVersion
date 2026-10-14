const { contextBridge, ContextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('electronAPI', {
    startTransparent: () => ipcRenderer.send('start-transparent')
});