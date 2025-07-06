# Contributing
Contributions to this project is highly welcomed and appreciated. 
If you have any idea or question, open new issue.

## How to contribute
1. Check current issues / [project](https://github.com/users/skorphil/projects/7)
2. Check [project's wiki](https://github.com/skorphil/savnote/wiki), especially [vision](https://github.com/skorphil/savnote/wiki/SavNote-Vision) and [tech stack](https://github.com/skorphil/savnote/wiki/Project's-tech-stack)
3. Participate in existing issues or create new, describing your idea

## Where to contribute
The domains are not limited, however this list might help you to start:
- Increase code quality (refactor, test coverage)
- New feature development:
    - Widget to overview savings (might use some calculations and charts)
    - Rust android-specific features
    - Rust encryption features
    ...
- Visual language
    - Logo design
    - Styling and design system
    - Existing task: https://github.com/skorphil/savnote/issues/40 
- Community
    - Writing about app
    - Fill wiki with a guides
...    

## Quick Start
Install dependencies:
```shell
pnpm install
```
Install `android-studio` on yor system: https://developer.android.com/studio
Install `ndk` within `android-studio`: Settings > Languages & Frameworks > SDK Tools
Set the `NDK_HOME`, `ANDROID_HOME` PATH variables (ANDROID_HOME can be seen in Settings > Languages & Frameworks):
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

## Project structure
[Feature sliced design](https://feature-sliced.github.io/documentation/docs) was chosen initially because
1. It is documented, so no need to describe project structure explicitly
2. It looks quite logical and follows common development approach
3. There is a linter and other tools available to manage project structure
4. It claims to loosen coupling if followed it's linter rules
5. It tries to merge technical partitioning(slices) and domain partitioning (`features` layer)

However issues are present: FSD primarily focused on frontend development, 
while this project is full-stack. So it has it trade-offs.
