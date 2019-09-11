# Electron AudioStation

A Synology AudioStation client run on macOS and Windows. Built with Electron by milkfish. 

# Feature
- shortcut: `Media Play/Pause`, `Media Next Track`, `Media Previous Track`, `Media Stop`

**Important**: The following accelerators will not be registered successfully on macOS 10.14 Mojave unless the app has been authorized as a [trusted accessibility client](https://developer.apple.com/library/archive/documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTestingApps.html)

# How To Use
##### you'll need Git & Node.js (which comes with npm) installed on your computer
```
# Clone this repository
git clone https://github.com/sdjnmxd/electron-audiostation.git

# Go into the repository
cd electron-audiostation

# Change load url in main.js
mainWindow.loadURL('')  // you audio stations location

# Install dependencies and run the app
npm install && npm start
```

##### To pack into an app, simply type one of these:
```
npm run build:mac
npm run build:windows
npm run build:linux
```

### License GPL-3.0

**Electron AudioStation is released by this open source project. While Synology AudioStation Web is a component in the Synology DSM, it should be noted that this is a community release and not an official Synology AudioStation release.**
