字段
===

字段用来定义[对象](object.md)中的各种属性。

![电脑、手机界面展示](images/car_object_fields.png)

每个Creator对象都自动包含以下默认字段：
- 记录名称(name)
- 记录所有人(owner)
- 创建日期(created)
- 创建人(created_by)
- 修改日期(modified)
- 修改人(modified_by)
- 已删除(is_deleted)：字段类型为布尔(boolean)，默认为隐藏(hidden)、编辑时忽略(omit)
- 删除日期(deleted)：默认为隐藏(hidden)、编辑时忽略(omit)
- 删除人(deleted_by)：默认为隐藏(hidden)、编辑时忽略(omit)
- 所属工作区(space)
- 所属单位(company_id)：默认为隐藏(hidden)、编辑时忽略(omit)
- 已锁定(locked)：字段类型为布尔(boolean)，默认为隐藏(hidden)、编辑时忽略(omit)
- 记录的相关审批单(instances)：默认为隐藏(hidden)、编辑时忽略(omit)

### 字段类型
Creator支持以下基本字段类型。如果字段配置了数组(multiple)属性，表示当前字段为数组类型，以数组的形式保存在数据库中，用户界面上可以多选。
- 文本(text)
- 多行文本(textarea)
- 日期(date) 
- 日期时间(datetime)
- 下拉(select): 界面生成下拉框，需配合options属性使用
- 布尔(boolean): 界面生成勾选框
- 数值(number) 
- 引用(lookup): 可以引用其他相关对象中的记录，联合reference_to字段，从关联表中选择记录。
- 主表/子表(master_detail): 主表子表字段类型是引用字段类型的一种扩展，将当前记录链接到主表成为子记录。
- 表格(grid): 表格字段类型包含多个子字段，在界面上显示为一个表格。
- 网址(url): 在只读时， 点击会以窗口形式打开网址
- 邮件地址(email): 在只读时，点击会自动打开邮件客户端，并将字段值带入收件人中

### 字段属性
每个字段都可以配置以下属性，定义字段的功能和界面操作。
- 字段名(name): 字段在数据库中保存的名称。
- 显示名(label): 字段在最终用户界面上的显示名称。如果系统检测到翻译 "objectname_fieldname"，以翻译为准。
- 默认值(defaultValue): 可配置默认值[公式](object_field_formula.md)，例如 {userId}, {spaceId} 等
- 必填(required)
- 帮助文本(inlineHelpText): 表单填写时显示的帮助文本
- 宽字段(is_wide): 显示时占两列，默认只占一列
- 分组(group)：在显示记录时可按分组显示字段
- 可搜索(seachable): 当用户在此对象中执行搜索时，会同时搜索此字段的内容
- 可排序(sortable): 用户在浏览记录时，可以按照此字段执行排序操作。可排序字段系统会自动创建索引。默认为不可排序
- 索引(index): 指定是否在数据库中为此字段创建索引，默认为不创建索引。
- 只读(readonly): 应该只显示在查看页面或列表页面上，新增和修改页面都不显示 #todo
- 隐藏(hidden): 包括列表、表单、编辑界面在内的所有界面都不显示
- 编辑时忽略(omit): 只是新建和编辑表单中不显示，列表、表单详细界面等都可能显示。
- 标题字段(is_name): 表示此字段为标题字段，适用于标题字段并不是"name"时，在列表页生成链接
- 禁用(disabled) 
- 黑箱字段(blackbox): Creator在做数据验证时，忽略此字段的内容。
- 值范围(allowedValues): 此字段的值必须在此范围之内。
- 可选项(options)：对于下拉框、引用、主表子表类型的字段，可定义可选项的范围
	- 数据格式为
		- 选项显示与存储值一致时, 各选项以英文逗号(,)分隔，比如："选项1,选项2,选项3" 
		- 选项显示与存储值不一致时，可通过英文冒号(:)来指定选项值，比如："选项1:值1,选项2:值2,选项3:值3"

### 文本类型
- 文本且建立了索引，则最多支持300个字符(不区分中英文)
- 示例：

 	  name:
	
	  label: '问题标题'
	
	  type: 'text'
	
	  is_wide: true
	
	  required: true
	
	  searchable: true
	
	- 备注：name为字段名称  
	       label: '问题标题'  表示显示名为问题标题
	       type: 'text'    表示字段类型为文本型
               is_wide: true   表示为宽字段
               required: true  表示为字段必填
               searchable: true  表示为字段内容可搜索

### 多行文本类型
- 多行文本类型不支持建立索引
- 示例：
   
      description:
   
      label: '问题描述'
   
      type: 'textarea'
   
      is_wide: true
   
      rows: 4
      
