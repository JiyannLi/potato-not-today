# 技术参考

调研方式：GitHub Search API 在此环境返回代理 403；改用平台 HTTPS Git 代理实际读取以下公开仓库、源码及 LICENSE。未复制整个项目、角色、模型、纹理或其他游戏玩法。维护情况按当前检出源码判断，不以 star 数代替质量评估。

| 项目 / 地址 | 技术问题与借鉴方式 | 许可证 | 实际复用 |
| --- | --- | --- | --- |
| [Three.js](https://github.com/mrdoob/three.js) | 官方 `webgl_instancing_dynamic`：共享几何体、实例矩阵；`webgl_animation_skinning_blending`：idle/walk/run 分离；`webgl_postprocessing_outline`：比较后处理描边成本，本作采用局部 EdgesGeometry 细线。原生缓冲几何体合并静态环境，避免逐片瓦片绘制。 | MIT，已读根 LICENSE | npm 运行时依赖及官方 BufferGeometryUtils 工具；未复制示例代码或示例模型。依赖许可证保留在 node_modules/three/LICENSE。 |
| [ThreeJS Tutorial CharacterController](https://github.com/simondevyoutube/ThreeJS_Tutorial_CharacterController) | 第三人称键盘输入、朝向更新、idle/walk/run 状态分离；教学项目年代较早，借鉴概念，未沿用旧版 API 或外部 FBX。本作采用相机平面映射、指数平滑和自写圆形角色/AABB 碰撞。 | MIT，已读根 LICENSE | 无代码或资源复用。 |
| [nipplejs](https://github.com/yoannmoinet/nipplejs) | 移动端摇杆生命周期、指针标识与释放状态清理；当前 TypeScript 源码清晰，有单元测试。借鉴输入生命周期思路，本作直接用 Pointer Events 与 setPointerCapture 实现一个固定摇杆。 | MIT，已读根 LICENSE | 无代码或资源复用，未安装该库。 |

全部场景和角色为本项目原创程序化几何体。动作使用节点局部旋转与正弦步态，不需要骨骼素材或动画库。未来若真正复制第三方片段或素材，需另行保留其署名和许可证。
