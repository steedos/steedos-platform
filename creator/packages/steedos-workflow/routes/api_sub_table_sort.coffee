JsonRoutes.add("post", "/api/workflow/sub_table_sort", (req, res, next) ->
	try
        console.log "=========子表=========="
        console.log "req?.query?.subTable",req?.query?.subTable
        console.log "=========子表总分列=========="
        console.log "req?.query?.sumCol",req?.query?.sumCol
        console.log "=========子表排序列=========="
        console.log "req?.query?.sortCol",req?.query?.sortCol
        console.log "=========子表单列需要计算的和=========="
        console.log "req?.query?.singleCols",req?.query?.singleCols
        
        
        sub_table = req?.query?.subTable
        if !sub_table
            console.log "=====sub_table======"
            throw new Meteor.Error('table sort error!', 'webhook 未配置 subTable 字段' );
        
        sum_col = req?.query?.sumCol
        if !sum_col
            console.log "=====sum_col======"
            throw new Meteor.Error('table sort error!', 'webhook 未配置 sumCol 字段' );
        
        sort_col = req?.query?.sortCol
        if !sort_col
            console.log "=====sort_col======"
            throw new Meteor.Error('table sort error!', 'webhook 未配置 sortCol 字段' );
        
        # single_cols = req?.query?.singleCols
        # if !single_cols
        #     console.log "=====single_cols======"

        #     throw new Meteor.Error('table sort error!', 'webhook 未配置 singleCols 字段' );
        
        ins = req?.body?.instance
        
        sub_table_values = ins.values[sub_table]
        
        if sub_table_values?.length > 0 
            # # 根据 sub_table_values 进行排序
            # ======================
            # 排序字段，关键字，正序(true)/倒序(false)
            `function JsonSort(jsonArr, key, asc){
                for(var j=1,jl=jsonArr.length;j < jl;j++){
                    var temp = jsonArr[j],
                        val  = Number(temp[key]),
                        i    = j-1;
                    if(asc==true){
                        while(i >=0 && Number(jsonArr[i][key])>val){
                            jsonArr[i+1] = jsonArr[i];
                            i = i-1;    
                        }
                    }else{
                        while(i >=0 && Number(jsonArr[i][key])<val){
                            jsonArr[i+1] = jsonArr[i];
                            i = i-1;    
                        }
                    }
                    jsonArr[i+1] = temp;
                }
                return jsonArr;
            }`
            
            new_table_values = JsonSort(sub_table_values,sum_col,false)

            console.log "new_table_values",new_table_values

            new_table_values.forEach (obj, index)->
                if sort_col and obj[sum_col]
                    obj[sort_col] = (index+1).toString()
            
            console.log "new_table_values",new_table_values

            ins.values[sub_table] = new_table_values

            db.instances.update(ins._id,{
                $set:{
                    'values':ins.values
                    }
                })

            console.log "success"
            JsonRoutes.sendResult res, {
                code: 200,
                data: {
                    'success': '计算排序成功'
                }
            }
        else
            throw new Meteor.Error('table sort error!', '子表数据为空');
    catch e
        JsonRoutes.sendResult res, {
            code: 200,
            data: {
                errors: [e]
            }
        }
)