# 土豆今天不上锅 · Potato Not Today

**V1.3：薄雾像素庭院，自由探索原型。** Three.js 实时三维、自然灰绿植被、统一像素颗粒与距离雾。玩家控制女性小厨师探索小院，一颗暂时不打算上锅的土豆在旁边待机。

## 运行与部署

需要 Node.js 20.19+ 或 22.12+，已验证 Node 24 / npm 11。

```sh
npm ci
npm run dev
```

打开 Vite 输出的地址（默认端口 5173）。根入口是正式探索庭院；`/atmospheric.html` 保留独立美术实验室，可以比较像素、雾、饱和度等参数。

```sh
npm run typecheck
npm test
npm run build
npm run preview
```

生产预览默认端口 4173。`dist/` 为纯静态网站，不要直接以 file:// 打开。无后端、密钥、外部模型、字体 CDN 或网络贴图。

GitHub Pages：

- 庭院：<https://jiyannli.github.io/potato-not-today/>
- 美术实验室：<https://jiyannli.github.io/potato-not-today/atmospheric.html>

```sh
bash scripts/deploy-pages.sh
```

脚本构建并将 `dist/` 与 `.nojekyll` 推送到 `gh-pages`，不强推。仓库 Pages 来源为 **Deploy from a branch → gh-pages → / (root)**。本项目使用相对资源路径，支持 GitHub 仓库子路径。推送成功与 Pages 实际完成上线是两个阶段。

## 操作

- WASD / 方向键移动；按住 Shift 小跑；角色自动面向移动方向。
- 触屏左下摇杆移动，按住右下“小跑”按钮加速。
- 右上 `?` 查看说明，打开时暂停模拟；Esc / “开始散步”关闭。
- 右上画质可在轻量、均衡、细腻之间切换，不重置角色位置。
- 镜头保持固定斜俯视方向，平滑跟随并按像素网格对齐；没有自由旋转或跳跃。

## 当前内容

庭院从 24 × 20 扩至 **32 × 27 单位（地表面积 1.8 倍）**。同步扩大碰撞边界，厨房与菜园向后侧/左右展开，保留厨房、菜园与入口间通道及中央环跑路线。外围有分枝树木、灌木、成簇白花、木栅栏、秋千、长凳、石块和信箱。厨房保留醒目黑锅、灶台、门框与木桌，前半屋顶开放，走到厨房前可观察锅和道具。

女性小厨师与单一土豆角色继续使用原有层级、idle/walk/run、基础转向和眨眼动画。模型使用平滑法线，移除旧描边，土豆表皮斑点改为实例绘制。土豆在正式场景中仍只待机，没有新增追逐 AI、抓取、投掷、计时、怨气、随机事件或联机。

碰撞采用圆形角色与 AABB，分步移动防薄障碍穿透，逐轴滑动。`src/world/layout.ts` 是边界、建筑位置、碰撞体与植被避让共用的布局数据。可视石板、草叶和白花不阻挡；菜床、灶台、桌、墙、树干、长凳等阻挡。树冠与叶片不阻挡，不使用物理引擎。

## 渲染与性能

复用 V1.2 验证通过的 **3D Pixel Art + Natural Vegetation + Atmospheric Fog**：Three 官方 Composer → 场景 → 饱和度 → OutputPass（ACES/sRGB）→ RetroPass。默认中雾 FogExp2 `#79836e` / 0.018；颜色饱和度 0.78，量化上限 4096 色，关闭 dithering、bloom 与黑描边。

| 正式庭院画质 | 草叶密度参数 | 每分枝叶卡 | 草叶段数 | Render Scale / Pixel Size |
| --- | --- | --- | --- | --- |
| 轻量（触屏默认） | 14 | 70 | 2 | 0.5 / 1 |
| 均衡（桌面默认） | 28 | 105 | 2 | 0.75 / 2 |
| 细腻 | 44 | 150 | 3 | 1.0 / 2 |

Pixel Size 按画质设为 1 或 2 个内部缓冲像素，CSS 像素颗粒约为 `Pixel Size / Render Scale`，不受设备 DPR 影响。轻量档为 2 CSS px，避免手机上角色表情过度丢失。正式庭院使用平地，避免角色漂浮和简化高度碰撞；草地覆盖掩膜让厨房/菜床及通路保持清晰，外围更密、中央更短更疏。实验室仍保留起伏地形。

实例化草叶、花、围栏、叶片和土豆斑点；静态房屋/道具按材质合并；树干与分枝合并。只缓存一盏 1024 静态太阳阴影，角色使用跟随位置的柔和接触阴影；移动不会每帧重绘森林阴影，切换画质时重绘一次。角色不会投射准确的长肢体方向阴影，这是当前性能取舍。未实现树木动态 LOD、草叶区块裁剪或自适应 FPS。

唯一运行时依赖为 Three.js（MIT）与 RetroPass 1.3.0（BSD-2-Clause）；开发依赖为 Vite、TypeScript、tsx 和 Playwright。实际复制的 MIT 草叶模块与修改记录见 [REFERENCES.md](REFERENCES.md)，分发许可位于 `public/licenses/`。所有美术纹理由 Canvas 程序生成。Three.js 公共包可能触发 Vite 的 500 KB 未压缩体积提示，不影响构建。

## 模块

```text
src/main.ts                 正式场景、渲染主循环与画质切换
src/world/layout.ts         共用布局、扩建边界、碰撞与植被掩膜
src/world/atmosphere.ts     植被档位、树木重建与接触阴影
src/world/environment.ts    围栏、入口、路径与石块
src/world/buildings.ts      厨房、菜园、秋千和长凳
src/world/model.ts          共享几何体、材质与建模辅助
src/world/optimize.ts       静态几何体合并
src/characters/actor.ts     角色层级和基础动画
src/systems/                键盘/触屏输入、碰撞、跟随镜头、暂停状态
src/art/                    可复用像素管线、程序植被与独立实验室
src/art/vendor/grass/       实际复用的 MIT 草叶模块及原 LICENSE
```

角色 `root` 用于移动/翻滚，`body` 用于整体形变，`arms/legs` 为独立 pivot，`face` 支持后续表情切换，`accessories` 是配饰挂点。复杂伸长、摔倒和装扮尚未实现。

## 验证与已知限制

```sh
npm run typecheck
npm test                     # 9 项：角色、眨眼、碰撞、实际布局路线、镜头等
npm run build
# 先启动开发服务器：
node tests/browser.mjs        # 行走、跑步、停止、帮助框、触屏摇杆
node tests/courtyard-browser.mjs # 画质、扩建边界、区域截图与软件渲染帧时间
node tests/art-controls.mjs   # 独立实验室的控件与触屏布局
```

默认使用系统 `/usr/bin/chromium`，主要脚本支持 `CHROMIUM_PATH`。浏览器测试使用 SwiftShader；软件渲染性能不代表桌面显卡和手机，不能据 Draw Calls 直接宣称流畅。正式庭院实测见 [V1.3 报告](docs/courtyard-v13/REPORT.md)，历史美术对照见 [V1.2 报告](docs/art-v12/REPORT.md)。Safari/Firefox 和真实手机 GPU 尚未实测。

开发模式 `window.__potato()` 是只读状态快照；`window.__courtyardTest` 是浏览器测试用的合法位置传送/碰撞查询接口，两者均不进入生产。实验室 `window.__artLab` 仅控制独立预览。
