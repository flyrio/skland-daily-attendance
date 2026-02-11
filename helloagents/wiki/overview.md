# skland-daily-attendance

> 本文件包含项目级别的核心信息。详细的模块文档见 `modules/` 目录。

---

## 1. 项目概述

### 目标与背景
提供森空岛自动签到能力，支持多账号与通知推送，并可运行在 GitHub Actions、Docker、Cloudflare Workers 等环境。

### 范围
- **范围内:** 定时执行签到任务、失败重试、状态持久化、推送通知
- **范围外:** 提供完整的 Web UI 管理后台、开放的公共 HTTP API

### 干系人
- **负责人:** 仓库维护者/使用者

---

## 2. 模块索引

| 模块名称 | 职责 | 状态 | 文档 |
|---------|------|------|------|
| tasks | Nitro 定时任务入口（如 `attendance`） | ✅稳定 | [tasks](modules/tasks.md) |
| utils | 签到逻辑与通用工具（重试、通知、格式化等） | ✅稳定 | [utils](modules/utils.md) |
| plugins | Nitro 插件（运行时/存储等集成点） | 🚧开发中 | [plugins](modules/plugins.md) |
| scripts | 用于 GitHub Actions 的脚本入口 | ✅稳定 | [scripts](modules/scripts.md) |
| routes | 最小 HTTP 路由（健康检查/占位） | ✅稳定 | [routes](modules/routes.md) |
| ci | GitHub Actions 工作流（签到/保活/同步等） | ✅稳定 | [ci](modules/ci.md) |

---

## 3. 快速链接
- [技术约定](../project.md)
- [架构设计](arch.md)
- [API 手册](api.md)
- [数据模型](data.md)
- [变更历史](../history/index.md)
