/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-08-30 15:26:07
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-04-21 23:18:39
 * @Description:
 */
import { getSteedosSchema } from "../types";
import * as _ from "lodash";
import { isExpression, parseSingleExpression } from "../util";
import { isAmisFormula, computeSimpleFormula } from "../formula";
import { formatFiltersToODataQuery } from "@steedos/filters";
import { registerShareRules } from "@steedos/metadata-registrar";

export type SteedosShareRuleConfig = {
  _id: string;
  name: string;
  object_name: string;
  active: boolean;
  record_filter: string;
  entry_criteria: string;
  description: string;
};

export class ShareRules {
  static async find(objectApiName) {
    const schema = getSteedosSchema();
    return await registerShareRules.find(schema.broker, {
      pattern: `${objectApiName}.*`,
    });
  }
  static async getUserObjectFilters(objectApiName, userSession: any) {
    const rules = await this.find(objectApiName);
    if (_.isEmpty(rules)) {
      return {};
    }
    if (_.isEmpty(userSession)) {
      return {};
    }
    const rulesFilters = [];
    const allowEditRulesFilters = [];
    const globalData = { now: new Date() };
    for (const rule of rules) {
      const { active, entry_criteria, record_filter, allowEdit } =
        rule.metadata;
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
                if (_.isString(record_filter)) {
                  const isFilterExpression = isExpression(record_filter.trim());
                  const isFilterAmisFormula = isAmisFormula(record_filter);
                  let filters: any;
                  if (isFilterExpression) {
                    filters = parseSingleExpression(
                      record_filter,
                      {},
                      "#",
                      globalData,
                      userSession,
                    );
                  } else if (isFilterAmisFormula) {
                    filters = await computeSimpleFormula(
                      record_filter,
                      globalData,
                      userSession,
                    );
                  }
                  // console.log(`ShareRules.getUserObjectFilters filters`, filters);
                  if (filters && !_.isString(filters)) {
                    const filter = `(${formatFiltersToODataQuery(filters, userSession)})`;
                    rulesFilters.push(filter);
                    if (allowEdit) {
                      allowEditRulesFilters.push(filter);
                    }
                  }
                }
              } catch (error) {
                console.error(
                  `ShareRules.getUserObjectFilters record_filter error`,
                  objectApiName,
                  record_filter,
                  error.message,
                );
              }
            }
          }
        } catch (error) {
          console.error(
            `ShareRules.getUserObjectFilters entry_criteria error`,
            objectApiName,
            entry_criteria,
            error.message,
          );
        }
      }
    }
    return {
      rulesFilters,
      allowEditRulesFilters,
    };
  }
}
