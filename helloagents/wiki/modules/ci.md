# ci

## 目的
维护 GitHub Actions 工作流，提供定时签到、仓库保活与上游同步能力。

## 模块概述
- **职责:** 通过 `.github/workflows/*.yml` 编排定时任务与自动化维护
- **状态:** ✅稳定
- **最后更新:** 2026-02-10

## 规范

### 需求: 每日同步上游更新
**模块:** ci
在 fork 仓库中每日拉取上游（父仓库）更新，确保签到逻辑及时跟进官方/上游修复与功能。

#### 场景: 定时同步
满足以下条件时执行同步：
- 到达设定的 cron 时间或手动触发 workflow
- 同步目标为上游 `main` 分支
- 同步成功后推送到当前仓库 `main`

## 依赖
- GitHub Actions Runner（ubuntu-latest）
- `secrets.GITHUB_TOKEN`（需具备 `contents: write` 权限）

## 变更历史
- [202602101830_sync-upstream](../../history/2026-02/202602101830_sync-upstream/) - 每日同步上游更新与保活分支调整
