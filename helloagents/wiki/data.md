# 数据模型

## 概述

本项目主要数据为“每日是否已签到”的状态，用于避免同一账号在同一天重复签到。

持久化通过 Nitro 的 `useStorage()`（unstorage）完成，底层可切换多种驱动（本地文件、Redis、Cloudflare KV 等）。

---

## KV 键空间

### kv:attendance:{tokenHash}:{YYYY-MM-DD}

**描述:** 记录某个 token 在某一天（上海时区）是否已完成签到。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| tokenHash | string | 非空 | token 的 SHA-256 hex |
| YYYY-MM-DD | string | 非空 | 上海时区日期 |

**值:** boolean（`true` 表示当日已签到且本次执行未出现角色失败）
