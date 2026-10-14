# Study-Scare

Study-Scare is an Electron desktop app that uses your webcam and MediaPipe face
landmarks to detect when you look away from your screen. It then displays a
jumpscare.

## Requirements

- Node.js and npm
- A webcam
- An internet connection when using the app: MediaPipe's WebAssembly files,
  JavaScript bundle, and face-landmarker model are loaded from external URLs

## Set up and run from source

From the project root, install the dependencies, compile the TypeScript, and
start the Electron app. `npm install` installs TypeScript along with the other
project dependencies; compile only after that installation completes. Run these
commands in Bash (on Windows, use Git Bash):

```sh
npm install
./compile
npm start
```

Allow camera access when prompted. Press **Ctrl+Shift+Q** to quit the app.

Run `./compile` again after changing TypeScript files. The generated `dist/`
directory is required to run and package the app, but it is build output and
should not be committed.

## Build a distribution

Compile the app, then package it:

```sh
./compile
npm run package
```

The packaged application is written under `out/`. To also create a distributable
installer or archive, run:

```sh
npm run make
```

Electron Forge is configured with these makers:

- **Windows:** Squirrel.Windows installer
- **macOS:** ZIP archive
- **Linux:** Debian package

Build on the operating system you intend to distribute for. The output from
`npm run make` is placed under `out/make/`. Keep the project’s `src/` assets and
the compiled `dist/` files available during packaging; the app loads its HTML,
images, and audio from those project paths.

## Notes

- The app needs camera access to work.
- MediaPipe resources are downloaded from jsDelivr and Google when the app runs,
  so an internet connection is required.