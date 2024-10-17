const { app, BrowserWindow, dialog, screen } = require('electron');
const { exec } = require('child_process');
const sudo = require('sudo-prompt');
const Docker = require('dockerode');
const fs = require('fs');
const os = require('os');
const https = require('https');
const path = require('path');

function startDockerDesktop() {
  const platform = os.platform();

  switch (platform) {
    case 'darwin': // macOS
      startDockerMacOS();
      break;
    case 'win32': // Windows
      startDockerWindows();
      break;
    case 'linux': // Linux
      startDockerLinux();
      break;
    default:
      console.log('Unsupported platform. Unable to start Docker Desktop.');
  }
}

// macOS: Start Docker Desktop
function startDockerMacOS() {
  const command = 'open -a Docker'; // Command to start Docker Desktop on macOS

  // Run the command with sudo
  exec(`osascript -e 'do shell script "${command}" with administrator privileges'`, (error, stdout, stderr) => {
    if (error) {
      console.error('Failed to start Docker Desktop on macOS:', stderr || error.message);
      return;
    }
    console.log('Docker Desktop started on macOS.');
  });
}

// Windows: Start Docker Desktop
function startDockerWindows() {
  const command = `"C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe"`;

  // Run the command with elevated privileges using PowerShell
  const elevatedCommand = `powershell -Command "Start-Process '${command}' -Verb RunAs"`;

  exec(elevatedCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('Failed to start Docker Desktop on Windows:', stderr || error.message);
      return;
    }
    console.log('Docker Desktop started on Windows.');
  });
}

// Linux: Start Docker Daemon
function startDockerLinux() {
  const command = 'systemctl start docker';

  // Run the command with sudo
  exec(`sudo ${command}`, (error, stdout, stderr) => {
    if (error) {
      console.error('Failed to start Docker on Linux:', stderr || error.message);
      return;
    }
    console.log('Docker daemon started on Linux.');
  });
}


// Initialize Docker SDK
const docker = new Docker();

// Function to create Electron window
function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: path.join(__dirname, 'assets', 'icon_16x16.png'),
  });
  mainWindow.loadURL('http://localhost:1338')
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
function dockerRunWithPrivileges(imageName, containerName, hostPort, containerPort, withPrivileges) {
  return new Promise((resolve, reject) => {
    const command = `docker run -d -p ${hostPort}:${containerPort} --platform linux/amd64 --name ${containerName} ${imageName}`;
    const options = {
      name: 'MyElectronApp',
    };

     const executeCommand = withPrivileges ? sudo.exec : exec;

   executeCommand(command, options, (error, stdout, stderr) => {
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

function dockerPullWithPrivileges(imageName, withPrivileges) {
  return new Promise((resolve, reject) => {
    const command = `docker pull --platform linux/amd64 ${imageName}`;
    const options = {
      name: 'MyElectronApp',  // This name appears in the prompt dialog
    };

     const executeCommand = withPrivileges ? sudo.exec : exec;

    // Execute Docker pull command with sudo privileges
    executeCommand(command, options, (error, stdout, stderr) => {
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
          message: `Docker Desktop installer downloaded to ${installerPath}. Please run the installer, then re-start the CALOR app.`,
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
          message: `Docker installer downloaded to ${installerPath}. Please run the installer, then re-start the CALOR app.`,
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

    // Function to check Docker status
function checkDockerStatus() {
  // Determine the operating system
  const platform = os.platform();

  // Command to check Docker status
  const dockerInfoCommand = 'docker info';

  // Execute the command
  exec(dockerInfoCommand, (error, stdout, stderr) => {
    if (error) {
      //console.error('Docker is not running or not installed:', error.message);
      showDockerNotRunningMessage(platform);

    // If Docker is not found, prompt to download and install Docker
    const response = dialog.showMessageBoxSync({
      type: 'error',
      buttons: ['Yes', 'Cancel'],
      message: 'Docker daemon is not running. Start daemon?'
    });

    if (response === 0) {
       console.log("starting docker daemon")
      // Download Docker based on the OS platform
      if (process.platform === 'win32') {
         startDockerDesktop()
      } else if (process.platform === 'darwin') {
         startDockerDesktop()
      } else {
         startDockerDesktop()
      }
    } else {
      app.quit(); // Quit the app if the user cancels
    }
    }

    // If the command runs successfully
    console.log('Docker is running:', stdout);
  });
}

// Show a message if Docker is not running
function showDockerNotRunningMessage(platform) {
  switch (platform) {
    case 'darwin':
      console.log('Docker is not running on macOS. Please start Docker Desktop.');
      break;
    case 'win32':
      console.log('Docker is not running on Windows. Please start Docker Desktop.');
      break;
    case 'linux':
      console.log('Docker is not running on Linux. Make sure the Docker daemon is running.');
      break;
    default:
      console.log('Unsupported platform. Unable to determine Docker status.');
  }
}


// Function to check Docker, download if necessary, and start the Shiny app using Dockerode
async function detectDockerAndRunApp() {
  try {
    const dockerVersion = await checkDockerInstallation();
    console.log(`Docker is installed: ${dockerVersion}`);
   
  
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

   // Check if docker daemon is running
   try {
      checkDockerStatus()
      // TODO: Repository not yet public: Make repository public to pull from it
      // For testing and deevlopment, start the app locally with Rscript startapp.R from the calorimetry repository
      
      // Pull and run the Shiny app Docker container and start on port 1338
      // await dockerPullWithPrivileges('stephanmg/caloapp');
      // await dockerRunWithPrivileges('stephanmg/caloapp', 'caloapp', { containerPort: '1338', hostPort: '1338' });

     // Create the Electron window after the container is running
     app.whenReady().then(() => {
       // Set the Dock icon on macOS
       if (process.platform === 'darwin') {
          app.dock.setIcon(path.join(__dirname, 'assets', 'icon_512x512.png'));
       }
       createWindow();
     });
   } catch (error) {
      app.quit()
   }
}

// Initialize the app
app.whenReady().then(detectDockerAndRunApp);

// Quit when all windows are closed
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
