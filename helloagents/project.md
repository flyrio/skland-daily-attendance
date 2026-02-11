# 项目技术约定

---

## 技术栈
- **核心:** TypeScript / Nitro
- **运行时:** Node.js（本地/容器）与 Cloudflare Workers（通过 Wrangler）
- **包管理:** pnpm（见 `package.json#packageManager`）

---

## 开发约定
- **代码规范:** ESLint（见 `eslint.config.js`）
- **命名约定:** 以现有代码为准；文件名与目录结构保持一致

---

## 错误与日志
- **策略:** 任务执行过程中汇总统计并通过通知渠道推送
- **日志:** 以任务输出与通知内容为主

---

## 测试与流程
- **测试:** 当前未内置独立测试套件（以 GitHub Actions 运行结果与手动验证为准）
- **提交:** 建议遵循 Conventional Commits（如 `chore:` / `fix:` / `feat:`）
