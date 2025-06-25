# electron-wrapper for shiny apps

This repository contains an Electron wrapper template and scripts to create Desktop installers for dockerized Shiny/R app. In particular this repository creates installers for the Shiny-Calorie application for indirect calorimetry analysis.

The workflow presented in this repository can be copied and applied to any properly dockerized Shiny/R app - not only to the Shiny-Calorie app.

It makes use of automatically-installing of docker / Docker Desktop (user is prompted), and pulls the corresponding app version from the https://docker.io/stephanmg/caloapp repository, resulting in an easy one-click installation procedure for users.

The Shiny-Calorie app is contained in another repository: https://github.com/stephanmg/calorimetry 

[![Build OSX](https://github.com/stephanmg/shiny-electron-wrapper/actions/workflows/build.yml/badge.svg)](https://github.com/stephanmg/shiny-electron-wrapper/actions/workflows/build.yml)
[![Build Linux](https://github.com/stephanmg/shiny-electron-wrapper/actions/workflows/build_linux.yml/badge.svg)](https://github.com/stephanmg/shiny-electron-wrapper/actions/workflows/build_linux.yml)
[![Build Windows](https://github.com/stephanmg/shiny-electron-wrapper/actions/workflows/build_win.yml/badge.svg)](https://github.com/stephanmg/shiny-electron-wrapper/actions/workflows/build_win.yml)

## Downloads

One-click installers for Windows, Linux and OSX are found here: https://uni-bonn.sciebo.de/s/cfdY7AizCjKi3Dc

Current available versions:
 - 0.4.0 (initial release)
    - 0.4.7 (Release for preprint)
    - 0.4.6 (Bugfix release)
    - 0.4.5 (Bugfix release)

## How to run

Ubuntu:
- Start the `AppImage` by double click (Make sure the binary can be executed via `chmod +x`)
- Install the `.snap` package via: `snap install --dangerous`.

For Ubuntu 24.04 users: If the `AppImage` does not start as expected, you might need to add `--no-sandbox` and start the app by `Shiny-Calorie-app.AppImage --no-sandbox`. 
Note that the `snap` package is currently not signed, that's why one need to skip signature verification with `--dangerous`. There is no inherent harm in doing so,
future `snap` releases will be signed, see issue https://github.com/stephanmg/shiny-electron-wrapper/issues/7

OSX:
- Use the compressed `dmg` image and follow standard procedures for software installation on Mac.

Windows:
- Use the provided universal `.exe` installer. 


When docker / Docker Desktop is not available for the user, the user will be prompted with a dialogue
to download and install the software.

The Shiny App installer will then need to closed (after installation of Docker Desktop) and re-started to finalize the installation of the Shiny App.