### 日期
- 字段值显示年-月-日
- 示例：

      deadline:
      
      label: '截止日期'
      
      type: 'date'

### 日期时间
- 字段值显示年-月-日 小时：分钟
- 示例：

      starttime:
      
      label: '开始时间'
      
      type: 'datetime'
      
### 下拉
  - 界面生成下拉框，需配合options属性使用
  - 示例： 
  
        state:
	
	    label: "进度"
	
	    type: "select"
	
	    options: [
		
		{label:"待确认", value:"pending_confirm"},
		{label:"处理中", value:"in_progress"},
		{label:"暂停", value:"paused"},
		{label: "已完成", value:"completed"}
	    {label: "已取消", value:"cancelled"}
		 ]
		 	 
	    sortable: true
	    
	    defaultValue: "pending_confirm"
	 
	    required: true
	 
	    filterable: true

### 布尔
 - 界面生成勾选框，可以设定默认值
 - 示例： 
  
       isuse:

       type:"boolean"
	
       label:"是否采用"
	
       defaultValue:"否"


### 数值类型
- 小数位数(scale): 默认值0
- 数值最大长度(precision): 默认值18
- 示例：

          number:

          label: '小写金额'
   
          type: 'number'
   
          required: true
   
          searchable: true
   

### 引用字段类型
引用字段允许用户单击查找图标，以从弹出列表中选择值。主对象是列表中值的源。

- 可选项脚本(optionsFunction)：通过脚本生成可选项的内容
- 依赖字段(depend_on): 此字段的值需要依赖其他字段的值，当depend_on中的字段值发生变化时，会重新计算当前字段值/可选项。
- 引用对象(reference_to): 编辑时，从关联表中选择记录，如果引用的对象上配置了enable_tree属性，则以tree形式列出关联表中记录供选择。
- 过滤器(filters): 在reference_to对象中筛选可选项时，限定查询范围
- 默认图标(defaultIcon): 下拉选项中显示的默认图标，如果配置了reference_to，则显示引用对象的图标
- 示例：
	- 在archive_records对象里，字段archive_destroy_id类型为master_detail
		- archive_destroy_id:
				type:"master_detail"
				label:"销毁单"
				filters:[["destroy_state", "=", "未销毁"]]
				depend_on:["destroy_state"]
				reference_to:"archive_destroy"
				group:"销毁"
		- 备注：上述实例中，使用了filters字段级过滤，其中depend_on必须有，最终得到“archive_destroy”表中，destroy_state值为“未销毁”的记录。


### 主表/子表字段类型
在引用字段的基础上，创建一个此对象（子级或"详细信息"）与另一对象（父级或"主"）之间的特殊父子关系类型，其中：
- 所有子表记录的关系字段必填。
- 子表记录的所有权和共享由主记录确定。
- 当用户删除主记录时，将删除所有子表记录。
- 您可以在主记录上创建累计汇总字段以汇总子表信息记录。
- 系统会自动检测此类型的字段，在显示主表记录时，生成子表列表视图。
- 您最多可以有 3 个自定义子表等级。

级联删除：
- 删除子表记录时会将其移入回收站，而将主记录保留原样；
- 删除主记录时还会删除相关的子表记录和次子表记录。
- 取消删除子表记录时会恢复该记录
- 而取消删除主记录时也会取消删除相关的子表记录和次子表记录。
- 但是，如果您删除一个子表记录，随后又单独删除其主记录，则不能取消删除该子表信息，因为它不再有关联的主记录。

### 表格字段类型
表格字段类型包含多个列字段，在界面上显示为一个表格。
- 列字段可以是任何基本的字段类型。
- 每个列字段显示为表格中的一列。
- 用户有了表格字段的填写权限，就可以增删改其中的行。
- 如果配置了某个列字段隐藏，表格中看不到此字段。
- 如果配置了某个列字段只读，表格中不可修改此字段。

表格字段配置步骤
- 新增一个字段，类型选择为表格
- 逐个新增除表格字段的其他类型字段的列字段，字段名规范："表格字段名.$.列字段名"

表格字段与子表不同，在数据库中不会生成一个新的表，而是作为一个对象数组字段保存在记录中。所以只适用于表格行数(小于100行)比较少的业务场景。

### 网址
字段内可输入网址，在只读时，点击后弹出新页面显示
- 示例：

      website:

      type: "url"
      
      label: "网址"
      
 ### 邮件
字段内可输入邮件地址，在只读时，点击会自动打开邮件客户端，并将字段值带入收件人中
- 示例：
      
      mail:

      type: "email"
      
      label: "邮件地址"
