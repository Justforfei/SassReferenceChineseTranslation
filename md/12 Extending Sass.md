<h2 id="t12">12. 拓展 Sass (Extending Sass)</h2>

Sass 提供了很多高级自定义功能，使用这些功能需要有良好的 Ruby 基础。

<h3 id="t12-1">12.1. 自定义 Sass 函数 (Defining Custom Sass Functions)</h3>

通过 Ruby API 可以自定义 Sass 函数，具体请查看 [source documentation](http://sass-lang.com/docs/yardoc/Sass/Script/Functions.html#adding_custom_functions)。

<h3 id="t12-2">12.2. 存储缓存 (Cache Stores)</h3>

Sass caches parsed documents so that they can be reused without parsing them again unless they have changed. By default, Sass will write these cache files to a location on the filesystem indicated by :cache_location. If you cannot write to the filesystem or need to share cache across ruby processes or machines, then you can define your own cache store and set the:cache_store option. For details on creating your own cache store, please see the source documentation.

<h3 id="t12-3">12.3. 自定义导入 (Custom Importers)</h3>

Sass importers are in charge of taking paths passed to @import and finding the appropriate Sass code for those paths. By default, this code is loaded from the filesystem, but importers could be added to load from a database, over HTTP, or use a different file naming scheme than what Sass expects.

Each importer is in charge of a single load path (or whatever the corresponding notion is for the backend). Importers can be placed in the :load_paths array alongside normal filesystem paths.

When resolving an @import, Sass will go through the load paths looking for an importer that successfully imports the path. Once one is found, the imported file is used.

User-created importers must inherit from Sass::Importers::Base.
