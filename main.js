const { app, ipcMain } = require("electron");
const { dir_html, dir_image, dir_preload, windowBuilder } = require("./utils");
const { getConfig, setConfig, clearExcluded, randperson } = require("./api");

app.whenReady().then(() => {
    let mainWindow;
    let floatingWindow;

    let mainBounds;
    let floatingBounds;

    const buildMainWindow = windowBuilder(dir_html("main.html"), {
        width: 600,
        height: 450,
        resizable: false,
        frame: false,
        icon: dir_image("icon.ico"),
        transparent: true,
        webPreferences: {
            preload: dir_preload("main.js")
        }
    }, (win) => {
        if (mainBounds !== undefined) win.setBounds(mainBounds);
        win.once("blur", () => win.close());
        win.once("close", () => {
            mainBounds = win.getBounds();
            floatingWindow = buildFloatingWindow();
        });
    });
    const buildFloatingWindow = windowBuilder(dir_html("floating.html"), {
        width: 80,
        height: 80,
        resizable: false,
        alwaysOnTop: true,
        frame: false,
        skipTaskbar: true,
        transparent: true,
        webPreferences: {
            preload: dir_preload("floating.js")
        }
    }, (win) => {
        if (floatingBounds !== undefined) win.setBounds(floatingBounds);
        win.once("minimize", () => win.restore());
        win.once("close", () => {
            floatingBounds = win.getBounds();
            mainWindow = buildMainWindow();
        });
    });

    ipcMain.handle("main:clear-excluded", () => clearExcluded());
    ipcMain.handle("main:get-config", () => getConfig());
    ipcMain.handle("main:set-config",
        (event, config) => setConfig(config));

    ipcMain.handle("main:hide", () => mainWindow.close());
    ipcMain.handle("main:exit", () => app.exit());

    ipcMain.handle("main:randperson",
        (event, number) => randperson(number));

    ipcMain.handle("floating:show", () => floatingWindow.close());
    ipcMain.handle("floating:window:get-bounds",
        () => floatingWindow.getBounds());
    ipcMain.handle("floating:window:set-bounds",
        (event, bounds) => floatingWindow.setBounds(bounds));

    mainWindow = buildMainWindow();
});