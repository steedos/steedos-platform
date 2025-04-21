/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-04-21 22:25:29
 * @Description:
 */
import { getSteedosSchema } from "../types";
import * as _ from "lodash";
import { isExpression, parseSingleExpression } from "../util";
import { isAmisFormula, computeSimpleFormula } from "../formula";
import { formatFiltersToODataQuery } from "@steedos/filters";
import { registerRestrictionRules } from "@steedos/metadata-registrar";

export type SteedosRestrictionRuleConfig = {
  _id: string;
  name: string;
  object_name: string;
  active: boolean;
  record_filter: string;
  entry_criteria: string;
  description: string;
};

export class RestrictionRule {
  static async find(objectApiName) {
    const schema = getSteedosSchema();
    return await registerRestrictionRules.find(schema.broker, {
      pattern: `${objectApiName}.*`,
    });
  }
  static async getUserObjectFilters(objectApiName, userSession: any) {
    const rules = await this.find(objectApiName);
    if (_.isEmpty(rules)) {
      return;
    }
    const rulesFilters = [];
    const globalData = { now: new Date() };
    for (const rule of rules) {
      const { active, entry_criteria, record_filter } = rule.metadata;
      if (active) {
        try {
          if (_.isString(entry_criteria)) {
            let meetCriteria: any;
            const isEntryCriteriaExpression = isExpression(
              entry_criteria.trim(),
            );
            const isEntryCriteriaAmisFormula = isAmisFormula(entry_criteria);
            if (isEntryCriteriaExpression) {
              meetCriteria = parseSingleExpression(
                entry_criteria,
                {},
                "#",
                globalData,
                userSession,
              );
            } else if (isEntryCriteriaAmisFormula) {
              meetCriteria = await computeSimpleFormula(
                entry_criteria,
                globalData,
                userSession,
              );
            }
            if (_.isBoolean(meetCriteria) && meetCriteria) {
              try {
                if (
                  _.isString(record_filter) &&
                  isExpression(record_filter.trim())
                ) {
                  const filters = parseSingleExpression(
                    record_filter,
                    {},
                    "#",
                    globalData,
                    userSession,
                  );
                  if (filters && !_.isString(filters)) {
                    rulesFilters.push(
                      `(${formatFiltersToODataQuery(filters, userSession)})`,
                    );
                  }
                }
              } catch (error) {
                console.error(
                  `RestrictionRule.getUserObjectFilters record_filter error`,
                  objectApiName,
                  record_filter,
                  error.message,
                );
              }
            }
          }
        } catch (error) {
          console.error(
            `RestrictionRule.getUserObjectFilters entry_criteria error`,
            objectApiName,
            entry_criteria,
            error.message,
          );
        }
      }
    }
    return rulesFilters;
  }
}
