# Tailwind CSS 规范

## 1. 适用范围

本规范适用于本项目全部前端页面、布局、组件、业务控件与主题样式实现。

本项目固定技术栈：

- React
- Next.js
- Tailwind CSS

`Tailwind CSS` 是本项目唯一主样式方案。组件样式必须优先通过 Tailwind utility class 与设计 token 实现。

---

## 2. 核心原则

### 2.1 语义化优先

组件中使用的颜色、边框、阴影、字号、间距，必须优先引用语义 token，而不是直接写视觉值。

正确：

```tsx
<button className="bg-accent text-on-accent border-border-subtle" />
```

错误：

```tsx
<button className="bg-[#12C17A] text-white border-[#D7E0E7]" />
```

### 2.2 移动端优先

默认样式先覆盖移动端，再通过断点增强到平板和桌面。

正确：

```tsx
<div className="grid grid-cols-1 gap-4 lg:grid-cols-3" />
```

错误：

```tsx
<div className="grid grid-cols-3 gap-4 max-lg:grid-cols-1" />
```

### 2.3 主题切换不改组件结构

主题变化应通过 token 或主题变量解决，不能为 light / dark 各写一套组件。

### 2.4 状态完整

交互控件至少要定义这些状态：

- 默认
- hover
- focus-visible
- active
- disabled

输入类控件还应支持：

- error
- success
- readonly

### 2.5 多语言友好

控件样式必须容纳长文案，不允许因为文案变长导致布局塌陷。

推荐使用：

- `min-w-0`
- `w-full`
- `flex-1`
- `truncate` 仅用于明确允许截断的场景
- `break-words` / `whitespace-normal` 用于长文本

---

## 3. 多主题方案

## 3.1 统一方案

本项目统一采用：

- `html.dark` 控制明暗模式
- CSS Variables 承载主题 token
- Tailwind 语义 token 映射到 CSS Variables

即：

1. 主题状态挂在根节点
2. 颜色值定义在全局变量中
3. 组件只使用语义 class，不直接依赖具体色值

## 3.2 推荐目录职责

- `app/globals.css`
  - 全局 reset
  - CSS 变量定义
  - `:root` / `.dark` token
- `tailwind.config.ts`
  - 将语义颜色、阴影、圆角、spacing 映射到变量
- 组件文件
  - 只写 `className`
  - 不直接写主题色值

## 3.3 主题变量示例

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --bg-app: 244 246 248;
    --bg-surface: 255 255 255;
    --text-primary: 15 23 32;
    --text-muted: 102 119 133;
    --border-subtle: 215 224 231;
    --accent: 18 193 122;
    --on-accent: 11 17 20;
    --danger: 220 38 38;
    --warning: 245 158 11;
    --success: 22 163 74;
  }

  .dark {
    --bg-app: 11 17 20;
    --bg-surface: 18 26 31;
    --text-primary: 234 240 244;
    --text-muted: 142 160 173;
    --border-subtle: 38 52 60;
    --accent: 41 217 140;
    --on-accent: 5 8 10;
    --danger: 248 113 113;
    --warning: 251 191 36;
    --success: 74 222 128;
  }
}
```

## 3.4 Tailwind 语义映射示例

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        app: "rgb(var(--bg-app) / <alpha-value>)",
        surface: "rgb(var(--bg-surface) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        text: {
          primary: "rgb(var(--text-primary) / <alpha-value>)",
          muted: "rgb(var(--text-muted) / <alpha-value>)",
        },
        border: {
          subtle: "rgb(var(--border-subtle) / <alpha-value>)",
        },
        on: {
          accent: "rgb(var(--on-accent) / <alpha-value>)",
        },
      },
    },
  },
};

export default config;
```

## 3.5 主题规范

- 组件内部不允许直接写 light / dark 两套颜色值
- 明暗主题优先通过 token 切换
- 仅当结构在暗色下必须变化时，才允许少量使用 `dark:`
- 新增主题时，只扩展 token，不改组件实现

---

## 4. 如何编写控件 CSS 样式

## 4.1 基本写法

控件样式应直接写在组件 `className` 中，顺序保持稳定。

推荐顺序：

1. 布局
2. 尺寸
3. 间距
4. 排版
5. 前景色 / 背景色
6. 边框
7. 阴影 / 透明度
8. 动画
9. 状态

示例：

