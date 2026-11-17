# Colonial Treasure Hunt

A small HTML5 canvas game built in 2018 for iPad and Android tablets. You guide a hook down through the sea, avoid the fish and reach the treasure. It is packaged as a Cordova (PhoneGap) app, but the game itself is plain HTML and JavaScript in `www/` (CreateJS for the canvas, GSAP TweenMax for animation), so it also runs in any modern browser.

## Project layout

- `www/` the game: `index.html`, `js/ColonialApp.js` (game logic), `js/index.js` (startup), `img/`, `css/`
- `www/res/` app icons and splash screens for the native builds
- `config.xml` Cordova app configuration

The native platform folders (`platforms/`, `plugins/`) are not committed. Cordova generates them from `config.xml` and `www/`.

## Run in a browser

Requirements: Node.js 20 or newer (only used to run a static file server).

```
npx serve www
```

Then open the URL it prints (http://localhost:3000 by default). The game is laid out for a portrait tablet screen, so a narrow, tall browser window or the device toolbar in your browser's dev tools works best.

Any static server works, for example `python3 -m http.server -d www 8000`. Opening `www/index.html` straight from disk is not recommended, because browsers restrict some canvas features on `file://` pages.

In a plain browser the console shows a 404 for `cordova.js`. That is expected: Cordova injects that file only in native and Cordova browser builds, and the game starts on page load when it is missing.

## Run with Cordova

Requirements: Node.js 20 or newer. Commands below use `npx`, so a global Cordova install is optional.

Cordova browser platform (no extra SDKs needed):

```
npx cordova@12 platform add browser
npx cordova@12 run browser
```

iOS (needs macOS with Xcode, the iOS Simulator runtime installed from Xcode > Settings > Components, and CocoaPods):

```
npx cordova@12 platform add ios
npx cordova@12 build ios --emulator
```

Running on a physical device or creating a release build also needs an Apple developer account for code signing.

Android (needs a JDK, the Android SDK and `ANDROID_HOME` set):

```
npx cordova@12 platform add android
npx cordova@12 build android
```

`cordova platform add` also creates a `package.json` that records the platform versions.

## Known limitations

- Current versions of cordova-ios use a single 1024x1024 app icon. The repo only has the older, smaller iOS icon sizes, so a fresh iOS build shows the default Cordova icon until a 1024x1024 icon is added to `config.xml`.
- Current versions of cordova-android ignore the `<splash>` tags in `config.xml` and print a warning about them. The build still works.
