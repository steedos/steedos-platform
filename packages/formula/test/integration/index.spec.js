/* global describe it context */

import { expect } from 'chai';
import accountManagement from './01_account_management.json';
import accountMediaService from './02_account_media_service.json';
import caseManagement from './03_case_management.json';
import commissionCalculations from './04_commission_calculations.json';
import contactManagement from './05_contact_management.json';
import dataCategorization from './06_data_categorization.json';
import date from './07_date.json';
import discounting from './08_discounting.json';
import employeeServices from './09_employee_services.json';
import expenseTracking from './10_expense_tracking.json';
import financialCalculations from './11_financial_calculations.json';
import imageLink from './12_image_link.json';
import integrationLink from './13_integration_link.json';
import leadManagement from './14_lead_management.json';
import metrics from './15_metrics.json';
import opportunityManagement from './16_opportunity_management.json';
import pricing from './17_pricing.json';
import scoringCalculations from './18_scoring_calculations.json';

import { parse } from '../../src/formulon';
import { buildDateLiteral, buildDatetimeLiteral, buildLiteralFromJs } from '../../src/utils';

const coerceLiteral = (literal) => {
  switch (literal.dataType) {
    case 'date':
      return buildDateLiteral(new Date(Date.parse(`${literal.value}T00:00:00Z`)));
    case 'datetime':
      return buildDatetimeLiteral(Date.parse(literal.value));
    case 'picklist':
      return literal;
    default:
      return buildLiteralFromJs(literal.value);
  }
};

const coerceIdentifiers = (identifiers) => {
  const newIdentifiers = {};
  Object.entries(identifiers).forEach(([identifierName, identifierProperties]) => {
    newIdentifiers[identifierName] = coerceLiteral(identifierProperties);
  });

  return newIdentifiers;
};

[
  accountManagement,
  accountMediaService,
  caseManagement,
  commissionCalculations,
  contactManagement,
  dataCategorization,
  date,
  discounting,
  employeeServices,
  expenseTracking,
  financialCalculations,
  imageLink,
  integrationLink,
  leadManagement,
  metrics,
  opportunityManagement,
  pricing,
  scoringCalculations,
].forEach((category) => {
  describe(category.name, () => {
    category.examples.forEach((example) => {
      if (!example.disabled) {
        describe(example.name, () => {
          example.suites.forEach((suite) => {
            if (!suite.disabled) {
              context(suite.context, () => {
                it('returns correct result @integration', () => {
                  expect(
                    parse(
                      example.formula,
                      coerceIdentifiers(suite.identifiers),
                    ),
                  ).to.deep.eq(coerceLiteral(suite.expectedResult));
                }).timeout(5000);
              });
            }
          });
        });
      }
    });
  });
});
