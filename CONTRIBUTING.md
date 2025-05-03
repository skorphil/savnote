# Contributing

## Quick Start
Install dependencies:
```shell
pnpm install
```

Install `android-studio` on yor system: https://developer.android.com/studio
Install `ndk` within `android-studio`: Settings > Languages & Frameworks > SDK Tools

Set the `NDK_HOME`, `ANDROID_HOME` PATH variables (ANDROID_HOME is seen in Settings > Languages & Frameworks):
```
export ANDROID_HOME=YOUR_PATH/Android/sdk
export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH

export NDK_HOME=$ANDROID_HOME/ndk/29.0.13113456
export PATH=$PATH:$NDK_HOME
```

Initialize Android project:
```shell
pnpm tauri android init
```

## Project structure: 
[Feature sliced design](https://feature-sliced.github.io/documentation/docs) was chosen because
1. it is already documented, so no need to describe project structure explicitly
2. it looks quite logical and follows common development approach


## Core tech stack:
**React**
I'm familliar with it and it is quite popular.

**Tauri**
Small bundle size. Has potential to be adopted for desktop (maybe future forks)

## Core Libraries:
**[Konsta ui](https://github.com/konstaui/konsta)**
Despite being outdated, has largest react collection of M3 styled components. Mui, Ionic mostly have outdated M2 design components at the time of decision. Konsta looked as a good library to quickly build initial UI. 

**[Tinybase](https://github.com/tinyplex/tinybase)**
Allows both in-memory and indexed-db storage and reactivity. Not very popular and illogical sometimes. 
But I wanted to have a single library and similar methods to:
- manage persistent preferences 
- manage financial records in-memory. 
- manage persistent form state

Choose tinybase over pouch-db because PD doesn't have in-memory storage (App needs this for protected financial data). 
Tinybase makes it possible to avoid redux, use-form-hook etc.

**[android-fs](https://github.com/aiueo13/tauri-plugin-android-fs)**
Best rust library I found for managing files in android. Provides file dialogs with write access in android 11+ 
Shoutout to [@aiueo13](https://github.com/aiueo13) for the help!
Without him, I wouldnt be able to implement local file management, because I'm noob at rust.

**[react-number-format](https://s-yadav.github.io/react-number-format)**
One of important UX features for financial app is number formatting.
My custom-made solution had issue with input position(i can't avoid blinking of carret when manually controlled its position). This library works out of the box and have all needed functions

**[react-modal-sheet](https://github.com/Temzasse/react-modal-sheet/issues)**
Konsta doesnt have good modal sheet, that is why this standalone component is used. It is based on apple guidelines, but works good enough. Haven't found any better alternative react component.