```tsx
<button
  className="
    inline-flex items-center justify-center
    h-10 px-4 gap-2
    text-sm font-medium
    text-on-accent bg-accent
    border border-transparent
    shadow-sm
    transition-colors
    hover:bg-accent/90
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30
    disabled:cursor-not-allowed disabled:opacity-50
  "
>
  保存
</button>
```

## 4.2 重复样式必须抽象

当同一组 class 在两个以上组件中重复出现时，必须抽成以下之一：

- 组件
- 局部 variant map
- `cn()`/组合函数

不允许复制粘贴超长 class 字符串。

## 4.3 按“根节点 + 槽位 + 状态”设计控件

每个控件至少要明确：

- 根节点样式
- 图标槽位样式
- 文本槽位样式
- 状态样式

示例：

```tsx
const buttonVariants = {
  primary:
    "bg-accent text-on-accent hover:bg-accent/90 focus-visible:ring-accent/30",
  secondary:
    "bg-surface text-text-primary border border-border-subtle hover:bg-black/5 dark:hover:bg-white/5",
  danger:
    "bg-danger text-white hover:bg-danger/90 focus-visible:ring-danger/30",
} as const;

const buttonSizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
} as const;
```

## 4.4 输入控件规范

输入控件必须具备：

- 明确高度
- 语义边框
- 占位文本颜色
- focus-visible 状态
- disabled 状态
- error 状态

推荐示例：

```tsx
<input
  className="
    h-10 w-full rounded-md
    border border-border-subtle bg-surface px-3
    text-sm text-text-primary placeholder:text-text-muted
    transition-colors
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30
    disabled:cursor-not-allowed disabled:opacity-50
    aria-[invalid=true]:border-danger aria-[invalid=true]:focus-visible:ring-danger/30
  "
/>
```

## 4.5 卡片类控件规范

卡片不是“随便一个白底框”。必须明确：

- 背景
- 边框
- 内边距
- 标题层级
- 内容密度

推荐示例：

```tsx
<section className="rounded-xl border border-border-subtle bg-surface p-5">
  <h3 className="text-sm font-semibold text-text-primary">Gateway 状态</h3>
  <p className="mt-2 text-sm text-text-muted">已连接，延迟稳定。</p>
</section>
```

## 4.6 图标按钮规范

图标按钮不能只看起来像按钮，必须保留可访问性与点击热区。

推荐示例：

```tsx
<button
  type="button"
  className="
    inline-flex size-10 items-center justify-center
    rounded-md border border-border-subtle bg-surface
    text-text-primary transition-colors
    hover:bg-black/5 dark:hover:bg-white/5
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30
  "
  aria-label="刷新"
/>
```

---

## 5. 推荐写法

## 5.1 推荐使用语义 token

允许：

- `bg-surface`
- `text-text-primary`
- `border-border-subtle`
- `bg-accent`

不推荐直接使用：

- `bg-white`
- `text-black`
- `border-gray-200`

除非是非常明确的、与主题无关的语义，例如纯黑遮罩透明度场景。

## 5.2 推荐使用状态属性驱动样式

优先使用：

- `disabled:`
- `aria-[invalid=true]:`
- `data-[state=open]:`
- `data-[active=true]:`

而不是在组件里手工拼很多布尔分支。

## 5.3 推荐用组件封装复杂视觉模式

符合以下任一情况必须封装：

- 有多种 variant
- 有多种 size
- 有一致的状态规范
- 被三个以上页面复用

## 5.4 推荐用少量全局基础类

只允许在 `@layer base` 或极少量 `@layer components` 中定义：

- html/body 基础背景与文字
- heading / prose 基础排版
- 第三方库必要覆盖

---

## 6. 明确禁止的写法

以下写法视为明确禁止。

## 6.1 禁止在 JSX 中写原始颜色值

禁止：

```tsx
<div className="bg-[#12C17A] text-[#0F1720]" />
```

原因：

- 无法统一主题
- 难以维护
- 破坏设计 token 体系

## 6.2 禁止随意使用 arbitrary value

禁止：

```tsx
<div className="mt-[13px] h-[37px] rounded-[11px]" />
```

只允许在以下场景使用 arbitrary value：

- 对接外部嵌入容器的精确尺寸
- 设计稿存在明确不可替代的特殊值
- Tailwind 默认尺度确实无法表达，且已通过评审

即便允许，也应优先沉淀到 token 或 theme 扩展中。

## 6.3 禁止动态拼接 Tailwind 类名

禁止：

```tsx
<div className={`bg-${color} text-${tone}`} />
```

