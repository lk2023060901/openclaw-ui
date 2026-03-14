# 前端编码规范

## 1. 文档目的

本规范用于统一本项目的前端实现方式，约束页面、组件、状态、路由、样式、主题和国际化的编码标准。

本规范是项目级约束。所有新增页面、控件、模块和重构代码，都必须遵守本规范。

---

## 2. 固定技术栈

本项目的前端技术栈固定如下，不可变动：

- React
- Next.js
- Tailwind CSS

说明：

- 前端框架必须使用 React
- 应用框架必须使用 Next.js
- 样式系统必须使用 Tailwind CSS

明确禁止：

- 替换为 Vue、Svelte、Angular 等其它前端框架
- 替换为 Remix、Nuxt、Astro 等其它应用框架
- 替换为 CSS Modules、Styled Components、Emotion 等其它主样式体系

---

## 3. 目标与原则

前端代码必须满足以下目标：

- 可维护
- 可扩展
- 可复用
- 可测试
- 多语言友好
- 多主题友好
- 对移动端 H5 与桌面 Web 都具备良好适配能力

核心原则：

1. Server First
2. 组件单一职责
3. 样式 token 化
4. 状态分层
5. 业务逻辑与 UI 分离
6. 国际化与主题能力从一开始就纳入实现

---

## 4. 适用终端

本规范中的“移动端”统一指：

- 手机浏览器中的响应式 H5 页面

不包括：

- 微信小程序
- 支付宝小程序
- 其它小程序容器

因此本项目的前端实现目标是：

- 响应式 Web
- 支持手机、平板、桌面浏览器

---

## 5. 目录组织规范

推荐目录结构如下：

```text
src/
  app/
    (dashboard)/
    api/
    layout.tsx
    page.tsx
    loading.tsx
    error.tsx
  components/
    ui/
    layout/
    shared/
  features/
    dashboard/
    agent/
    company/
    skill/
    community/
    log/
    monitor/
  hooks/
  lib/
    api/
    format/
    theme/
    i18n/
    utils/
  types/
  styles/
```

目录职责：

- `app/`
  - Next.js App Router 入口
  - 页面、布局、路由级 loading/error
- `components/ui/`
  - 纯基础控件
  - 如 Button、Input、Tabs、Dialog、Badge
- `components/layout/`
  - Header、Sidebar、PageShell、Topbar 等布局组件
- `components/shared/`
  - 跨业务共享但不属于基础控件的通用组件
- `features/`
  - 以业务域组织页面逻辑、hooks、数据转换、局部组件
- `lib/`
  - 工具函数、格式化、主题、国际化、API 封装
- `types/`
  - 共享类型定义
- `styles/`
  - 极少量全局样式、token、动画变量

明确禁止：

- 所有组件都堆在 `components/` 根目录
- 所有业务逻辑都堆在页面文件里
- 把 API 调用、格式化、状态处理直接塞进 JSX

---

## 6. Next.js 规范

## 6.1 必须使用 App Router

页面组织统一基于 Next.js App Router。

推荐：

- `app/dashboard/page.tsx`
- `app/agent/page.tsx`
- `app/company/page.tsx`
- `app/skill/page.tsx`
- `app/community/page.tsx`
- `app/log/page.tsx`
- `app/monitor/page.tsx`

## 6.2 Server Component 默认优先

默认使用 Server Component。

只有在以下情况才允许使用 Client Component：

- 需要浏览器事件交互
- 需要 `useState` / `useReducer`
- 需要 `useEffect`
- 需要访问 `window` / `document`
- 需要图表、拖拽、客户端订阅

原则：

- 页面尽量服务端渲染
- 交互局部下沉到 Client Component

## 6.3 不允许滥用 `"use client"`

明确禁止：

- 在页面根组件上无理由添加 `"use client"`
- 为了省事把整页都变成 Client Component

正确做法：

- Server Component 负责数据组织
- Client Component 负责交互和局部状态

## 6.4 数据获取位置

推荐顺序：

1. Server Component 直接获取首屏数据
2. 客户端交互数据在 feature 层或 client hook 中获取
3. API 请求统一经过 `lib/api/`

明确禁止：

- 在多个组件中重复请求同一数据
- 在组件内部直接散落 `fetch` 调用
- 在 JSX 中边渲染边拼请求参数和错误处理

## 6.5 路由级状态页

每个主要页面应支持：

- `loading.tsx`
- `error.tsx`
- 空态
- 权限态

不允许出现：

- 页面空白但没有解释
- 加载失败却没有错误提示

---

## 7. React 组件规范

## 7.1 单一职责

每个组件只解决一个主要问题。

例如：

- `SidebarNav` 只负责侧栏导航
- `VersionBadge` 只负责版本状态展示
- `GatewayStatusCard` 只负责网关状态展示

明确禁止：

