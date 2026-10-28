# 土豆今天不上锅 · Potato Not Today

第一阶段 3D 乡村小院探索原型。原创程序化低多边形场景，无模型下载、外部字体、图片 CDN、密钥或后端服务。

## 运行

需要 Node.js 20.19+ 或 22.12+（本环境已验证 Node 24 / npm 11）。

```sh
npm ci
npm run dev
```

在本机浏览器访问 Vite 输出的地址（默认端口 5173）。生产预览：

```sh
npm run typecheck
npm test
npm run build
npm run preview
```

预览默认端口 4173。`dist/` 可以部署到静态网站服务；不要直接用 file:// 打开。云执行沙箱如禁止监听端口，需要允许相应开发服务器命令。

## 操作

- WASD / 方向键：按画面方向移动；Shift：小跑；自动平滑转向。
- 触屏：左下摇杆移动，按住右下“小跑”按钮加速。
- 右上 `?`：操作说明，打开时暂停模拟；Esc 或“开始散步”关闭。
- 斜俯视固定方向镜头平滑跟随，无自由旋转、跳跃或抓取。

## 已实现

约 24 × 20 单位的草地沙盘、石板路、边界木栅栏、开放入口与信箱；半开放奶油色厨房、陶土后屋顶、独立木门框、灶台黑锅、木桌餐具；三排菜园、土豆种植区与篮子；低多边形树、秋千、长凳、岩石和实例化花草。中央保持宽敞，菜园与厨房前有通路。厨房前半屋顶有意开放，保证能看到锅。

女性小厨师有厨师帽、棕发发髻、白衣、围裙、领巾与鞋子。土豆有不规则椭球身体、斑点、大眼睛、短肢与嫩芽。两者实现 idle/walk/run 程序动画与基础转向能力，土豆在场景中只待机、轻晃和眨眼，不运行追逐 AI。

障碍物采用圆形角色与轴对齐矩形碰撞，分步移动防穿透、逐轴滑动，限制庭院边界。桌面和平板/手机响应式布局，WebGL 不可用或 context lost 时提示。

## 模块

```text
src/main.ts               场景、渲染与主循环
src/world/model.ts        共享几何体、材质与建模辅助
src/world/environment.ts  地形、植被、围栏、路径
src/world/buildings.ts    厨房、道具、菜园与树
src/world/optimize.ts     按材质合并静态环境
src/characters/actor.ts   厨师/土豆及基础动画
src/systems/input.ts      键盘、触屏输入接口
src/systems/collision.ts  边界、障碍物与滑动
src/systems/camera.ts     斜俯视平滑跟随
src/systems/state.ts      时间与暂停状态
```

`Actor.root` 用于移动/翻滚，`body` 用于整体形变，`arms/legs` 是独立 pivot，可延长其 scale.y；`face` 预留表情切换，`accessories` 为配饰挂点。新增形变应恢复各节点基础比例，不需重建角色。复杂形变尚未实现。

## 性能与依赖

唯一运行时依赖是 Three.js（MIT）。Vite/TypeScript 构建；tsx 运行 Node 测试；Playwright 仅用于开发浏览器验证。静态建筑、道具按材质合并；花草、围栏使用 InstancedMesh；几何体/材质共享。像素比上限 1.75；仅一盏方向光投影，2048 阴影贴图，无后处理描边。不引入物理或游戏框架。生产 JS 约 130 KB gzip；Three.js 单包会触发 Vite 默认 500 KB 未压缩体积提示，不影响构建。

## 验证

`npm test` 覆盖边界、薄障碍防穿透、滑动、通道、角色三种动作及土豆眨眼，共 5 项。

浏览器烟测：先启动 `npm run dev`，再运行 `node tests/browser.mjs`。默认使用 `/usr/bin/chromium`；可用 `CHROMIUM_PATH` 指定系统 Chromium。会检查桌面和移动尺寸、移动/奔跑/停止、帮助框、触屏摇杆、页面错误，并将截图写到临时目录。浏览器为软件 WebGL，仅验证功能，不代表真实手机/硬件 GPU 帧率。

开发模式只读调试：控制台 `window.__potato()` 返回位置、动画、Draw Calls、三角面数和碰撞体数量；生产不暴露。

## 范围与限制

没有复杂 AI、抓取、投掷、计时、怨气、随机事件、关卡或联网。土豆 walk/run 通过角色模块测试，不会自主走动。碰撞简化为 AABB，装饰性花草、石板不阻挡，秋千不可互动。尚未实测 Safari、Firefox 或真实手机帧率。当前为轻微边线和低多边形风格，非完整手绘渲染。

参考与许可证见 [REFERENCES.md](REFERENCES.md)。