原因：

- Tailwind 静态扫描无法可靠收集
- 构建后可能丢样式

正确做法：

```tsx
const toneMap = {
  neutral: "bg-surface text-text-primary",
  accent: "bg-accent text-on-accent",
} as const;

<div className={toneMap[tone]} />;
```

## 6.4 禁止业务组件依赖 `style={{ ... }}` 写核心样式

禁止：

```tsx
<button style={{ background: "#12C17A", color: "#fff" }} />
```

允许的例外：

- 运行时计算的 CSS 变量注入
- 动态 canvas 坐标
- 第三方组件必须走 inline style 的少数场景

## 6.5 禁止滥用 `@apply`

禁止把业务组件主要样式写成：

```css
.btn-primary {
  @apply inline-flex h-10 items-center rounded-md bg-accent px-4 text-on-accent;
}
```

原因：

- 样式来源分散
- 组件难追踪
- 破坏 Tailwind 组件内聚性

`@apply` 只允许用于：

- reset
- 少量通用排版
- 第三方库覆盖

## 6.6 禁止使用 `!important` 或 `!` utility 作为常规手段

禁止：

- `!mt-0`
- `!bg-accent`
- CSS 里的 `!important`

除非是覆盖无法控制的第三方样式，并且必须写注释说明原因。

## 6.7 禁止去掉焦点可视态

禁止：

```tsx
<button className="outline-none" />
```

如果移除了浏览器默认 outline，必须补上等价甚至更清晰的 `focus-visible` 样式。

## 6.8 禁止用全局选择器写业务页面样式

禁止：

```css
.dashboard .card .title {
  color: red;
}
```

禁止：

```css
main > div > div > div {
  padding: 12px;
}
```

原因：

- 结构耦合严重
- 页面重构后极易失效

## 6.9 禁止为多语言写死控件宽度

禁止：

```tsx
<button className="w-[96px]" />
```

适用于：

- 按钮
- 标签
- Tabs
- Header 工具区

因为不同语言长度差异会直接打坏布局。

## 6.10 禁止把主题差异写进业务判断分支

禁止：

```tsx
const cls = theme === "dark" ? "bg-black text-white" : "bg-white text-black";
```

优先改成：

- 主题变量
- 语义 token
- 必要时用 `dark:` 做结构微调

---

## 7. 控件样式模板

## 7.1 Button

```tsx
type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-accent text-on-accent hover:bg-accent/90 focus-visible:ring-accent/30",
  secondary:
    "border-border-subtle bg-surface text-text-primary hover:bg-black/5 dark:hover:bg-white/5 focus-visible:ring-accent/20",
  danger:
    "border-transparent bg-danger text-white hover:bg-danger/90 focus-visible:ring-danger/30",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3",
  md: "h-10 px-4",
  lg: "h-11 px-5",
};
```

## 7.2 Input

```tsx
const inputClass =
  "h-10 w-full rounded-md border border-border-subtle bg-surface px-3 " +
  "text-sm text-text-primary placeholder:text-text-muted " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 " +
  "disabled:cursor-not-allowed disabled:opacity-50 " +
  "aria-[invalid=true]:border-danger aria-[invalid=true]:focus-visible:ring-danger/30";
```

## 7.3 Card

```tsx
const cardClass =
  "rounded-xl border border-border-subtle bg-surface p-5";
```

## 7.4 Badge

```tsx
const badgeClassMap = {
  neutral: "bg-surface text-text-primary border border-border-subtle",
  success: "bg-success/10 text-success border border-success/20",
  warning: "bg-warning/10 text-warning border border-warning/20",
  danger: "bg-danger/10 text-danger border border-danger/20",
} as const;
```

---

## 8. 审查清单

提交前必须检查：

- 是否使用了语义 token，而不是原始色值
- 是否具备 hover / focus-visible / disabled 状态
- 是否兼容 dark 模式
- 是否兼容长文案与多语言
- 是否避免了无意义 arbitrary value
- 是否避免了动态拼接 Tailwind 类名
- 是否没有滥用 `@apply`
- 是否没有移除焦点可视态
- 是否没有新增全局业务样式污染

---

## 9. 结论

本项目的 Tailwind CSS 使用原则是：

- token 驱动
- 组件内聚
- 主题解耦
- 多语言友好
- 状态完整
- 明确禁止魔法值、动态拼接、全局污染和 `@apply` 滥用

后续所有前端控件样式，必须按本规范执行。
