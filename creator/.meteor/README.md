# Meteor项目配置

华炎魔方最终打包运行的是一个Meteor项目，该文件夹内存放的是Meteor项目的各种配置文件。

一般在`packages`文件中配置项目中有哪些依赖的Meteor包，运行项目时，Meteor会根据这里配置的依赖包生成最终项目引用依赖了哪些Meteor包以及每个包的具体版本号存入`versions`文件中。

项目依赖的Meteor内核版本是在文件`release`中配置的。
