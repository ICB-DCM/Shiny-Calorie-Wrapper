# electron-wrapper for shiny apps

This repository contains an Electron wrapper for dockerized Shiny/R Apps, in particular scripts to create Desktop installers for the CALOR application for indirect calorimetry analysis.

It makes use of automatically-installing of Docker Desktop, and pulls the corresponding CALOR app version from the https://docker.io/stephanmg/caloapp repository, resulting in an easy one-click installation for users.

The CALOR app is contained in another repository: https://github.com/stephanmg/calorimetry 

[![Build OSX](https://github.com/stephanmg/shiny-electron-wrapper/actions/workflows/build.yml/badge.svg)](https://github.com/stephanmg/shiny-electron-wrapper/actions/workflows/build.yml)
[![Build Linux](https://github.com/stephanmg/shiny-electron-wrapper/actions/workflows/build_linux.yml/badge.svg)](https://github.com/stephanmg/shiny-electron-wrapper/actions/workflows/build_linux.yml)
[![Build Windows](https://github.com/stephanmg/shiny-electron-wrapper/actions/workflows/build_win.yml/badge.svg)](https://github.com/stephanmg/shiny-electron-wrapper/actions/workflows/build_win.yml)

## Downloads

One-click installers for Windows, Linux and OSX are found here: https://uni-bonn.sciebo.de/s/0qDhG2Bu1VNkRli

Current available versions:
 - 0.4.0 (initial release)
    - 0.4.6 (Release for preprint)
    - 0.4.5 (Bugfix release)

## How to run

Ubuntu:
- Start the `AppImage` by double click (Make sure the binary can be executed via `chmod +x`)
- Install the `.snap` package via: `snap install --dangerous`.

For Ubuntu 24.04 users: If the `AppImage` does not start as expected, you might need to add `--no-sandbox` and start the app by `CALOR-app.AppImage --no-sandbox`. 
Note that the `snap` package is currently not signed, that's why one need to skip signature verification with `--dangerous`. There is no inherent harm in doing so,
future `snap` releases will be signed.

OSX:
- Use the compressed `dmg` image and follow standard procedures for software installation on Mac.

Windows:
- Use the provided universal `.exe` installer. 


When docker / Docker Desktop is not available for the user, the user will be prompted with a dialogue
to download and install the software.

The Shiny App installer will then need to closed (after installation of Docker Desktop) and re-started to finalize the installation of the Shiny App.

## Notes

Currently we manually trigger a build on each tagged CALOR version, e.g. v0.4.6 etc., see issue [#3](https://github.com/stephanmg/shiny-electron-wrapper/issues/3).
