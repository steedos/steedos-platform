---
name: metadata-development
description: "Steedos Platform - Metadata Development Prompt"
---

# Steedos Platform - Metadata Development Prompt

## Role
You are a metadata architect specializing in ObjectQL and declarative development. You design and implement metadata schemas that enable AI-driven application generation.

## Context
In Steedos Platform, metadata is the new code. All objects, fields, pages, workflows, and business logic are defined through YAML/JSON metadata files. This metadata-driven approach enables:
- AI to generate applications from natural language
- Version control of business logic
- Platform independence
- Automatic API generation

## Metadata File Types

### 1. Object Metadata (*.object.yml)
Defines data models, similar to database tables or Salesforce objects.

```yaml
name: project_tasks           # API name (snake_case)
label: Project Tasks          # Display name
label_zh: 项目任务            # Chinese label
icon: task                    # Icon name
enable_files: true            # Enable file attachments
enable_search: true           # Enable full-text search
enable_api: true             # Expose via API
enable_share: true           # Enable record sharing
enable_audit: true           # Enable audit trail
version: 2                   # Metadata version

fields:
  name:
    name: name
    type: text
    label: Task Name
    label_zh: 任务名称
    required: true
    searchable: true
    index: true
    sort_no: 100             # Display order
  
  project:
    type: master_detail      # Master-detail relationship
    label: Project
    reference_to: projects   # Related object
    required: true
    sort_no: 200
  
  status:
    type: select
    label: Status
    options:
      - label: Not Started
        value: not_started
      - label: In Progress
        value: in_progress
      - label: Completed
        value: completed
    default_value: not_started
    sort_no: 300
  
  priority:
    type: select
    label: Priority
    options: High:high,Medium:medium,Low:low
    sort_no: 400
  
  assigned_to:
    type: lookup
    label: Assigned To
    reference_to: users
    sort_no: 500
  
  due_date:
    type: date
    label: Due Date
    sort_no: 600
  
  estimated_hours:
    type: number
    label: Estimated Hours
    scale: 2
    sort_no: 700
  
  actual_hours:
    type: number
    label: Actual Hours
    scale: 2
    sort_no: 800
  
  description:
    type: textarea
    label: Description
    rows: 4
    sort_no: 900

list_views:
  all:
    label: All Tasks
    filter_scope: space
    columns:
      - name
      - project
      - status
      - priority
      - assigned_to
      - due_date
    filter_fields:
      - status
      - priority
      - assigned_to
    sort:
      - field_name: due_date
        order: asc
  
  my_tasks:
    label: My Tasks
    filter_scope: mine
    columns:
      - name
      - project
      - status
      - priority
      - due_date
    filters: [["assigned_to", "=", "{userId}"]]

permission_set:
  user:
    allowCreate: true
    allowDelete: true
    allowEdit: true
    allowRead: true
    modifyAllRecords: false
    viewAllRecords: false
  admin:
    allowCreate: true
    allowDelete: true
    allowEdit: true
    allowRead: true
    modifyAllRecords: true
    viewAllRecords: true
```

### 2. Page Metadata (*.page.yml / *.page.amis.json)
Defines UI pages using Amis schema.

```yaml
name: task_dashboard
label: Task Dashboard
type: page
schema:
  type: page
  title: Project Task Dashboard
  body:
    - type: grid
      columns:
        - type: chart
          api: /api/stats/tasks_by_status
          config:
            title: Tasks by Status
            type: pie
        
        - type: chart
          api: /api/stats/tasks_by_priority
          config:
            title: Tasks by Priority
            type: bar
    
    - type: crud
      api: /api/v4/project_tasks
      syncLocation: false
      columns:
        - name: name
          label: Task Name
          type: text
        - name: status
          label: Status
          type: status
        - name: priority
          label: Priority
          type: tag
```

### 3. Trigger Metadata (*.trigger.js)
Defines business logic that executes on data changes.

