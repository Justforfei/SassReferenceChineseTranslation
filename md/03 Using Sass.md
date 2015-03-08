
<h2 id="t3">3. 使用 Sass (Using Sass)</h2>

Sass 可以通过以下三种方式使用：作为命令行工具；作为独立的 Ruby 模块 (Ruby module)；或者作为 Rack-enabled 框架的插件（例如 Ruby on Rails 与 Merb）。无论哪种方式都需要先安装 Sass gem （Windows 系统需要先[安装 Ruby](http://rubyinstaller.org/)）：

```
gem install sass
```

在命令行中运行 Sass：

```
sass input.scss output.css
```

监视单个 Sass 文件，每次修改并保存时自动编译：

```
sass --watch input.scss:output.css
```

监视整个文件夹：

```
sass --watch app/sass:public/stylesheets
```

更多命令的用法请通过 `sass --help` 获取帮助。

在 Ruby 中使用 Sass 也非常容易，Sass gem 安装完毕后运行 `require "sass"` 然后按照下面的方法使用 [Sass::Engine](http://sass-lang.com/docs/yardoc/Sass/Engine.html)：

```
engine = Sass::Engine.new("#main {background-color: #0000ff}", :syntax => :scss)
engine.render #=> "#main { background-color: #0000ff; }\n"
```

<h3 id="t3-1">3.1. Rack/Rails/Merb Plugin</h3>

在 Rails 3 之前的版本中使用 Sass，需要在 `environment.rb` 文件中添加：

```
config.gem "sass"
```

Rails 3 则需要在 Gemfile 中添加：

```
gem "sass"
```

在 Merb 中使用 Sass，需要在 `config/dependencies.rb` 中添加：

```
dependency "merb-haml"
```

在 Rack 中使用 Sass，需要在 `config.ru` 中添加：

```
require 'sass/plugin/rack'
use Sass::Plugin::Rack
```

样式文件与 views 不同，不包含任何动态内容，因此 CSS 只需要在 Sass 文件被修改后再编译生成。默认情况下 `.sass` 与 `.scss` 文件放置在 `public/stylesheets/sass` 中（可通过 [:template_location](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#template_location-option) 修改路径），编译生成的 CSS 文件放置在 `public/stylesheets` 中。例如 `public/stylesheets/sass/main.scss` 编译生成 `public/stylesheets/main.css`。

<h3 id="t3-2">3.2. 缓存 (Caching)</h3>

Sass 自动缓存编译后的模板与 [partials](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#partials)，这样做能够显著提升重新编译的速度，尤其在处理由 `@import` 导入多个子文件的大型项目时。

单独使用 Sass，缓存内容保存在 `.sass-cache` 文件夹中。在 Rails 和 Merb 项目中缓存文件保存在 `tmp/sass-cache` 文件夹中（可通过 [`:cache_location`]() 修改路径）。禁用缓存可将 `:cache` 设为 `false`。

<h3 id="t3-3">3.3. 配置选项 (Options)</h3>

[暂未翻译](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#options)

<h3 id="t3-4">3.4. 判断语法格式 (Syntax Selection)</h3>

Sass 命令行工具根据文件的拓展名判断所使用的语法格式，没有文件名时 `sass` 命令默认编译 `.sass` 文件，添加 `--scss` 选项或者使用 `scss` 命令编译 SCSS 文件。

<h3 id="t3-5">3.5. 编码格式 (Encodings)</h3>

在 Ruby 1.9 及以上环境中运行 Sass 时，Sass 对文件的编码格式比较敏感，首先会根据 [CSS spec](http://www.w3.org/TR/2013/WD-css-syntax-3-20130919/#determine-the-fallback-encoding) 判断样式文件的编码格式，如果失败则检测 Ruby string encoding。也就是说，Sass 首先检查 Unicode byte order mark，然后是 `@charset` 声明，最后是 Ruby string encoding，假如都没有检测到，默认使用 UTF-8 编码。

与 CSS 相同，使用 `@charset` 可以声明特定的编码格式。在样式文件的起始位置（前面没有任何空白与注释）插入 `@charset "encoding-name"`， Sass 将会按照给出的编码格式编译文件。注意所使用的编码格式必须可转换为 Unicode 字符集。

Sass 以 UTF-8 编码输出 CSS 文件，当且仅当编译后的文件中包含非 ASCII 字符时，才会在输出文件中添加 `@charset` 声明，而在压缩模式下 (compressed mode) 使用 UTF-8 byte order mark 代替 `@charset` 声明语句。
