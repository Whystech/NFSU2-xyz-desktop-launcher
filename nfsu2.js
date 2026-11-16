const { app, BrowserWindow } = require("electron");
const path = require("node:path");

const appFolder = process.env.PORTABLE_EXECUTABLE_DIR ||
  (app.isPackaged ? path.dirname(app.getPath("exe")) : __dirname);
const launcherPath = path.join(__dirname, "launcher.html");
const siteUrl = "https://nfsu2.xyz/";

app.setPath("userData", path.join(appFolder, "nfsu2-data"));

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    webPreferences: {
      partition: "persist:nfsu2",
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  

  win.webContents.on(
    "did-fail-load",
    (event, errorCode, _description, validatedURL, isMainFrame) => {
      if (!isMainFrame || errorCode === -3 || !validatedURL.startsWith(siteUrl)) return;

      win.loadFile(launcherPath, {
        query: { siteLoadFailed: "1" },
      }).catch((error) => console.error("Could not show launcher:", error));
    }
  );

  

  await win.loadFile(launcherPath);
});