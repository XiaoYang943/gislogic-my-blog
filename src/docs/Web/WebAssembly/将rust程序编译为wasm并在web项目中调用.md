---
title: 将rust程序编译为wasm并在web项目中调用
category:
  - WebAssembly
  - Rust
---

:::tip
- 环境如下
  - windows64
  - rust、cargo`1.77.2`
:::

## step1.下载安装wasm打包工具
- [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)
## step2.创建rust项目
- `cargo new --lib`
## step3.配置cargo.toml
- 参考[文档](https://rustwasm.github.io/wasm-pack/book/tutorials/npm-browser-packages/template-deep-dive/cargo-toml.html)配置cargo.toml
- `cargo check`
## step4.编写rust程序
- 参考程序[wasm-bindgen](https://github.com/rustwasm/wasm-bindgen#example)
:::rust
use wasm_bindgen::prelude::*;

// Import the `window.alert` function from the Web.
#[wasm_bindgen]
extern "C" {
fn alert(s: &str);
}

// Export a `greet` function from Rust to JavaScript, that alerts a
// hello message.
#[wasm_bindgen]
pub fn greet(name: &str) {
alert(&format!("Hello, {}!", name));
}
:::
## step5.打包编译
- 参考[wasm-pack-build](https://rustwasm.github.io/docs/wasm-pack/commands/build.html#wasm-pack-build)
  - `wasm-pack build --target web`
### 报错
- `error: component download failed for rust-std-wasm32-unknown-unknown: could not download file from ...`
  - 解决
    - 更新工具链`rustup update`
    - 安装`rustup target add wasm32-unknown-unknown`
### 异常
- 卡在Installing wasm-bindgen...不动
  - 解决
    - 安装`cargo install wasm-bindgen-cli`
## step6.新建vite-vue项目
...
## step7.安装wasm包
- 把打包生成的**pkg**文件夹拷贝到vite项目根目录下，执行`npm install .\pkg\`
## step8.es6调用wasm
- App.vue中
```js
import init,{greet} from "hello-webassembly";
import {onMounted} from "vue";
onMounted(() => {
  init().then(() => {
    greet("wasm");	// 调用rust程序的 greet 方法
  })
})
```
- 结果
  - 运行vite项目，看到alert结果：`Hello, wasm!`