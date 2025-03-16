# SavNote – Private Savings Journal
*SavNote* is a user-friendly, open-source app designed to help you track your personal savings with ease.
It's like a digital notepad where you can record your savings on a monthly (or less frequent) basis and gain valuable insights:
* Summary trend
* Total value in your chosen currency
* Breakdown of savings by currency
* Geographic distribution of savings (by country)
* Distribution of savings across institutions (banks, brokers, or cryptocurrency wallets)
* Asset-to-cash ratio

## Core Principles
*SavNote* is built on the following core principles:
* **Data ownership**: You have full control over your data, which is stored locally on your device. Your savings data remains accessible even if you uninstall the app, and you can use it independently of *SavNote*.
* **Data privacy**: Your data is encrypted and protected by a password, ensuring that only you can access it.
* **Open-source**: As an open-source app, *SavNote* allows you to extend and customize it to suit your needs.
* **Mobile-first with Android at its core**: SavNote is built using a cross-platform engine, but Android is the primary platform of focus. This means that the design, development, and testing prioritize the unique needs and capabilities of Android devices, with other platforms supported as a secondary consideration. Forks for others platforms are welcome.


## Development
### Quick Start
Install dependencies:
```
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
```
pnpm tauri android init
```

Add permissions to android manifest: `./src-tauri/gen/android/app/src/main/AndroidManifest.xml`:

```diff
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
+   <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
+   <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```
