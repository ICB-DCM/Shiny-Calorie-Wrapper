# electron-wrapper for shiny app

This repository contains an Electron wrapper for the Shiny CALOR app for indirect calorimetry.
It makes use of auto-install of Docker, and pulls the corresponding CALOR app version from docker.io during one-click installation.
The CALOR app is contained in another repository: https://github.com/stephanmg/calorimetry - The docker.io container is not yet public, since publication is pending, will be made public soon.

[![Build OSX](https://github.com/stephanmg/shiny-electron-wrapper/actions/workflows/build.yml/badge.svg)](https://github.com/stephanmg/shiny-electron-wrapper/actions/workflows/build.yml)
[![Build Linux](https://github.com/stephanmg/shiny-electron-wrapper/actions/workflows/build_linux.yml/badge.svg)](https://github.com/stephanmg/shiny-electron-wrapper/actions/workflows/build_linux.yml)
[![Build Windows](https://github.com/stephanmg/shiny-electron-wrapper/actions/workflows/build_win.yml/badge.svg)](https://github.com/stephanmg/shiny-electron-wrapper/actions/workflows/build_win.yml)
[![Remove old artifacts](https://github.com/stephanmg/shiny-electron-wrapper/actions/workflows/remove-old-artifacts.yml/badge.svg)](https://github.com/stephanmg/shiny-electron-wrapper/actions/workflows/remove-old-artifacts.yml)

## Downloads

One-click installers for Windows, Linux and OSX are found here: https://uni-bonn.sciebo.de/s/0qDhG2Bu1VNkRli

## Notes

Currently only installers for the latest development version from branch `with_metadata_sheet` of the CALOR app are available and named as version 1.0.0.
Versions based on tags have to be integrated, see issue https://github.com/stephanmg/shiny-electron-wrapper/issues/3.

## Citation
TBD
