import * as _ from 'underscore'

import { objectsToDb } from '../collection/object'
import { fieldsToDb } from '../collection/field'
import { actionsToDb } from '../collection/action'
import { listviewsToDb } from '../collection/listview'
import { validationsToDb } from '../collection/objectValidation'
import { objectPermissionsToDb } from '../collection/objectPermission'
import { permissionSetsToDb } from '../collection/permissionset'
import { applicationsToDb } from '../collection/application'
import { reportsToDb } from '../collection/report'
import { workflowsToDb } from '../collection/workflow'
import { flowsToDb } from '../collection/flow'
import { approvalProcessesToDb } from '../collection/approvalProcess'
import { rolesToDb } from '../collection/role'
import { flowRolesToDb } from '../collection/flowRole'
import { layoutsToDb } from '../collection/layout'

import { QueryCollection } from '../collection/query';
import { ChartCollection } from '../collection/chart';
import { PageCollection } from '../collection/page';
import { TabCollection } from '../collection/tab'
import { ShareRuleCollection } from '../collection/shareRule'
import { RestrictionRuleCollection } from '../collection/restrictionRule'
import { ProcessCollection } from '../collection/process'
import { TriggerCollection } from '../collection/trigger'
import { ImportCollection } from '../collection/import'
import { QuestionCollection } from '../collection/question'
import { DashboardCollection } from '../collection/dashboard'
import { PrintCollection } from '../collection/print'
import { FunctionCollection } from '../collection/function'

const queryCollection = new QueryCollection();
const chartCollection = new ChartCollection();
const pageCollection = new PageCollection();
const tabCollection = new TabCollection();
const shareRuleCollection = new ShareRuleCollection();
const restrictionRuleCollection = new RestrictionRuleCollection();
const processCollection = new ProcessCollection();
const triggerCollection = new TriggerCollection();
const importCollection = new ImportCollection();
const questionCollection = new QuestionCollection();
const dashboardCollection = new DashboardCollection();
const printCollection = new PrintCollection();
const functionCollection = new FunctionCollection();

import { SteedosMetadataTypeInfoKeys as TypeInfoKeys, getMetadataTypeInfo, hasChild, getChilds } from '@steedos/metadata-core';

async function metatdataRecordsToDb(dbManager, metadataName, metatdataRecords, parentName?, assistRecords?) {

    switch (metadataName) {
        case TypeInfoKeys.Object:
            await objectsToDb(dbManager, metatdataRecords);
            break;

        case TypeInfoKeys.Field:
            await fieldsToDb(dbManager, metatdataRecords, parentName);
            break;

        case TypeInfoKeys.Action:
            await actionsToDb(dbManager, metatdataRecords, parentName);
            break;

        case TypeInfoKeys.Listview:
            await listviewsToDb(dbManager, metatdataRecords, parentName);
            break;

        case TypeInfoKeys.Permission:
            await objectPermissionsToDb(dbManager, metatdataRecords, assistRecords, parentName);
            break;

        case TypeInfoKeys.ValidationRule:
            await validationsToDb(dbManager, metatdataRecords, parentName);
            break;

        case TypeInfoKeys.Permissionset:
            await permissionSetsToDb(dbManager, metatdataRecords);
            break;

        case TypeInfoKeys.Profile:
            await permissionSetsToDb(dbManager, metatdataRecords, true);
            break;

        case TypeInfoKeys.Process:
            await processCollection.deploy(dbManager, metatdataRecords);
            break;

        case TypeInfoKeys.Application:
            await applicationsToDb(dbManager, metatdataRecords);
            break;

        case TypeInfoKeys.Report:
            await reportsToDb(dbManager, metatdataRecords);
            break;

        case TypeInfoKeys.Workflow:
            await workflowsToDb(dbManager, metatdataRecords);
            break;

        case TypeInfoKeys.Flow:
            await flowsToDb(dbManager, metatdataRecords);
            break;

        case TypeInfoKeys.ApprovalProcess:
            await approvalProcessesToDb(dbManager, metatdataRecords);
            break;

        case TypeInfoKeys.Role:
            await rolesToDb(dbManager, metatdataRecords);
            break;

        case TypeInfoKeys.FlowRole:
            await flowRolesToDb(dbManager, metatdataRecords);
            break;

        case TypeInfoKeys.Layout:
            await layoutsToDb(dbManager, metatdataRecords);
            break;

        case TypeInfoKeys.Chart:
            await chartCollection.deploy(dbManager, metatdataRecords);
            break;

        case TypeInfoKeys.Query:
            await queryCollection.deploy(dbManager, metatdataRecords);
            break;

        case TypeInfoKeys.Page:
            await pageCollection.deploy(dbManager, metatdataRecords);
            break;
        case TypeInfoKeys.Tab:
            await tabCollection.deploy(dbManager, metatdataRecords);
            break;
        case TypeInfoKeys.ShareRule:
            await shareRuleCollection.deploy(dbManager, metatdataRecords);
            break;
        case TypeInfoKeys.RestrictionRule:
            await restrictionRuleCollection.deploy(dbManager, metatdataRecords);
            break;
        case TypeInfoKeys.Trigger:
            await triggerCollection.deploy(dbManager, metatdataRecords);
            break;
        case TypeInfoKeys.Import:
            await importCollection.deploy(dbManager, metatdataRecords);
            break;
        case TypeInfoKeys.Question:
            await questionCollection.deploy(dbManager, metatdataRecords);
            break;
        case TypeInfoKeys.Dashboard:
            await dashboardCollection.deploy(dbManager, metatdataRecords);
            break;
        case TypeInfoKeys.Print:
            await printCollection.deploy(dbManager, metatdataRecords);
            break;
        case TypeInfoKeys.FunctionYML:
            await functionCollection.deploy(dbManager, metatdataRecords);
            break;
        default:
            break;
    }
}
export async function jsonToDb(steedosPackage, dbManager, session) {

    const transactionOptions: any = {
        readPreference: 'primary',
        readConcern: { level: 'majority' },
        writeConcern: { w: 'majority' }
    };

    try {
        await session.withTransaction(async () => {

            const topKeys = [TypeInfoKeys.Profile, TypeInfoKeys.Permissionset, TypeInfoKeys.Role, TypeInfoKeys.FlowRole, TypeInfoKeys.Object]
            var keys = _.sortBy(_.keys(steedosPackage), function (key) {
                return _.include(topKeys, key) ? -1 : 1
            })

            for (const metadataName of keys) {
                var metatdataRecords = steedosPackage[metadataName];
                if (hasChild(metadataName)) {

                    const childs = getChilds(metadataName)

                    for (const metatdataRecordName in metatdataRecords) { // accounts,agreement
                        var metatdataRecord = metatdataRecords[metatdataRecordName];
                        for (const childMetadataName of childs) {
                            var childMetadataRecords = metatdataRecord[childMetadataName];

                            if (childMetadataName == TypeInfoKeys.Permission) {
                                var assistRecords = steedosPackage[TypeInfoKeys.Permissionset]
                                await metatdataRecordsToDb(dbManager, childMetadataName, childMetadataRecords, metatdataRecordName, assistRecords);
                            } else {

                                await metatdataRecordsToDb(dbManager, childMetadataName, childMetadataRecords, metatdataRecordName);
                            }
                            delete metatdataRecord[childMetadataName];
                        }
                    }
                }
                await metatdataRecordsToDb(dbManager, metadataName, metatdataRecords)
            }


        }, transactionOptions);
    } catch (err) {
        console.log(err)
        throw err
    }

}