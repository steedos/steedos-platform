const objectql = require("@steedos/objectql");
const core = require('@steedos/core');

const convertSettings = {
  "accounts": {
    "website": "website",
    "email": "email",
    "industry": "industry",
    "phone": "phone",
    "number_of_employees": "number_of_employees",
    "mobile": "mobilephone",
    "lead_source": "lead_source",
    "rating": "rating",
    "billing_address": "address"
  },
  "contacts": {
    "salutation": "salutation",
    "title": "title",
    "email": "email",
    "phone": "phone",
    "mobile": "mobilephone",
    "lead_source": "lead_source",
    "mailing_address": "address"
  },
  "opportunity": {
    "lead_source": "lead_source",
    "rating": "rating",
    "campaign_id": "campaign_id"
  }
};

const getDocConverts = (object_name, record) => {
  let result = {};
  const converts = Object.assign({}, convertSettings[object_name]);
  _.each(converts, (item, key) => {
    result[key] = record[item];
  });
  return result;
}

// 取出docConverts中oldDoc对应key值为空的字段值集合，即docConverts中值不能覆盖更新oldDoc中已经存在的字段值
const getDocEmptyConverts = (docConverts, oldDoc) => {
  let result = {};
  _.each(docConverts, (item, key) => {
    if ((oldDoc[key] === undefined || oldDoc[key] === null || oldDoc[key] === 0) && item !== undefined && item !== null && item !== 0) {
      result[key] = item;
    }
  });
  return result;
}

// 计算是否要新建业务机会联系人角色，以及是否是新建主要角色
const getNewOpportunityContactRoleOptions = async (isLookupOpportunity, isLookupContact, recordOpportunity, recordContact, objOpportunityContactRole) => {
  let needAddOpportunityContactRole = false;
  let isPrimaryRole = false;
  if (isLookupOpportunity && isLookupContact) {
    // 业务机会和联系人都不是新建的
    const roleRecords = await objOpportunityContactRole.find({
      filters: [["opportunity_id", "=", recordOpportunity._id]]
    });
    const repeatRoleRecord = roleRecords.find((item) => {
      return item.contact_id === recordContact._id;
    });
    if (!repeatRoleRecord) {
      // 只有不存在相同联系人的记录时才需要新建联系人角色
      needAddOpportunityContactRole = true;
    }
    if (needAddOpportunityContactRole) {
      const primaryRoleRecord = roleRecords.find((item) => {
        return item.is_primary === true;
      });
      if (!primaryRoleRecord) {
        // 只有不存在is_primary为true的记录时才设置当前角色为主要联系人角色
        isPrimaryRole = true;
      }
    }
  }
  else if (isLookupOpportunity) {
    // 是新建的联系人，但是不是新建的业务机会
    needAddOpportunityContactRole = true;
    const primaryCount = await objOpportunityContactRole.count({
      filters: [["opportunity_id", "=", recordOpportunity._id], ["is_primary", "=", true]]
    });
    if (primaryCount === 0) {
      // 只有不存在is_primary为true的记录时才设置当前角色为主要联系人角色
      isPrimaryRole = true;
    }
  }
  else if (isLookupContact) {
    // 是新建的业务机会，但是不是新建的联系人
    needAddOpportunityContactRole = true;
    isPrimaryRole = true;
  }
  else {
    // 是新建的业务机会和联系人
    needAddOpportunityContactRole = true;
    isPrimaryRole = true;
  }
  return {
    needAddOpportunityContactRole,
    isPrimaryRole
  }
}

const validateBody = (body, recordAccount, recordContact, recordOpportunity) => {
  let validateResult = {};
  if (body.is_lookup_account && !body.lookup_account) {
    validateResult.error = "请输入“新建客户名称”或选择“现有客户”!";
  }
  else if (!body.is_lookup_account && !body.new_account_name) {
    validateResult.error = "请输入“新建客户名称”或选择“现有客户”!";
  }
  else if (body.is_lookup_contact && !body.lookup_contact) {
    validateResult.error = "请输入“新建联系人名称”或选择“现有联系人”!";
  }
  else if (!body.is_lookup_contact && !body.new_contact_name) {
    validateResult.error = "请输入“新建联系人名称”或选择“现有联系人”!";
  }
  else if (!body.omit_new_opportunity) {
    if (body.is_lookup_opportunity && !body.lookup_opportunity) {
      validateResult.error = "请选择“现有业务机会”或勾选“请勿在转换时创建业务机会”项!";
    }
    else if (!body.is_lookup_opportunity && !body.new_opportunity_name) {
      validateResult.error = "请输入“新建业务机会名称”或勾选“请勿在转换时创建业务机会”项!";
    }
  }
  if(!validateResult.error && recordAccount){
    if(recordContact && recordContact.account && recordContact.account !== recordAccount._id){
      validateResult.error = "现有联系人必须是现有客户下的联系人!";
    }
    else if(recordOpportunity && recordOpportunity.account && recordOpportunity.account !== recordAccount._id){
      validateResult.error = "现有业务机会必须是现有客户下的业务机会!";
    }
  }
  return validateResult;
}