- 一个组件同时负责请求数据、处理权限、渲染复杂布局、做弹窗和表单校验

## 7.2 Props 必须明确类型

所有组件 props 必须显式定义类型。

推荐：

```tsx
type StatusBadgeProps = {
  status: "online" | "offline" | "warning";
  label: string;
};
```

明确禁止：

- `props: any`
- 大量隐式透传但没有类型说明

## 7.3 控件组件要有稳定 API

基础控件应统一定义：

- `variant`
- `size`
- `disabled`
- `loading`
- `className`

例如：

```tsx
type ButtonProps = {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};
```

## 7.4 组件拆分标准

出现以下情况必须拆分：

- JSX 超过约 120 行且存在多个视觉区块
- 一个组件出现多个条件分支区块
- 同一结构被多个页面复用
- 一组 UI 已形成稳定设计模式

## 7.5 事件处理规范

事件处理函数不要内联堆复杂逻辑。

推荐：

```tsx
function handleRefresh() {
  void refreshGatewayStatus();
}
```

不推荐：

```tsx
<button
  onClick={() => {
    setLoading(true);
    doSomething();
    doAnotherThing();
    closeModal();
  }}
/>
```

---

## 8. Hooks 与状态管理规范

## 8.1 状态分层

状态应按层级存放：

- 局部 UI 状态：组件内部
- 页面状态：页面或 feature hook
- URL 状态：查询参数或路径
- 服务端数据状态：数据层 hook
- 全局状态：仅用于真正跨页面共享的信息

## 8.2 默认不引入额外全局状态库

在没有明确必要前，优先使用：

- `useState`
- `useReducer`
- `useContext`

只有出现跨页面、跨模块、跨布局的复杂共享状态时，才允许评估额外状态方案。

## 8.3 副作用规范

`useEffect` 只能处理：

- 浏览器订阅
- 定时器
- DOM 绑定
- 非同步渲染副作用

明确禁止：

- 把纯计算逻辑写进 `useEffect`
- 用 `useEffect` 同步派生状态
- 为了请求数据而在多个层级重复写 `useEffect`

## 8.4 派生状态不落地

能通过 props 或已有状态计算出来的值，不要再存一份 state。

正确：

```tsx
const isEmpty = items.length === 0;
```

错误：

```tsx
const [isEmpty, setIsEmpty] = useState(false);
useEffect(() => {
  setIsEmpty(items.length === 0);
}, [items]);
```

---

## 9. API 与数据层规范

## 9.1 API 调用必须集中封装

所有请求统一经过 `lib/api/` 或 feature 自己的数据层。

推荐：

```text
lib/api/client.ts
lib/api/agent.ts
lib/api/company.ts
features/dashboard/api.ts
```

明确禁止：

- 页面里直接散落 `fetch("/api/...")`
- 不同组件重复写同一请求

## 9.2 请求结果必须区分三态

所有数据展示至少处理：

- loading
- empty
- error

不允许只有成功态。

## 9.3 响应类型必须明确

服务端返回值必须定义类型，前端禁止裸用 `unknown` 结果直接渲染。

## 9.4 数据转换与格式化分层

推荐：

- 原始接口类型放 `types/`
- 数据映射放 `lib/` 或 `features/.../mapper.ts`
- 时间/数字/文件大小格式化放 `lib/format/`

---

## 10. Tailwind CSS 规范

Tailwind 的具体规则以 `tailwind-css-standards.md` 为准。

本规范补充以下项目级要求：

- 样式优先写在组件 `className`
- 使用语义 token，不直接写原始颜色值
- 明暗主题通过 token 和 `.dark` 处理
- 多语言场景下避免写死宽度
- 重复 class 组合必须抽象为 variant 或组件

---

## 11. 控件规范

## 11.1 基础控件必须统一

以下控件必须沉淀到 `components/ui/`，不能每页各写一版：

- Button
- Input
- Textarea
- Select
- Checkbox
- Radio
- Switch
- Badge
- Tabs
- Dialog
- Drawer
- Table
- Pagination
- Tooltip
- Dropdown

## 11.2 页面骨架组件统一

以下布局组件应统一：

- AppShell
- Sidebar
- Header
- PageHeader
- FilterBar
- SectionCard
- EmptyState
- ErrorState

## 11.3 控件必须支持状态

基础控件需明确支持：

- default
- hover
- focus-visible
- active
- disabled

必要时支持：

- loading
- selected
- invalid
- success

---

## 12. 多语言规范

## 12.1 文案不得写死在业务组件中

页面文案、按钮文案、状态文案必须经过统一国际化层管理。

明确禁止：

- 组件内部直接硬编码中英文混杂的 UI 文案
- 不经过 i18n 层直接输出面向用户的长文案

## 12.2 日期时间必须本地化

日期、时间、数字、百分比必须使用 locale-aware 方案。

