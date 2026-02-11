# 技术设计: 每日同步上游更新

## 技术方案

### 核心技术
- GitHub Actions（`schedule` + `workflow_dispatch`）
- Git（添加 `upstream` remote、fetch/merge/push）

### 实现要点
- 同步工作流固定以父仓库（上游）`AEtherside/skland-daily-attendance` 作为同步源
- 同步目标为当前仓库 `main` 分支，并尽量在签到工作流运行前同步完成
- 优先使用 fast-forward；若 `main` 存在自定义提交则回退为普通 merge（可能产生 merge commit）
- 仅在本地 HEAD 与远端 `origin/main` 不一致时推送，避免产生无意义提交

## 架构决策 ADR

### ADR-001: Upstream 同步与保活分支策略
**上下文:** GitHub Actions 长期无活动可能被停用，常见做法是定期推送空提交；但空提交进入 `main` 会导致 fork 与上游难以保持 fast-forward 同步。
**决策:** 保活空提交推送到独立 `keepalive` 分支；新增 `sync-upstream` 工作流每日将上游 `main` 同步到 fork 的 `main`。
**理由:** 兼顾“保持 Actions 活跃”与“尽量保持 main 与上游一致”，降低冲突概率。
**替代方案:** 继续向 `main` 推送空提交 → 拒绝原因: 增加与上游同步的复杂度与噪音提交。
**影响:** 需要在仓库设置中允许 `GITHUB_TOKEN` 对 contents 具备写权限；并可能新增 `keepalive` 分支。

## 安全与性能
- **安全:** 仅使用 `secrets.GITHUB_TOKEN` 推送到当前仓库，不引入额外密钥
- **性能:** 仅在检测到上游更新时推送，避免不必要的 workflow 触发

## 测试与部署
- **测试:** 通过 GitHub Actions 手动触发 `Sync upstream`，观察是否成功拉取并（在有更新时）推送
- **部署:** 合并到 `main` 后自动生效；需在仓库设置中开启 Actions 与写权限
