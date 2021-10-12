# 初始化 ./steedos 环境

# -f 参数判断 $file 是否存在
mnted_home_path="/pv_steedos_mnted"
init_flag_file="$mnted_home_path/.config/steedos/init_flag_file"
echo "check start"
if [ ! -f "$init_flag_file" ]; then
    # 解压缩
    
    echo "copy start"
    cp -rf /app/.steedos/*.* $mnted_home_path
    echo "copy end"

    mkdir -p /pv_steedos_mnted/.config/steedos
    mkdir -p ~/.config/steedos
    # 声明...
    echo "DON'T DELETE THIS FILE  | 警告： steedos sass 云用户不要删除此文件" > $init_flag_file
else
    echo "skip copy ...."
fi
echo "run end"