推荐：

- `Intl.DateTimeFormat`
- `Intl.NumberFormat`

例如：

- 中文：`2026年03月14日 10:42`
- 英文：`Mar 14, 2026 10:42 AM`

## 12.3 多语言布局要求

所有 Header、Button、Tab、Filter、Badge 都必须考虑长文案。

必须避免：

- 固定宽度按钮
- 固定宽度 tab 文案
- 一行无法换行的说明文本

---

## 13. 多主题规范

## 13.1 主题基于 token，不基于业务分支

组件不允许自行判断：

- light 用什么色
- dark 用什么色

这些必须由 token 提供。

## 13.2 主题切换不改变信息架构

主题只能改变：

- 颜色
- 阴影
- 边框对比度
- 局部强调方式

不应改变：

- 页面结构
- 信息层级
- 交互路径

## 13.3 主题必须覆盖状态色

以下状态在 light / dark 下都必须清晰可见：

- success
- warning
- error
- info
- disabled
- focus

---

## 14. 可访问性规范

必须满足以下要求：

- 所有交互元素可键盘访问
- 自定义按钮、图标按钮必须有可访问名称
- 焦点态可见
- 文本与背景有足够对比度
- 表单控件有 label
- 错误提示与控件关联

明确禁止：

- 去掉焦点样式
- 只靠颜色表达状态
- 图标按钮没有 `aria-label`

---

## 15. 性能规范

## 15.1 减少无意义客户端组件

能放服务端的，不放客户端。

## 15.2 列表与大块渲染要控制复杂度

当页面存在：

- 大量日志
- 大量表格数据
- 长列表

必须考虑：

- 分页
- 增量加载
- 虚拟滚动
- 服务端过滤

## 15.3 图片和图标规范

- 图片使用 Next.js 推荐方案处理
- 图标统一来源
- 不允许每页引入一套不同风格图标

## 15.4 不做过度动画

允许少量必要反馈动画，不允许：

- 大面积持续动画
- 影响可读性的背景动效
- 与业务无关的复杂过渡

---

## 16. 命名规范

## 16.1 文件命名

推荐：

- 组件文件：`PascalCase.tsx`
- hooks：`useXxx.ts`
- 工具函数：`camelCase.ts`
- 常量：`constants.ts`

## 16.2 组件命名

组件命名必须体现职责。

正确：

- `DashboardHeader`
- `AgentRoster`
- `CompanyLocaleCard`
- `GatewayStatusBadge`

错误：

- `InfoBox`
- `ThingCard`
- `TempPanel`

## 16.3 CSS token 命名

必须使用语义命名，不用视觉命名。

正确：

- `bg-surface`
- `text-primary`
- `border-subtle`
- `accent`

错误：

- `green-1`
- `gray-light-2`
- `panel-white`

---

## 17. 明确禁止的实现方式

以下写法明确禁止：

- 页面文件里直接堆所有业务逻辑与 JSX
- 大量使用 `any`
- 在 Client Component 中完成本可服务端完成的数据组织
- 动态拼接 Tailwind class
- 在 JSX 中直接写原始颜色值
- 通过 inline style 写核心业务样式
- 滥用 `useEffect`
- 复制粘贴多个版本的相似组件
- 为多语言文案写死控件宽度
- 为深浅主题各写一套重复组件
- 去掉焦点态
- 把 API 请求散落在多个组件中
- 没有 loading / empty / error 三态

---

## 18. 页面实现标准

每个页面至少具备：

- PageHeader
- 主内容区
- loading 状态
- empty 状态
- error 状态
- 权限或受限状态（如适用）

本项目的关键页面包括：

- Dashboard
- Agent
- Company
- Skill
- Community
- Log
- Monitor

这些页面应共享统一的：

- Sidebar
- Header
- 主题体系
- 国际化体系
- 基础控件体系

---

## 19. 代码审查清单

提交前必须检查：

- 是否遵守固定技术栈
- 是否优先使用 Server Component
- 是否把交互逻辑限制在必要的 Client Component 中
- 是否按 feature 组织代码
- 是否没有使用 `any`
- 是否没有把请求直接散落在组件里
- 是否处理了 loading / empty / error
- 是否遵守 Tailwind 规范
- 是否兼容多语言
- 是否兼容多主题
- 是否可键盘访问
- 是否具备清晰焦点态
- 是否避免重复组件和重复样式

---

## 20. 结论

本项目的前端编码标准可以总结为：

- React 负责组件化
- Next.js 负责路由、渲染与页面组织
- Tailwind CSS 负责统一样式系统
- Server First，Client 按需下沉
- 业务按 feature 分层
- 样式必须 token 化
- 页面必须天然支持多语言与多主题
- 明确禁止魔法值、重复实现、动态 class 拼接和滥用副作用

后续所有前端实现，必须按本规范执行。
