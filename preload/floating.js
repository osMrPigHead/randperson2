const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("randperson2", {
    show: () => ipcRenderer.invoke("floating:show"),
    window: {
        getBounds: () => ipcRenderer.invoke("floating:window:get-bounds"),
        setBounds: (x, y) => ipcRenderer.invoke("floating:window:set-bounds", x, y),
    }
});
