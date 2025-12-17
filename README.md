# Obsidian Bridge

## Table of Contents

- [Intro](#intro)
- [Requirements](#requirements)
- [Publishing the Package](#publishing-the-package)

## Intro

This is a firefox extension that allow easy interaction with a local obsidian instance while browsing the web via the Firefox sidebar.

## Requirements

- npm (tested on v10.9.2)
- Tested on OpenSuse (though should be platform independent)

## Publishing the Package

### Option 1

- 1. Run `make build`

### Option 2

- 1. First, install npm dependencies `npm install --legacy-peer-deps`
- 2. To make a production build, run `npm run build:firefox`
- 3. To create the zip, go into the newly created `dist_firefox` directory and run `zip -r -FS ../obsidian-bridge-firefox *`

### Option 3

- After pushing to GitHub, there is a [github action](https://github.com/GGonnerman/firefox-obsidian-addon/actions/runs/19884523018) which can be manually run that does a production build and produces the artifact.
