import { authRequest } from '../../auth';
/**
 * 
 * @param base64 打包好的zip文件，内含一个package.json
 */
export function sendToServer(base64){
    authRequest('/api/metadata/deploy', {
        method: "POST",//请求方式，默认为get
        headers: {//设置请求头
            "Content-Type": "multipart/form-data"
        },
        form: {
            file: base64
        }

    }, function(error, response, body) {
        if(error){
            console.error('Error: ', error.message);
        }else if (response && response.statusCode && response.statusCode != 200) {
            if(response.statusCode == 401){
                console.error('Error: Please run command, steedos source:config');
            }else{
                console.error(body);
            }
        }else{
            console.info(body);
        }
    })

}




