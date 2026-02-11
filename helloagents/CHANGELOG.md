# Changelog

本文件记录项目所有重要变更。
格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/),
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### 新增
- 增加 GitHub Actions 上游同步工作流（每日自动从上游仓库同步 `main` 分支）。

### 变更
- 调整 GitHub Actions 保活策略：空提交推送到 `keepalive` 分支，避免污染 `main`。
