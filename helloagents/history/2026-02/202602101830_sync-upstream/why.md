# 变更提案: 每日同步上游更新

## 需求背景

本仓库为上游仓库的 fork，用于通过 GitHub Actions 执行签到任务。
当上游修复 bug、更新依赖或调整签到逻辑时，fork 若不及时同步，可能导致签到失败或行为与上游不一致。

## 变更内容
1. 增加每日自动同步上游 `main` 分支更新的 GitHub Actions 工作流
2. 调整保活工作流，将空提交推送到独立分支，避免污染 `main` 影响上游同步

## 影响范围
- **模块:** ci
- **文件:**
  - `.github/workflows/sync-upstream.yml`
  - `.github/workflows/auto_push.yml`
  - `README.md`
- **API:** 无
- **数据:** 无

## 核心场景

### 需求: 每日同步上游更新
**模块:** ci
每日将上游仓库的 `main` 更新同步到当前 fork 的 `main`。

#### 场景: 定时同步
到达 cron 时间或手动触发后：
- 拉取上游 `main`
- 尝试 fast-forward 合并；如存在自定义提交则普通 merge
- 有更新时推送到当前仓库 `main`

#### 场景: 同步冲突处理
当 fork 的 `main` 与上游发生冲突时：
- 工作流失败并保留日志
- 由维护者手动处理冲突并重新触发同步

## 风险评估
- **风险:** fork 对 `main` 做了自定义修改会导致 merge commit 或冲突
- **缓解:** 保活提交改为推送到 `keepalive` 分支；同步工作流优先 fast-forward，冲突时显式失败便于人工介入
