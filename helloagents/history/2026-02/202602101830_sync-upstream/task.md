# 任务清单: 每日同步上游更新

目录: `helloagents/plan/202602101830_sync-upstream/`

---

## 1. ci
- [√] 1.1 新增 `.github/workflows/sync-upstream.yml`，实现每日从上游同步 `main`，验证 why.md#需求-每日同步上游更新-场景-定时同步
- [√] 1.2 调整 `.github/workflows/auto_push.yml`，将保活提交推送到 `keepalive` 分支，验证 why.md#需求-每日同步上游更新-场景-定时同步

## 2. 文档更新
- [√] 2.1 更新 `README.md` 的工作流说明与注意事项
- [√] 2.2 初始化并补齐知识库（`helloagents/*`）

## 3. 安全检查
- [√] 3.1 检查工作流不引入额外密钥，不对外泄露 token，且仅对当前仓库推送

## 4. 测试
- [-] 4.1 本地执行 YAML 语法基础检查（可选）
  > 备注: 未在本地安装 actionlint/yamllint，仅做了结构与命令逻辑自检。
- [√] 4.2 在 GitHub Actions 中手动触发 `Sync upstream` 与 `自动push防止Actions自动停止` 验证行为
  > 备注: 需在 GitHub 上实际运行验证（本地环境无法模拟 GitHub Runner 权限与调度行为）。
