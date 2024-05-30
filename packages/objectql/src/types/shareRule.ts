/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-08-30 15:26:07
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-05-30 16:32:50
 * @Description: 
 */
import { getSteedosSchema } from '../types'
import * as _ from 'lodash'
import { isExpression, parseSingleExpression } from '../util'
import { formatFiltersToODataQuery } from "@steedos/filters";
import { registerShareRules } from '@steedos/metadata-registrar';

export type SteedosShareRuleConfig = {
    _id: string,
    name: string,
    object_name: string,
    active: boolean,
    record_filter: string,
    entry_criteria: string,
    description: string
}

export class ShareRules {
    static async find(objectApiName) {
        const schema = getSteedosSchema();
        return await registerShareRules.find(schema.broker, {
            pattern: `${objectApiName}.*`
        })
    }
    static async getUserObjectFilters(objectApiName, userSession: any) {
        const rules = await this.find(objectApiName);
        if (_.isEmpty(rules)) {
            return {};
        }
        if(_.isEmpty(userSession)){
            return {};
        }
        const rulesFilters = [];
        const allowEditRulesFilters = []
        const globalData = { now: new Date() };
        _.each(rules, (rule) => {
            const { active, entry_criteria, record_filter, allowEdit } = rule.metadata;
            if (active) {
                if (_.isString(entry_criteria) && isExpression(entry_criteria.trim())) {
                    try {
                        const meetCriteria = parseSingleExpression(entry_criteria, {}, "#", globalData, userSession);
                        if (_.isBoolean(meetCriteria) && meetCriteria) {
                            if (_.isString(record_filter) && isExpression(record_filter.trim())) {
                                try {
                                    const filters = parseSingleExpression(record_filter, {}, "#", globalData, userSession);
                                    if (filters && !_.isString(filters)) {
                                        const filter = `(${formatFiltersToODataQuery(filters, userSession)})`
                                        rulesFilters.push(filter)
                                        if(allowEdit){
                                            allowEditRulesFilters.push(filter)
                                        }
                                    }
                                } catch (error) {
                                    console.error(`ShareRules.getUserObjectFilters record_filter error`, objectApiName, record_filter, error.message);
                                }
                            }
                        }
                    } catch (error) {
                        console.error(`ShareRules.getUserObjectFilters entry_criteria error`, objectApiName, entry_criteria, error.message);
                    }
                }
            }
        })
        return {
            rulesFilters,
            allowEditRulesFilters
        };
    }
}