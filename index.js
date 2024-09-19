const { app, BrowserWindow, dialog } = require('electron');
const { exec } = require('child_process');
const sudo = require('sudo-prompt');
const Docker = require('dockerode');
const fs = require('fs');
const https = require('https');
const path = require('path');

// Initialize Docker SDK
const docker = new Docker();

// Function to create Electron window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
    },
  });
  mainWindow.loadURL('http://localhost:4444');
}

// Function to check if Docker is installed
function checkDockerInstallation() {
  return new Promise((resolve, reject) => {
    exec('docker --version', (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

// Function to run the Docker container using elevated privileges
function dockerRunWithPrivileges(imageName, containerName, hostPort, containerPort) {
  return new Promise((resolve, reject) => {
    const command = `docker run -d -p ${hostPort}:${containerPort} --name ${containerName} ${imageName}`;
    const options = {
      name: 'MyElectronApp',
    };

    sudo.exec(command, options, (error, stdout, stderr) => {
      if (error) {
        console.error('Error running Docker container:', error);
        reject(error);
      } else {
        console.log(`Container ${containerName} is running.`);
        resolve(stdout);
      }
    });
  });
}

function dockerPullWithPrivileges(imageName) {
  return new Promise((resolve, reject) => {
    const command = `docker pull ${imageName}`;
    const options = {
      name: 'MyElectronApp',  // This name appears in the prompt dialog
    };

    // Execute Docker pull command with sudo privileges
    sudo.exec(command, options, (error, stdout, stderr) => {
      if (error) {
        console.error('Error pulling Docker image:', error);
        reject(error);
      } else {
        console.log('Docker pull result:', stdout);
        resolve(stdout);
      }
    });
  });
}

// Function to pull the Docker image
async function dockerPull(imageName) {
  return new Promise((resolve, reject) => {
    docker.pull(imageName, (err, stream) => {
      if (err) return reject(err);
      docker.modem.followProgress(stream, onFinished, onProgress);

      function onFinished(err, output) {
        if (err) return reject(err);
        console.log(`Successfully pulled image: ${imageName}`);
        resolve(output);
      }

      function onProgress(event) {
        console.log(`Pull progress: ${event.status}`);
      }
    });
  });
}

// Function to run the Docker container
async function dockerRunContainer(imageName, containerName, portMapping) {
  const container = await docker.createContainer({
    Image: imageName,
    name: containerName,
    HostConfig: {
      PortBindings: {
        [`${portMapping.containerPort}/tcp`]: [{ HostPort: portMapping.hostPort }]
      }
    }
  });

  await container.start();
  console.log(`Container ${containerName} is running on port ${portMapping.hostPort}`);
}

// Function to download Docker installer for Windows
function downloadDockerInstallerWindows() {
  const installerPath = path.join(app.getPath('downloads'), 'DockerDesktopInstaller.exe');
  const file = fs.createWriteStream(installerPath);

  https.get('https://desktop.docker.com/win/stable/Docker%20Desktop%20Installer.exe', (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close(() => {
        dialog.showMessageBoxSync({
          type: 'info',
          buttons: ['OK'],
          message: `Docker Desktop installer downloaded to ${installerPath}. Please run the installer.`,
        });
      });
    });
  }).on('error', (err) => {
    fs.unlink(installerPath);
    dialog.showMessageBoxSync({
      type: 'error',
      buttons: ['OK'],
      message: `Error downloading Docker installer: ${err.message}`,
    });
  });
}

// Function to download Docker installer for macOS
function downloadDockerInstallerMac() {
  const installerPath = path.join(app.getPath('downloads'), 'Docker.dmg');
  const file = fs.createWriteStream(installerPath);

  https.get('https://desktop.docker.com/mac/stable/Docker.dmg', (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close(() => {
        dialog.showMessageBoxSync({
          type: 'info',
          buttons: ['OK'],
          message: `Docker installer downloaded to ${installerPath}. Please run the installer.`,
        });
      });
    });
  }).on('error', (err) => {
    fs.unlink(installerPath);
    dialog.showMessageBoxSync({
      type: 'error',
      buttons: ['OK'],
      message: `Error downloading Docker installer: ${err.message}`,
    });
  });
}

// Function to check Docker, download if necessary, and start the Shiny app using Dockerode
async function detectDockerAndRunApp() {
  try {
    const dockerVersion = await checkDockerInstallation();
    console.log(`Docker is installed: ${dockerVersion}`);

    // Pull and run the Shiny app Docker container: 
    // TODO: Needs to be replaced with real shiny calor app
    await dockerPullWithPrivileges('selenium/standalone-chrome');
    await dockerRunContainerWithPrivileges('selenium/standalone-chrome', 'chrome-container', { containerPort: '4444', hostPort: '4444' });

    // Create the Electron window after the container is running
    createWindow();

  } catch (error) {
    console.error('Docker not found:', error);

    // If Docker is not found, prompt to download and install Docker
    const response = dialog.showMessageBoxSync({
      type: 'error',
      buttons: ['Download Docker', 'Cancel'],
      message: 'Docker is not installed. Do you want to download Docker Desktop now?',
    });

    if (response === 0) {
      // Download Docker based on the OS platform
      if (process.platform === 'win32') {
        downloadDockerInstallerWindows();
      } else if (process.platform === 'darwin') {
        downloadDockerInstallerMac();
      } else {
        dialog.showMessageBoxSync({
          type: 'error',
          buttons: ['OK'],
          message: 'Automatic Docker installation is not supported on this platform. Please install Docker manually.',
        });
      }
    } else {
      app.quit(); // Quit the app if the user cancels
    }
  }
}

// Initialize the app
app.whenReady().then(detectDockerAndRunApp);

// Quit when all windows are closed
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
