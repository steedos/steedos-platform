获取数据字典
===
OData服务是一种自描述服务，它公开定义实体集，关系，实体类型和操作的元数据
获取对象的数据结构接口。

### 接口信息

 - 请求地址：/api/odata/v4/#{spaceId}
 /$metadata

 - 请求方法：GET

 - 接口说明：
   - spaceId：工作区ID
   - $metadata：固定值
 - 返回值：服务端数据结构文档
 - 示例如下：
 	- HTTP 请求

	   ```
	    url 
	      -X GET https://beta.steedos.com/api/odata/v4/Af8e****DqD3/$metadata
	   ```
	- HTTP 响应
		```
		相关属性介绍
		  EntityType:表(对象)的属性
		  Property：表的字段。包含字段名，字段类型。
		  NavigationProperty：关联属性。包含关联表，关联字段。
		<?xml version="1.0" encoding="UTF-8"?>
		<edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
    	<edmx:DataServices>
        <Schema xmlns="http://docs.oasis-open.org/odata/ns/edm" Namespace="CreatorEntities">
            <EntityType Name="object_recent_viewed">
                <Key>
                    <PropertyRef Name="_id"/>
                </Key>
                <Property Name="_id" Type="Edm.String" Nullable="false"/>
                <Property Name="record" Type="Edm.String"/>
                <Property Name="space" Type="Edm.String"/>
                <Property Name="owner" Type="Edm.String"/>
                <Property Name="created" Type="Edm.DateTimeOffset" Precision="8"/>
                <Property Name="created_by" Type="Edm.String"/>
                <Property Name="modified" Type="Edm.DateTimeOffset" Precision="8"/>
                <Property Name="modified_by" Type="Edm.String"/>
                <Property Name="is_deleted" Type="Edm.Boolean"/>
                <Property Name="sharing" Type="Edm.String"/>
                <NavigationProperty Name="space_expand" Type="CreatorEntities.spaces" Partner="object_recent_viewed">
                    <ReferentialConstraint Property="space" ReferencedProperty="_id"/>
          
                </NavigationProperty>
                <NavigationProperty Name="owner_expand" Type="CreatorEntities.users" Partner="object_recent_viewed">
                    <ReferentialConstraint Property="owner" ReferencedProperty="_id"/>
                </NavigationProperty>
                <NavigationProperty Name="created_by_expand" Type="CreatorEntities.users" Partner="object_recent_viewed">
                    <ReferentialConstraint Property="created_by" ReferencedProperty="_id"/>
                </NavigationProperty>
                <NavigationProperty Name="modified_by_expand" Type="CreatorEntities.users" Partner="object_recent_viewed">
                    <ReferentialConstraint Property="modified_by" ReferencedProperty="_id"/>
                </NavigationProperty>
            </EntityType>
            ......
            <EntityType Name="object_listviews">
                <Key>
                    <PropertyRef Name="_id"/>
                </Key>
                <Property Name="_id" Type="Edm.String" Nullable="false"/>
                <Property Name="name" Type="Edm.String" Nullable="false"/>
                <Property Name="object_name" Type="Edm.String" Nullable="false"/>
                <Property Name="filter_scope" Type="Edm.String" Nullable="false"/>
                <Property Name="columns" Type="Edm.String"/>
                <Property Name="shared" Type="Edm.Boolean"/>
                <Property Name="filters" Type="Edm.String"/>
                <Property Name="filters.$" Type="Edm.String"/>
                <Property Name="filter_logic" Type="Edm.String"/>
                <Property Name="is_default" Type="Edm.Boolean"/>
                <Property Name="owner" Type="Edm.String"/>
                <Property Name="space" Type="Edm.String"/>
                <Property Name="created" Type="Edm.DateTimeOffset" Precision="8"/>
                <Property Name="created_by" Type="Edm.String"/>
                <Property Name="modified" Type="Edm.DateTimeOffset" Precision="8"/>
                <Property Name="modified_by" Type="Edm.String"/>
                <Property Name="is_deleted" Type="Edm.Boolean"/>
                <Property Name="sharing" Type="Edm.String"/>
                <NavigationProperty Name="object_name_expand" Type="CreatorEntities.objects" Partner="object_listviews">
                    <ReferentialConstraint Property="object_name" ReferencedProperty="_id"/>
                </NavigationProperty>
                <NavigationProperty Name="owner_expand" Type="CreatorEntities.users" Partner="object_listviews">
                    <ReferentialConstraint Property="owner" ReferencedProperty="_id"/>
                </NavigationProperty>
                <NavigationProperty Name="space_expand" Type="CreatorEntities.spaces" Partner="object_listviews">
                    <ReferentialConstraint Property="space" ReferencedProperty="_id"/>
                </NavigationProperty>
                <NavigationProperty Name="created_by_expand" Type="CreatorEntities.users" Partner="object_listviews">
                    <ReferentialConstraint Property="created_by" ReferencedProperty="_id"/>
                </NavigationProperty>
                <NavigationProperty Name="modified_by_expand" Type="CreatorEntities.users" Partner="object_listviews">
                    <ReferentialConstraint Property="modified_by" ReferencedProperty="_id"/>
                </NavigationProperty>
            </EntityType>