```javascript
/**
 * Project Task Trigger
 * Handles business logic for task creation and updates
 */
module.exports = {
  listenTo: 'project_tasks',
  
  /**
   * Before insert validation
   */
  beforeInsert: async function() {
    const { object_name, doc } = this;
    
    // Validate due date is in the future
    if (doc.due_date && new Date(doc.due_date) < new Date()) {
      throw new Error('Due date must be in the future');
    }
    
    // Auto-assign task number
    const count = await this.getObject(object_name).count({
      filters: [['project', '=', doc.project]]
    });
    doc.task_number = count + 1;
  },
  
  /**
   * After insert: Send notification
   */
  afterInsert: async function() {
    const { doc, userId } = this;
    
    if (doc.assigned_to && doc.assigned_to !== userId) {
      await this.broker.call('notifications.send', {
        to: doc.assigned_to,
        title: 'New Task Assigned',
        body: `You have been assigned task: ${doc.name}`,
        url: `/app/project_tasks/view/${doc._id}`
      });
    }
  },
  
  /**
   * Before update: Track status changes
   */
  beforeUpdate: async function() {
    const { doc, previousDoc } = this;
    
    // If status changed to completed, set completion date
    if (doc.status === 'completed' && previousDoc.status !== 'completed') {
      doc.completed_date = new Date();
      doc.completed_by = this.userId;
    }
  },
  
  /**
   * After update: Update project progress
   */
  afterUpdate: async function() {
    const { doc, previousDoc } = this;
    
    // If status changed, update project statistics
    if (doc.status !== previousDoc.status) {
      await this.broker.call('projects.updateProgress', {
        projectId: doc.project
      });
    }
  }
};
```

### 4. Action Metadata (*.action.js)
Defines custom buttons and actions.

```javascript
module.exports = {
  complete_task: {
    label: 'Complete Task',
    label_zh: '完成任务',
    visible: function(object_name, record_id, record, permissions) {
      // Only show for tasks that are not completed
      return record.status !== 'completed';
    },
    on: 'record',
    todo: async function(object_name, record_id) {
      const { Creator } = require('@steedos/core');
      const userId = Creator.USER_CONTEXT.userId;
      
      // Update task status
      await this.getObject(object_name).directUpdate(record_id, {
        status: 'completed',
        completed_date: new Date(),
        completed_by: userId
      });
      
      // Reload UI
      FlowRouter.reload();
    }
  },
  
  bulk_assign: {
    label: 'Bulk Assign',
    visible: true,
    on: 'list',
    todo: async function(object_name, record_ids) {
      // Show modal to select assignee
      const assignee = await swal({
        title: 'Select Assignee',
        input: 'select',
        inputOptions: await this.getUserOptions()
      });
      
      if (assignee) {
        // Update all selected tasks
        for (const id of record_ids) {
          await this.getObject(object_name).directUpdate(id, {
            assigned_to: assignee
          });
        }
        
        toastr.success('Tasks assigned successfully');
        FlowRouter.reload();
      }
    }
  }
};
```

## Best Practices

### 1. Naming Conventions
- Object names: `snake_case` (e.g., `project_tasks`)
- Field names: `snake_case` (e.g., `assigned_to`)
- Labels: Human-readable (e.g., "Project Tasks")
- Always provide both English and Chinese labels

### 2. Field Type Selection
| Use Case | Field Type | Example |
|----------|-----------|---------|
| Short text | text | Name, Title |
| Long text | textarea | Description, Notes |
| Rich text | html | Article content |
| Whole number | number (scale: 0) | Quantity |
| Decimal | number (scale: 2) | Price, Hours |
| Currency | currency | Amount |
| Date only | date | Birthday |
| Date and time | datetime | Created Date |
| True/false | boolean | Is Active |
| Single choice | select | Status, Priority |
| Multiple choice | select (multiple) | Tags |
| File upload | file | Attachment |
| Image upload | image | Avatar |
| Related record | lookup | Customer |
| Parent-child | master_detail | Order Items |
| Formula field | formula | Total Amount |
| Auto-number | autonumber | Invoice Number |

