<h2 id="t7">7. @-Rules 与指令 (@-Rules and Directives)</h2>

Sass 支持所有的 CSS3 @-Rules，以及 Sass 特有的 “指令”（directives）。这一节会详细解释，更多资料请查看 [控制指令 (control directives)](#8) 与 [混合指令 (mixin directives)](#9) 两个部分。

<h3 id="t7-1">7.1. @import</h3>

Sass 拓展了 `@import` 的功能，允许其导入 SCSS 或 Sass 文件。被导入的文件将合并编译到同一个 CSS 文件中，另外，被导入的文件中所包含的变量或者混合指令 (mixin) 都可以在导入的文件中使用。

Sass 在当前地址，或 Rack, Rails, Merb 的 Sass 文件地址寻找 Sass 文件，如果需要设定其他地址，可以用 `:load_paths` 选项，或者在命令行中输入 `--load-path` 命令。

通常，`@import` 寻找 Sass 文件并将其导入，但在以下情况下，`@import` 仅作为普通的 CSS 语句，不会导入任何 Sass 文件。

- 文件拓展名是 `.css`；
- 文件名以 `http://` 开头；
- 文件名是 `url()`；
- `@import` 包含 media queries。

如果不在上述情况内，文件的拓展名是 `.scss` 或 `.sass`，则导入成功。没有指定拓展名，Sass 将会试着寻找文件名相同，拓展名为 `.scss` 或 `.sass` 的文件并将其导入。

```scss
@import "foo.scss";
```

或

```scss
@import "foo";
```

都会导入文件 foo.scss，但是

```scss
@import "foo.css";
@import "foo" screen;
@import "http://foo.com/bar";
@import url(foo);
```

编译为

```css
@import "foo.css";
@import "foo" screen;
@import "http://foo.com/bar";
@import url(foo);
```

Sass 允许同时导入多个文件，例如同时导入 rounded-corners 与 text-shadow 两个文件：

```scss
@import "rounded-corners", "text-shadow";
```

导入文件也可以使用 `#{ }` 插值语句，但不是通过变量动态导入 Sass 文件，只能作用于 CSS 的 `url()` 导入方式：

```scss
$family: unquote("Droid+Sans");
@import url("http://fonts.googleapis.com/css?family=\#{$family}");
```

编译为

```css
@import url("http://fonts.googleapis.com/css?family=Droid+Sans");
```

<h4 id="7-1-1">7.1.1. 分音 (Partials)</h4>

如果需要导入 SCSS 或者 Sass 文件，但又不希望将其编译为 CSS，只需要在文件名前添加下划线，这样会告诉 Sass 不要编译这些文件，但导入语句中却不需要添加下划线。

例如，将文件命名为 `_colors.scss`，便不会编译 `_colours.css` 文件。

```scss
@import "colors";
```

上面的例子，导入的其实是 `_colors.scss` 文件

注意，不可以同时存在添加下划线与未添加下划线的同名文件，添加下划线的文件将会被忽略。

<h4 id="7-1-2">7.1.2. 嵌套 @import</h4>

大多数情况下，一般在文件的最外层（不在嵌套规则内）使用 `@import`，其实，也可以将 `@import` 嵌套进 CSS 样式或者 `@media` 中，与平时的用法效果相同，只是这样导入的样式只能出现在嵌套的层中。

假设 example.scss 文件包含以下样式：

```scss
.example {
  color: red;
}
```

然后导入到 `#main` 样式内

```scss
#main {
  @import "example";
}
```

将会被编译为

```css
#main .example {
  color: red;
}
```

> Directives that are only allowed at the base level of a document, like @mixin or @charset, are not allowed in files that are @imported in a nested context. 这一句不理解

不可以在混合指令 (mixin) 或控制指令 (control directives) 中嵌套 `@import`。

<h3 id="t7-2">7.2. @media</h3>

Sass 中 `@media` 指令与 CSS 中用法一样，只是增加了一点额外的功能：允许其在 CSS 规则中嵌套。如果 `@media` 嵌套在 CSS 规则内，编译时，`@media` 将被编译到文件的最外层，包含嵌套的父选择器。这个功能让 `@media` 用起来更方便，不需要重复使用选择器，也不会打乱 CSS 的书写流程。

```scss
.sidebar {
  width: 300px;
  @media screen and (orientation: landscape) {
    width: 500px;
  }
}
```

编译为

```css
.sidebar {
  width: 300px; }
  @media screen and (orientation: landscape) {
    .sidebar {
      width: 500px; } }
```

`@media` 的 queries 允许互相嵌套使用，编译时，Sass 自动添加 `and`

```scss
@media screen {
  .sidebar {
    @media (orientation: landscape) {
      width: 500px;
    }
  }
}
```

编译为

```css
@media screen and (orientation: landscape) {
  .sidebar {
    width: 500px; } }
```

`@media` 甚至可以使用 SassScript（比如变量，函数，以及运算符）代替条件的名称或者值：

```scss
$media: screen;
$feature: -webkit-min-device-pixel-ratio;
$value: 1.5;

@media #{$media} and ($feature: $value) {
  .sidebar {
    width: 500px;
  }
}
```

编译为

```css
@media screen and (-webkit-min-device-pixel-ratio: 1.5) {
  .sidebar {
    width: 500px; } }
```

<h3 id="t7-3">7.3. @extend</h3>

在设计网页的时候常常遇到这种情况：一个元素使用的样式与另一个元素完全相同，但又添加了额外的样式。通常会在 HTML 中给元素定义两个 class，一个通用样式，一个特殊样式。假设现在要设计一个普通错误样式与一个严重错误样式，一般会这样写：

```markup
<div class="error seriousError">
  Oh no! You've been hacked!
</div>
```

样式如下

```css
.error {
  border: 1px #f00;
  background-color: #fdd;
}
.seriousError {
  border-width: 3px;
}
```

麻烦的是，这样做必须时刻记住使用 `.seriousError` 时需要参考 `.error` 的样式，带来了很多不变：智能比如加重维护负担，导致 bug，或者给 HTML 添加无语意的样式。使用 `@extend` 可以避免上述情况，告诉 Sass 将一个选择器下的所有样式继承给另一个选择器。

```scss
.error {
  border: 1px #f00;
  background-color: #fdd;
}
.seriousError {
  @extend .error;
  border-width: 3px;
}
```

上面代码的意思是将 `.error` 下的所有样式继承给 `.seriousError`，`border-width: 3px;` 是单独给 `.seriousError` 设定特殊样式，这样，使用 `.seriousError` 的地方可以不再使用 `.error`。

其他使用到 `.error` 的样式也会同样继承给 `.seriousError`，例如，另一个样式 `.error.intrusion` 使用了 `hacked.png` 做背景，`<div class="seriousError intrusion">` 也同样会使用 `hacked.png` 背景。

```css
.error.intrusion {
  background-image: url("/image/hacked.png");
}
```

<h4 id="7-3-1">7.3.1. How it Works</h4>

`@extend` 的作用是将重复使用的样式 (`.error`) 延伸 (extend) 给需要包含这个样式的特殊样式（`.seriousError`），刚刚的例子：

```scss
.error {
  border: 1px #f00;
  background-color: #fdd;
}
.error.intrusion {
  background-image: url("/image/hacked.png");
}
.seriousError {
  @extend .error;
  border-width: 3px;
}
```

编译为

```css
.error, .seriousError {
  border: 1px #f00;
  background-color: #fdd; }

.error.intrusion, .seriousError.intrusion {
  background-image: url("/image/hacked.png"); }

.seriousError {
  border-width: 3px; }
```

当合并选择器时，`@extend` 会很聪明地避免无谓的重复，`.seriousError.seriousError` 将编译为 `.seriousError`，不能匹配任何元素的选择器（比如 `#main#footer` ）也会删除。

<h4 id="7-3-2">7.3.2. 延伸复杂的选择器 (Extending Complex Selectors)</h4>

Class 选择器并不是唯一可以被延伸 (extend) 的，Sass 允许延伸任何定义给单个元素的选择器，比如 `.special.cool`，`a:hover` 或者 `a.user[href^="http://"]` 等，例如：

```scss
.hoverlink {
  @extend a:hover;
}
```

同 class 元素一样，`a:hover` 的样式将继承给 `.hoverlink`。

```scss
.hoverlink {
  @extend a:hover;
}
a:hover {
  text-decoration: underline;
}
```

编译为

```css
a:hover, .hoverlink {
  text-decoration: underline; }
```

与上面 `.error.intrusion` 的例子一样，所有 `a:hover` 的样式将继承给 `.hoverlink`，包括其他使用到 `a:hover` 的样式，例如：

```scss
.hoverlink {
  @extend a:hover;
}
.comment a.user:hover {
  font-weight: bold;
}
```

编译为

```css
.comment a.user:hover, .comment .user.hoverlink {
  font-weight: bold; }
```

<h4 id="7-3-3">7.3.3. 多重延伸 (Multiple Extends)</h4>

同一个选择器可以延伸给多个选择器，它所包含的属性将继承给所有被延伸的选择器：

```scss
.error {
  border: 1px #f00;
  background-color: #fdd;
}
.attention {
  font-size: 3em;
  background-color: #ff0;
}
.seriousError {
  @extend .error;
  @extend .attention;
  border-width: 3px;
}
```

编译为

```css
.error, .seriousError {
  border: 1px #f00;
  background-color: #fdd; }

.attention, .seriousError {
  font-size: 3em;
  background-color: #ff0; }

.seriousError {
  border-width: 3px; }
```

每个 `.seriousError` 将包含 `.error` 与 `.attention` 下的所有样式，这时，后定义的样式享有优先权：`.seriousError` 的背景颜色是 `#ff0` 而不是 `#fdd`，因为 `.attention` 在 `.error` 之后定义。

多重延伸可以使用逗号分隔选择器名，比如 `@extend .error, .attention;` 与 `@extend .error;`  `@extend.attention` 有相同的效果。

<h4 id="7-3-4">7.3.4. 继续延伸 (Chaining Extends)</h4>

当一个选择器延伸给第二个后，可以继续将第二个选择器延伸给第三个，例如：

```scss
.error {
  border: 1px #f00;
  background-color: #fdd;
}
.seriousError {
  @extend .error;
  border-width: 3px;
}
.criticalError {
  @extend .seriousError;
  position: fixed;
  top: 10%;
  bottom: 10%;
  left: 10%;
  right: 10%;
}
```

现在，每个 `.seriousError` 选择器将包含 `.error` 的样式，而 `.criticalError` 不仅包含 `.seriousError` 的样式也会同时包含 `.error` 的所有样式，上面的代码编译为：

```css
.error, .seriousError, .criticalError {
  border: 1px #f00;
  background-color: #fdd; }

.seriousError, .criticalError {
  border-width: 3px; }

.criticalError {
  position: fixed;
  top: 10%;
  bottom: 10%;
  left: 10%;
  right: 10%; }
```

<h4 id="7-3-5">7.3.5. 选择器列 (Selector Sequences)</h4>

暂时不可以将选择器列 (Selector Sequences)，比如 `.foo .bar` 或 `.foo + .bar`，延伸给其他元素，但是，却可以将其他元素延伸给选择器列：

```scss
#fake-links .link {
  @extend a;
}

a {
  color: blue;
  &:hover {
    text-decoration: underline;
  }
}
```

编译为

```css
a, #fake-links .link {
  color: blue; }
  a:hover, #fake-links .link:hover {
    text-decoration: underline; }
```

<h5 id="7-3-5-1">7.3.5.1. 合并选择器列 (Merging Selector Sequences)</h5>

有时会遇到复杂的情况，比如选择器列中的某个元素需要延伸给另一个选择器列，这种情况下，两个选择器列需要合并，比如：

```scss
#admin .tabbar a {
  font-weight: bold;
}
#demo .overview .fakelink {
  @extend a;
}
```

技术上讲能够生成所有匹配条件的结果，但是这样生成的样式表太复杂了，上面这个简单的例子就可能有 10 种结果。所以，Sass 只会编译输出有用的选择器。

当两个列 (sequence) 合并时，如果没有包含相同的选择器，将生成两个新选择器：第一列出现在第二列之前，或者第二列出现在第一列之前：

```scss
#admin .tabbar a {
  font-weight: bold;
}
#demo .overview .fakelink {
  @extend a;
}
```

编译为

```css
#admin .tabbar a,
#admin .tabbar #demo .overview .fakelink,
#demo .overview #admin .tabbar .fakelink {
  font-weight: bold; }
```

如果两个列 (sequence) 包含了相同的选择器，相同部分将会合并在一起，其他部分交替输出。在下面的例子里，两个列都包含 `#admin`，输出结果中它们合并在了一起：

```scss
#admin .tabbar a {
  font-weight: bold;
}
#admin .overview .fakelink {
  @extend a;
}
```

编译为

```css
#admin .tabbar a,
#admin .tabbar .overview .fakelink,
#admin .overview .tabbar .fakelink {
  font-weight: bold; }
```

<h4 id="7-3-6">7.3.6. @extend-Only 选择器 (@extend-Only Selectors)</h4>

有时，需要定义一套样式并不是给某个元素用，而是只通过 `@extend` 指令使用，尤其是在制作 Sass 样式库的时候，希望 Sass 能够忽略用不到的样式。

如果使用普通的 CSS 规则，最后会编译出很多用不到的样式，也容易与其他样式名冲突，所以，Sass 引入了“占位符选择器” (placeholder selectors)，看起来很像普通的 `id` 或 `class` 选择器，只是 `#` 或 `.` 被替换成了 `%`。可以像 class 或者 id 选择器那样使用，当它们单独使用时，不会被编译到 CSS 文件中。

```scss
// This ruleset won't be rendered on its own.
#context a%extreme {
  color: blue;
  font-weight: bold;
  font-size: 2em;
}
```

占位符选择器需要通过延伸指令使用，用法与 class 或者 id 选择器一样，被延伸后，占位符选择器本身不会被编译。

```scss
.notice {
  @extend %extreme;
}
```

编译为

```css
#context a.notice {
  color: blue;
  font-weight: bold;
  font-size: 2em; }
```

<h4 id="7-3-7">7.3.7. `!optional` 声明 (The `!optional` Flag)</h4>

如果 `@extend` 失败会收到错误提示，比如，这样写 `a.important {@extend .notice}`，当没有 `.notice` 选择器时，将会报错，只有 `h1.notice` 包含 `.notice` 时也会报错，因为 `h1` 与 `a` 冲突，会生成新的选择器。

如果要求 `@extend` 不生成新选择器，可以通过 `!optional` 声明达到这个目的，例如：

```scss
a.important {
  @extend .notice !optional;
}
```

<h4 id="7-3-8">7.3.8. 在指令中延伸 (@extend in Directives)</h4>

在指令中使用 `@extend` 时（比如在 `@media` 中）有一些限制：Sass 不可以将 `@media` 层外的 CSS 规则延伸给指令层内的 CSS，这样会生成大量的无用代码。也就是说，如果在 `@media` （或者其他 CSS 指令）中使用 `@extend`，必须延伸给相同指令层中的选择器。

下面的例子是可行的：

```scss
@media print {
  .error {
    border: 1px #f00;
    background-color: #fdd;
  }
  .seriousError {
    @extend .error;
    border-width: 3px;
  }
}
```

但不可以这样：

```scss
.error {
  border: 1px #f00;
  background-color: #fdd;
}

@media print {
  .seriousError {
    // INVALID EXTEND: .error is used outside of the "@media print" directive
    @extend .error;
    border-width: 3px;
  }
}
```

希望有一天，浏览器可以原生支持 `@extend` 指令，这样就可以在任何指令中使用延伸功能，不再受限制了。

<h3 id="t7-4">7.4. @at-root</h3>

The @at-root directive causes one or more rules to be emitted at the root of the document, rather than being nested beneath their parent selectors. It can either be used with a single inline selector:

```scss
.parent {
  ...
  @at-root .child { ... }
}
```

Which would produce:

```css
.parent { ... }
.child { ... }
```

Or it can be used with a block containing multiple selectors:

```scss
.parent {
  ...
  @at-root {
    .child1 { ... }
    .child2 { ... }
  }
  .step-child { ... }
}
```

Which would output the following:

```css
.parent { ... }
.child1 { ... }
.child2 { ... }
.parent .step-child { ... }
```

<h4 id="t7-4-1">7.4.1. @at-root (without: ...) and @at-root (with: ...)</h4>

By default, @at-root just excludes selectors. However, it’s also possible to use @at-root to move outside of nested directives such as @media as well. For example:

```scss
@media print {
  .page {
    width: 8in;
    @at-root (without: media) {
      color: red;
    }
  }
}
```

produces:

```css
@media print {
  .page {
    width: 8in;
  }
}
.page {
  color: red;
}
```

You can use @at-root (without: ...) to move outside of any directive. You can also do it with multiple directives separated by a space: @at-root (without: media supports) moves outside of both @media and @supports queries.

There are two special values you can pass to @at-root. “rule” refers to normal CSS rules; @at-root (without: rule) is the same as @at-root with no query. @at-root (without: all) means that the styles should be moved outside of all directives and CSS rules.

If you want to specify which directives or rules to include, rather than listing which ones should be excluded, you can use with instead of without. For example, @at-root (with: rule) will move outside of all directives, but will preserve any CSS rules.

<h3 id="t7-5">7.5. @debug</h3>

The @debug directive prints the value of a SassScript expression to the standard error output stream. It’s useful for debugging Sass files that have complicated SassScript going on. For example:

```scss
@debug 10em + 12em;
```

编译为 

```
Line 1 DEBUG: 22em
```

<h3 id="t7-6">7.6. @warn</h3>

The @warn directive prints the value of a SassScript expression to the standard error output stream. It’s useful for libraries that need to warn users of deprecations or recovering from minor mixin usage mistakes. There are two major distinctions between @warn and @debug:

1. You can turn warnings off with the --quiet command-line option or the :quiet Sass option.
2. A stylesheet trace will be printed out along with the message so that the user being warned can see where their styles caused the warning.

Usage Example:

```scss
@mixin adjust-location($x, $y) {
  @if unitless($x) {
    @warn "Assuming #{$x} to be in pixels";
    $x: 1px * $x;
  }
  @if unitless($y) {
    @warn "Assuming #{$y} to be in pixels";
    $y: 1px * $y;
  }
  position: relative; left: $x; top: $y;
}
```

<h3 id="t7-7">7.7. @warn</h3>

The @error directive throws the value of a SassScript expression as a fatal error, including a nice stack trace. It’s useful for validating arguments to mixins and functions. For example:

```scss
@mixin adjust-location($x, $y) {
  @if unitless($x) {
    @error "$x may not be unitless, was #{$x}.";
  }
  @if unitless($y) {
    @error "$y may not be unitless, was #{$y}.";
  }
  position: relative; left: $x; top: $y;
}
```

There is currently no way to catch errors.
