/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2023-03-06 15:38:22
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2025-02-19 14:44:42
 * @Description: 
 */
SpaceUsersCore = {
    isCompanyAdmin: function(spaceUserId, organization){
        var userId = Steedos.User.get().userId;
        if(organization){
            //当前选中组织所属分部的管理员才有权限
            if(organization.company_id && organization.company_id.admins){
                return organization.company_id.admins.indexOf(userId) > -1;
            }
        }
        else{
            // 用户详细界面拿不到当前选中组织时，只能从记录本身所属分部的管理员中判断，只要当前用户是任何一个所属分部的管理员则有权限
            // var record = Creator.getObjectRecord("space_users", spaceUserId);
            var queryResult = Steedos.authRequest("/graphql", {
                type: 'POST',
                async: false,
                data: JSON.stringify({
                    query: `{record:space_users__findOne(id: "${spaceUserId}"){ company_ids: company_ids__expand{ admins } }}`
                }),
                contentType: 'application/json',
                error: function () { }
            });
            var record = queryResult && queryResult.data && queryResult.data.record;
            if(record && record.company_ids && record.company_ids.length){
                return _.some(record.company_ids,function(item){
                    return item.admins && item.admins.indexOf(userId) > -1
                });
            }
        }
    }
}