const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("randperson2", {
    clearExcluded: () => ipcRenderer.invoke("main:clear-excluded"),
    getConfig: () => ipcRenderer.invoke("main:get-config"),
    setConfig: (config) => ipcRenderer.invoke("main:set-config", config),

    hide: () => ipcRenderer.invoke("main:hide"),
    exit: () => ipcRenderer.invoke("main:exit"),

    randperson: (number) => ipcRenderer.invoke("main:randperson", number)
});
