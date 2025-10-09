# Trigger

By writing triggers, you can automatically trigger a piece of server-side code before and after record creation, deletion, and changes, achieving personalized data validation and processing.

### Listening Objects

The listenTo parameter is used to specify the objects to which the trigger should be applied. This parameter is used to define the listening objects of the trigger, and indicates that the trigger should only be activated when the specified objects are affected by record creation, deletion, or changes. In other words, it allows the trigger to listen to specific objects and perform corresponding data validation and processing based on the changes made to those objects.

### Trigger Before Event

A trigger before the event can be used to validate whether the data input by the user is correct. If there is an issue, an error message will be thrown and fed back to the front-end operation page. Additionally, it can also be used in conjunction with permission control to verify the current operation.

* beforeInsert
* beforeUpdate
* beforeDelete
* beforeFind

### Trigger After Event

A trigger after the event can be used to execute associated events, such as sending notifications to specified personnel after a task has been created.

* afterFind
* afterInsert
* afterUpdate
* afterDelete

## Trigger Execution

In the trigger execution function, you can use "ctx.params" to obtain the following variables.

Variable | Usage
-- | --
isInsert | Returns true if this trigger is triggered by an insert operation (from the Steedos user interface, service, or API).
isUpdate | Returns true if this trigger is triggered by an update operation (from the Steedos user interface, service, or API).
isDelete | Returns true if this trigger is triggered by a delete operation (from the Steedos user interface, service, or API).
isFind | Returns true if this trigger is triggered by a query operation (from the Steedos user interface, service, or API).
isBefore | Returns true if this trigger is triggered before any record operation.
isAfter | Returns true if this trigger is triggered after all record operations.
id | The unique identifier of the record [string].
doc | The record content that needs to be added/modified [json].
previousDoc | The record before modifying/deleting [json], exists when afterUpdate or afterDelete is triggered.
userId | The unique identifier of the current user [string].
spaceId | The current workspace [string].
objectName | The current object name [string].
query | Query data-related parameters [json], exists when beforeFind is triggered.
data | Query result, exists when afterFind is triggered.