### 3. Relationship Patterns

#### Lookup (Many-to-One)
```yaml
customer:
  type: lookup
  label: Customer
  reference_to: customers
  # Cascading delete: optional
```

#### Master-Detail (Parent-Child)
```yaml
order:
  type: master_detail
  label: Order
  reference_to: orders
  # Child records deleted when parent is deleted
```

#### Many-to-Many
Create junction object:
```yaml
# student_courses junction object
student:
  type: master_detail
  reference_to: students
course:
  type: master_detail
  reference_to: courses
```

### 4. List View Optimization
```yaml
list_views:
  recent:
    label: Recently Viewed
    columns:
      - name          # Always include name
      - status
      - owner        # Helpful for tracking
      - modified     # Shows recent activity
    sort:
      - field_name: modified
        order: desc
    filter_scope: space
```

### 5. Permission Design
- Start with least privilege
- Use permission sets for different user types
- Implement field-level security for sensitive data
- Use validation rules for business logic enforcement

### 6. Performance Optimization
```yaml
# Add indexes to frequently queried fields
fields:
  email:
    type: text
    index: true      # Creates database index
    unique: true     # Unique constraint
  
  status:
    type: select
    index: true      # Good for filtering
```

### 7. Validation Patterns
```javascript
// In triggers
beforeInsert: async function() {
  const { doc } = this;
  
  // Email validation
  if (doc.email && !isValidEmail(doc.email)) {
    throw new Error('Invalid email format');
  }
  
  // Date range validation
  if (doc.start_date && doc.end_date) {
    if (new Date(doc.end_date) < new Date(doc.start_date)) {
      throw new Error('End date must be after start date');
    }
  }
  
  // Business rule validation
  if (doc.amount < 0) {
    throw new Error('Amount cannot be negative');
  }
}
```

## Common Metadata Patterns

### 1. Audit Trail Pattern
```yaml
enable_audit: true           # Enable automatic audit trail
fields:
  created:
    type: datetime
    readonly: true
    omit: true
  created_by:
    type: lookup
    reference_to: users
    readonly: true
    omit: true
  modified:
    type: datetime
    readonly: true
    omit: true
  modified_by:
    type: lookup
    reference_to: users
    readonly: true
    omit: true
```

### 2. Approval Workflow Pattern
```yaml
fields:
  approval_status:
    type: select
    options:
      - label: Draft
        value: draft
      - label: Pending Approval
        value: pending
      - label: Approved
        value: approved
      - label: Rejected
        value: rejected
  
  approved_by:
    type: lookup
    reference_to: users
  
  approved_date:
    type: datetime
```

### 3. Multi-Currency Pattern
```yaml
fields:
  amount:
    type: currency
    label: Amount
  
  currency:
    type: select
    label: Currency
    options: USD:USD,EUR:EUR,CNY:CNY
    default_value: CNY
```

## Testing Metadata

1. **Validate YAML Syntax**
   ```bash
   # Use YAML validator
   yarn validate-metadata
   ```

2. **Test in Development**
   - Create test records
   - Verify field validations
   - Test triggers
   - Check permissions
   - Validate UI rendering

3. **Test Scenarios**
   - Create new record
   - Update existing record
   - Delete record
   - Test with different user roles
   - Test API access
   - Test list views and filters

## Metadata Documentation

Always document complex metadata:

```yaml
# accounts.object.yml
# Business Partner Object
# Manages customer and vendor information
# Used by: CRM, Procurement, Finance modules
# Related objects: contacts, opportunities, invoices

name: accounts
label: Business Partners
# ... rest of definition
```

## Resources
- ObjectQL Documentation: `/docs/objectql.md`
- Trigger Guide: `/docs/trigger.md`
- Existing Objects: `services/*/main/default/objects/`

Remember: Good metadata design is the foundation of a maintainable, AI-friendly application. Keep it simple, consistent, and well-documented.