module.exports = {
  convert: async function (req, res) {
    try {
      const params = req.params;
      const recordId = params._id;
      const userSession = req.user;
      req.body.new_account_name = req.body.new_account_name && req.body.new_account_name.trim();
      req.body.new_contact_name = req.body.new_contact_name && req.body.new_contact_name.trim();
      req.body.new_opportunity_name = req.body.new_opportunity_name && req.body.new_opportunity_name.trim();
      const body = req.body;
      const steedosSchema = objectql.getSteedosSchema();
      const objAccounts = steedosSchema.getObject('accounts');
      const objContacts = steedosSchema.getObject('contacts');
      const objOpportunity = steedosSchema.getObject('opportunity');
      let recordAccount, recordContact, recordOpportunity;
      if (body.is_lookup_account && body.lookup_account) {
        recordAccount = await objAccounts.findOne(body.lookup_account);
        if (!recordAccount) {
          return res.status(500).send({
            "error": "Action Failed -- The account is not found.",
            "success": false
          });
        }
      }
      if (body.is_lookup_contact && body.lookup_contact) {
        recordContact = await objContacts.findOne(body.lookup_contact);
        if (!recordContact) {
          return res.status(500).send({
            "error": "Action Failed -- The contact is not found.",
            "success": false
          });
        }
      }
      if (!body.omit_new_opportunity && body.is_lookup_opportunity && body.lookup_opportunity) {
        recordOpportunity = await objOpportunity.findOne(body.lookup_opportunity);
        if (!recordOpportunity) {
          return res.status(500).send({
            "error": "Action Failed -- The opportunity is not found.",
            "success": false
          });
        }
      }
      const validateResult = validateBody(body, recordAccount, recordContact, recordOpportunity);
      if (validateResult && validateResult.error) {
        return res.status(500).send({
          "error": validateResult.error,
          "success": false
        });
      }
      let new_account_name = body.new_account_name;
      let new_contact_name = body.new_contact_name;
      let new_opportunity_name = body.new_opportunity_name;
      const objLeads = steedosSchema.getObject('leads');
      const record = await objLeads.findOne(recordId);
      const docAccountConverts = getDocConverts("accounts", record);
      const docContactConverts = getDocConverts("contacts", record);
      const docOpportunityConverts = getDocConverts("opportunity", record);
      let docLeadUpdate = { converted: true, status: "Qualified" };
      const baseDoc = { owner: body.record_owner_id, space: userSession.spaceId };
      if (body.is_lookup_account && body.lookup_account) {
        // 所有字段属性都是为空才同步更新
        const docAccountEmptyConverts = getDocEmptyConverts(docAccountConverts, recordAccount);
        if (!_.isEmpty(docAccountEmptyConverts)) {
          await objAccounts.updateOne(recordAccount._id, docAccountEmptyConverts, userSession);
        }
      }
      else {
        recordAccount = await objAccounts.insert(Object.assign({}, baseDoc, docAccountConverts, { name: new_account_name }), userSession);
        if (!recordAccount) {
          return res.status(500).send({
            "error": "Action Failed -- Insert account failed.",
            "success": false
          });
        }
      }
      if (recordAccount) {
        docLeadUpdate.converted_account = recordAccount._id;
        if (body.is_lookup_contact && body.lookup_contact) {
          // 包括所属客户在内，所有字段属性都是为空才同步更新
          let docContactEmptyConverts = getDocEmptyConverts(Object.assign({}, docContactConverts, { account: recordAccount._id }), recordContact);
          if (body.force_update_contact_lead_source && !docContactEmptyConverts.lead_source && docContactConverts.lead_source) {
            // 如果界面上勾选了“更新潜在客户来源”，则应该强行更新联系人的潜在客户来源
            docContactEmptyConverts.lead_source = docContactConverts.lead_source;
          }
          if (!_.isEmpty(docContactEmptyConverts)) {
            await objContacts.updateOne(recordContact._id, docContactEmptyConverts, userSession);
          }
        }
        else {
          recordContact = await objContacts.insert(Object.assign({}, baseDoc, docContactConverts, { name: new_contact_name, account: recordAccount._id }), userSession);
          if (!recordContact) {
            return res.status(500).send({
              "error": "Action Failed -- Insert contact failed.",
              "success": false
            });
          }
        }
        if (recordContact) {
          docLeadUpdate.converted_contact = recordContact._id;
          if (!body.omit_new_opportunity) {
            if (body.is_lookup_opportunity && body.lookup_opportunity) {
              // 包括所属客户在内，所有字段属性都是为空才同步更新
              const docOpportunityEmptyConverts = getDocEmptyConverts(Object.assign({}, docOpportunityConverts, { account: recordAccount._id }), recordOpportunity);
              if (!_.isEmpty(docOpportunityEmptyConverts)) {
                await objOpportunity.updateOne(recordOpportunity._id, docOpportunityEmptyConverts, userSession);
              }
            }
            else {
              recordOpportunity = await objOpportunity.insert(Object.assign({}, baseDoc, docOpportunityConverts, { name: new_opportunity_name, account: recordAccount._id }), userSession);
              if (!recordOpportunity) {
                return res.status(500).send({
                  "error": "Action Failed -- Insert opportunity failed.",
                  "success": false
                });
              }
            }
            if (recordOpportunity) {
              docLeadUpdate.converted_opportunity = recordOpportunity._id;
              const objOpportunityContactRole = steedosSchema.getObject('opportunity_contact_role');
              const { needAddOpportunityContactRole, isPrimaryRole } = await getNewOpportunityContactRoleOptions(body.is_lookup_opportunity, body.is_lookup_contact, recordOpportunity, recordContact, objOpportunityContactRole);
              if (needAddOpportunityContactRole) {
                await objOpportunityContactRole.insert(Object.assign({}, baseDoc, { opportunity_id: recordOpportunity._id, contact_id: recordContact._id, is_primary: isPrimaryRole }), userSession);
              }
            }
          }
        }
      }
      await objLeads.updateOne(recordId, docLeadUpdate, userSession);
      return res.status(200).send({ state: 'SUCCESS' });
    } catch (error) {
      console.error(error);
      return core.sendError(res, error, 400);
    }
  }
}