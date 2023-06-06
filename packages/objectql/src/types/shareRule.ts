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
            return;
        }
        const rulesFilters = [];
        const globalData = { now: new Date() };
        _.each(rules, (rule) => {
            const { active, entry_criteria, record_filter } = rule.metadata;
            if (active) {
                if (_.isString(entry_criteria) && isExpression(entry_criteria.trim())) {
                    try {
                        const meetCriteria = parseSingleExpression(entry_criteria, {}, "#", globalData, userSession);
                        if (_.isBoolean(meetCriteria) && meetCriteria) {
                            if (_.isString(record_filter) && isExpression(record_filter.trim())) {
                                try {
                                    const filters = parseSingleExpression(record_filter, {}, "#", globalData, userSession);
                                    if (filters && !_.isString(filters)) {
                                        rulesFilters.push(`(${formatFiltersToODataQuery(filters, userSession)})`)
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
        return rulesFilters;
    }
}