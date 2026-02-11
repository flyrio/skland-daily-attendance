# utils

## 目的
提供签到相关的通用工具函数与核心逻辑抽象。

## 模块概述
- **职责:** 重试、通知收集、签到 handler 注册、key 生成与格式化等
- **状态:** ✅稳定
- **最后更新:** 2026-02-10

## 数据模型

### kv:attendance:{tokenHash}:{YYYY-MM-DD}
用于记录每日签到状态（上海时区）。

## 依赖
- Web Crypto（`crypto.subtle`）

## 变更历史
- （暂无）
