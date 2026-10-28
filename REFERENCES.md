# 技术参考

调研方式：GitHub Search API 在此环境返回代理 403；改用平台 HTTPS Git 代理实际读取以下公开仓库、源码及 LICENSE。未复制整个项目、角色、模型、纹理或其他游戏玩法。维护情况按当前检出源码判断，不以 star 数代替质量评估。

| 项目 / 地址 | 技术问题与借鉴方式 | 许可证 | 实际复用 |
| --- | --- | --- | --- |
| [Three.js](https://github.com/mrdoob/three.js) | 官方 `webgl_instancing_dynamic`：共享几何体、实例矩阵；`webgl_animation_skinning_blending`：idle/walk/run 分离；`webgl_postprocessing_outline`：比较后处理描边成本，本作采用局部 EdgesGeometry 细线。原生缓冲几何体合并静态环境，避免逐片瓦片绘制。 | MIT，已读根 LICENSE | npm 运行时依赖及官方 BufferGeometryUtils 工具；未复制示例代码或示例模型。依赖许可证保留在 node_modules/three/LICENSE。 |
| [ThreeJS Tutorial CharacterController](https://github.com/simondevyoutube/ThreeJS_Tutorial_CharacterController) | 第三人称键盘输入、朝向更新、idle/walk/run 状态分离；教学项目年代较早，借鉴概念，未沿用旧版 API 或外部 FBX。本作采用相机平面映射、指数平滑和自写圆形角色/AABB 碰撞。 | MIT，已读根 LICENSE | 无代码或资源复用。 |
| [nipplejs](https://github.com/yoannmoinet/nipplejs) | 移动端摇杆生命周期、指针标识与释放状态清理；当前 TypeScript 源码清晰，有单元测试。借鉴输入生命周期思路，本作直接用 Pointer Events 与 setPointerCapture 实现一个固定摇杆。 | MIT，已读根 LICENSE | 无代码或资源复用，未安装该库。 |

全部场景和角色为本项目原创程序化几何体。动作使用节点局部旋转与正弦步态，不需要骨骼素材或动画库。未来若真正复制第三方片段或素材，需另行保留其署名和许可证。

## V1.2 Atmospheric 3D Pixel Art 评估与实际复用

本轮逐一通过 GitHub HTTPS 代理读取下列仓库的源码、清单和许可证。提交是实际读取的快照，不假定仓库最新主分支与 npm 发布包相同。未获取任何第三方树木/角色/音频/商业游戏素材。

| 项目 | 版本 / 提交快照 | 评估文件、兼容性与取舍 | 许可 / 实际采用 |
| --- | --- | --- | --- |
| [three-retropass](https://github.com/mesmotronic/three-retropass) | npm **1.3.0**；调研 `6d40cc0919cc687e3cc93d4615b1fafa11cb0ab8` | `lib/webgl/postprocessing/RetroPass.ts`, `lib/webgl/shaders/RetroShader.ts`；原生 ShaderPass，peer three >=0.128，与 r180 兼容；量化立方色表是常量复杂度，不逐像素遍历大调色板。 | **BSD-2-Clause，直接安装并使用** WebGL RetroPass；无修改库源码。关闭 dithering；OutputPass 后量化，禁用 RetroPass toneMapped，避免重复色彩转换。许可证随 `public/licenses/three-retropass-BSD.txt` 分发。 |
| [postprocessing](https://github.com/pmndrs/postprocessing) | 6.39.5；`9cf03cff26615636a564d8bfddf765edb8917441` | `src/effects/PixelationEffect.js`，支持当前 Three.js，但引入第二套 Composer/Effect 组织无必要；现有 Three 官方 Composer + RetroPass 已覆盖需求。 | **Zlib**，已读 `LICENSE.md`；未安装、未复制。 |
| [three-stylized](https://github.com/Steve245270533/three-stylized) | `8eb0dde5a8e7eae985d69f923b627b0cf253bed5` | 直接抽取 `src/grass/GrassLayer.ts`, `surfaceSampler.ts`, `coverage.ts`, `utils.ts`, `types.ts`, `shaders.ts`，到 `src/art/vendor/grass/`。复用三角面积加权采样、coverage 密度掩膜、三段草叶实例化、世界空间一致风及阴影。源快照使用 r185，适配至本项目 r180。 | **MIT，实际复制六个源文件**，原 LICENSE 同目录和 public/licenses 保留。修改：补 `packing` 阴影解码与 FogExp2 shader chunks / uniforms / fog flag；添加低频空间色差；密度重建时释放旧 InstancedMesh GPU 实例缓冲。其余采样与风逻辑保留；未引入上游工具链、GUI、完整地形/花朵系统。 |
| [threejs-field-grass](https://github.com/matthew-kissinger/threejs-field-grass) | 0.1.0；`2a0d3a3256dc8d8f6d9de68f3dc1636a621559c5` | `src/three/grassMaterial.ts`, `nodes.ts`, `tuftGeometry.ts`：TSL 与 WebGPU/WebGL2 Node 渲染器路径，角色交互较完整；本轮无需换 Renderer 或增加植被交互，移植成本高于 GLSL 草叶方案。 | **MIT**，已读 LICENSE；未复制代码、未安装。 |
| [foggy-pine-trail](https://github.com/StarKnightt/foggy-pine-trail) | `1a95bd9eb598e0e7fc8a513f27f1b9abd03f22b2` | `src/scene/fog.ts`、`src/scene/env.ts`、package.json；仅学习距离/高度层次和环境一致性。其全局 shader chunk 替换及 Next/R3F 架构侵入性较高；这里选 Three 原生 FogExp2，不修改全局 ShaderChunk。 | 仓库根未找到许可证，package.json 无 license；**不视为已授权复用，未复制代码或素材**。 |
| [SeedThree](https://github.com/SkyeShark/SeedThree) | 0.1.0-alpha；`cf2eaad39d9b7355ed086aca2a95fb785e539242` | README、`src/core/leaf-cards.js`, `src/core/impostor.js`：分枝、叶片卡和远景 billboard 思路。代码使用 `three/webgpu`、TSL 和 MeshSSSNodeMaterial，直接移植成本高；验证场景只需三棵树，采用原生 InstancedMesh + 原创 Canvas alpha 叶簇。 | 根代码许可 **MIT**；素材另有生成与音频来源说明，未将根许可等同于所有素材授权。**无代码/资源复制**，仅学习叶卡组织与 LOD 思路；当前未实现树木 LOD。 |

Three.js r180 官方 `EffectComposer` / `RenderPass` / `OutputPass` / `ShaderPass` / `BufferGeometryUtils`（MIT）继续复用。`public/licenses/three-MIT.txt` 随构建输出。新场景的树叶、树皮、地面贴图均由 Canvas 程序生成，无网络贴图。植被视觉不同于上游鲜艳草地：调低背光，增加灰绿与橄榄色、成簇白花，使用同一距离雾；不宣称复用了未实际引入的上游系统。

## V1.3 正式庭院推广

沿用 V1.2 已记录的依赖版本、许可证和六个 MIT 草叶模块，没有引入新第三方库或模型。`createMeadow` / `createTrees` 增加可选参数，供平坦庭院与原实验室共享：尺寸、覆盖掩膜、草叶高度/段数、树木位置与叶卡数。实例化叶簇和 Canvas 地面/叶片/树皮/花纹理仍由本项目原创代码生成。正式场景使用三档密度与叶片数，并在重建时释放旧 GPU 资源。移动角色采用原创程序渐变接触阴影，缓存静态太阳阴影，未宣称复用了未接入的 LOD、WebGPU 或角色植被交互系统。
