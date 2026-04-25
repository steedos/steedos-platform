export const VALID_FIELD_TYPES = new Set([
  'text', 'textarea', 'html', 'select', 'color', 'boolean', 'toggle',
  'date', 'datetime', 'time', 'number', 'currency', 'percent', 'password',
  'lookup', 'master_detail', 'grid', 'table', 'url', 'email', 'avatar',
  'location', 'image', 'object', '[object]', '[Object]', '[grid]', '[text]',
  'selectCity', 'audio', 'filesize', 'file', 'code', 'autonumber',
  'markdown', 'formula', 'summary',
]);

export const VALID_TRIGGER_WHEN = new Set([
  'beforeInsert', 'afterInsert', 'beforeUpdate', 'afterUpdate',
  'beforeDelete', 'afterDelete', 'beforeFind', 'afterFind',
  'afterFindOne', 'afterCount', 'beforeAggregate', 'afterAggregate',
]);

export const VALID_BUTTON_ON = new Set([
  'list', 'record', 'record_more', 'list_item',
  'record_only', 'record_only_more', 'list_record',
]);

export const VALID_FILTER_SCOPES = new Set(['space', 'mine', 'all']);

export const VALID_SORT_ORDERS = new Set(['asc', 'desc']);

export const VALID_SUMMARY_TYPES = new Set(['count', 'sum', 'min', 'max', 'avg']);

export const VALID_FORMULA_BLANK_VALUES = new Set(['zeroes', 'blanks']);

export const VALID_SLDS_ICONS = new Set([
  'account', 'action_list_component', 'actions_and_buttons', 'activation_target',
  'address', 'all', 'announcement', 'answer_best', 'answer_private', 'answer_public',
  'apex', 'app', 'approval', 'apps', 'article', 'asset_action', 'asset_relationship',
  'assigned_resource', 'assignment', 'avatar', 'bot', 'branch_merge',
  'brand', 'budget', 'bundle_config', 'bundle_policy', 'business_hours',
  'calibration', 'call', 'call_history', 'campaign', 'campaign_members',
  'canvas', 'capacity_plan', 'care_request', 'carousel', 'case',
  'case_change_status', 'case_comment', 'case_milestone', 'category',
  'change_request', 'channel_programs', 'chart', 'chat', 'choice',
  'client', 'cms', 'coaching', 'code_playground', 'collection',
  'connected_apps', 'contact', 'contact_request', 'contract',
  'contract_line_item', 'custom', 'customer', 'customers',
  'dashboard', 'data_streams', 'datashare_target', 'default',
  'delegated_account', 'device', 'document', 'drafts',
  'email', 'employee', 'employee_contact', 'employee_job',
  'employee_organization', 'empty', 'endorsement', 'entitlement',
  'entitlement_process', 'entity', 'entity_milestone', 'environment_hub',
  'event', 'expense', 'expense_report',
  'feed', 'feedback', 'file', 'filter', 'first_non_empty',
  'flow', 'folder', 'form', 'formula', 'fulfillment_order',
  'generic_loading', 'goals', 'group_loading', 'groups', 'guidance_center',
  'hierarchy', 'home', 'household',
  'immunization', 'incident', 'individual', 'insights',
  'investment_account', 'invocable_action', 'iot_context', 'iot_orchestrations',
  'job_family', 'job_position', 'job_profile',
  'kanban', 'key_dates', 'knowledge',
  'lead', 'letterhead', 'lightning_component', 'link', 'list_email',
  'live_chat', 'location', 'log_a_call', 'loop',
  'macros', 'maintenance_asset', 'maintenance_plan',
  'marketing_actions', 'merge', 'messaging_conversation',
  'messaging_session', 'messaging_user', 'metrics', 'multi_picklist',
  'news', 'note', 'number_input',
  'observation_component', 'office365', 'omni_supervisor',
  'operating_hours', 'opportunity', 'opportunity_contact_role',
  'opportunity_splits', 'orchestrator', 'order_item', 'orders',
  'outcome', 'output',
  'partner_fund_allocation', 'partner_fund_claim',
  'partner_fund_request', 'partner_marketing_budget', 'partners',
  'password', 'past_chat', 'people', 'performance', 'permission_set',
  'person_account', 'photo', 'picklist_type', 'planogram',
  'poll', 'portal', 'post', 'price_book_entries', 'price_books',
  'pricebook', 'procedure', 'process', 'product',
  'product_consumed', 'product_item', 'product_required',
  'product_service_campaign', 'product_transfer', 'product_warranty_term',
  'products', 'profile', 'prompt', 'propagation_policy',
  'proposition', 'qualification', 'queue', 'question_best', 'question_feed',
  'quick_text', 'quip', 'quotation_line_item', 'quotes',
  'recent', 'record', 'record_create', 'record_delete', 'record_update',
  'recycle_bin', 'related_list', 'relationship', 'report', 'resource_absence',
  'resource_capacity', 'resource_preference', 'resource_skill',
  'return_order', 'return_order_line_item', 'reward', 'rtc_presence',
  'sales_path', 'scan_card', 'schedule_objective', 'screen',
  'search', 'section', 'segments', 'service_appointment',
  'service_contract', 'service_crew', 'service_crew_member',
  'service_report', 'service_resource', 'service_territory',
  'settings', 'setup_modal', 'shift', 'shift_pattern',
  'shift_pattern_entry', 'shift_preference', 'shift_scheduling_operation',
  'shift_template', 'skill', 'skill_entity', 'skill_requirement',
  'snippet', 'snippets', 'social', 'solution', 'sort', 'sort_policy',
  'sossession', 'stage', 'stage_collection', 'steps',
  'store', 'story', 'strategy', 'survey', 'swarm_request', 'swarm_session',
  'system_and_global_variable',
  'tab_definition', 'task', 'task2', 'team_member', 'template',
  'text', 'text_template', 'textarea', 'thanks', 'timesheet',
  'timesheet_entry', 'timeslot', 'today', 'toll_free_number', 'topic',
  'topic2', 'trailhead', 'travel_mode', 'type_tool',
  'unmatched', 'user', 'user_role',
  'variable', 'variation_attribute_setup', 'variation_products', 'video',
  'visit_templates', 'visits', 'visualforce_page', 'voice_call',
  'waits', 'warranty_term', 'water', 'web_cart', 'work_capacity_limit',
  'work_capacity_usage', 'work_contract', 'work_forecast',
  'work_order', 'work_order_item', 'work_plan', 'work_plan_rule',
  'work_plan_template', 'work_plan_template_entry', 'work_queue',
  'work_step', 'work_step_template', 'work_type', 'work_type_group',
]);

export const SNAKE_CASE_REGEX = /^[a-z_][a-z0-9_]*$/;
