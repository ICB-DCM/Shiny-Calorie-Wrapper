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

## Notes

- When Docker Desktop is not available on the computer by the user, the user will be prompted to download and install Docker Desktop. The Shiny App installer will then need to be re-started after installation of Docker Desktop to finalize installation of the Shiny App.
- Currently we manually trigger a build on each tagged CALOR version, e.g. v0.4.6 or for future versions v0.4.7 - see issue [#3](https://github.com/stephanmg/shiny-electron-wrapper/issues/3)
