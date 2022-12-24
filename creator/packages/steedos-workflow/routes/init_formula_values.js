/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2021-05-24 12:32:56
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-24 15:38:54
 * @Description: 
 */
// JsonRoutes.add("post", "/api/workflow/init_formula_values", function(req, res, next) {
// 	var
// 		fields = req.body.fields,
// 		autoFormDoc = req.body.autoFormDoc,
// 		approver = req.body.approver,
// 		applicant = req.body.applicant,

// 		spaceId = req.query.spaceId,

// 		spaceUsers = [];

// 	if (!fields || !spaceId || !autoFormDoc || !approver || !applicant) {
// 		JsonRoutes.sendResult(res, {
// 			code: 200,
// 			data: {
// 				'errors': '缺少参数'
// 			}
// 		});
// 		return;
// 	}

// 	formula_values = Form_formula.init_formula_values(fields, autoFormDoc, approver, applicant, spaceId);

// 	JsonRoutes.sendResult(res, {
// 		code: 200,
// 		data: {
// 			'formula_values': formula_values
// 		}
// 	});
// })
