#!/usr/bin/env node
/**
 * Manual test script for default_tab navigation fix
 * 
 * This script simulates the navigation logic to verify the fix works correctly.
 * Run with: node test-default-tab-navigation.js
 */

// Simple sortBy implementation (lodash equivalent)
function sortBy(array, key) {
  return [...array].sort((a, b) => {
    const aVal = typeof key === 'string' ? a[key] : key[0];
    const bVal = typeof key === 'string' ? b[key] : key[0];
    const aValue = typeof key === 'string' ? a[key] : a[aVal];
    const bValue = typeof key === 'string' ? b[key] : b[bVal];
    return aValue - bValue;
  });
}

// Simulate the navigation logic from the fix
function testNavigation(appId, apiResponseData) {
  let navigatedTo = null;
  
  const navigate = (path) => {
    navigatedTo = path;
  };

  const data = apiResponseData;
  
  // Check if default_tab exists and navigate to it
  if (data?.default_tab) {
    // If default_tab is an object with a path, use it
    if (typeof data.default_tab === 'object' && data.default_tab !== null && data.default_tab.path) {
      navigate(data.default_tab.path);
      return navigatedTo;
    }
    // If default_tab is a string, construct the path
    if (typeof data.default_tab === 'string') {
      navigate(`/app/${appId}/${data.default_tab}`);
      return navigatedTo;
    }
  }
  
  // Fallback: Check if data exists and has at least one item with a path
  if (data?.children && data.children.length > 0 && data.children[0].path) {
    const children = sortBy(data.children, 'index');
    navigate(children[0].path);
    return navigatedTo;
  }

  return navigatedTo;
}

// Test cases
const tests = [
  {
    name: 'Test 1: default_tab as object with path (approve_workflow example)',
    appId: 'approve_workflow',
    apiResponse: {
      id: 'approve_workflow',
      name: '审批中心',
      default_tab: {
        id: 'instance_tasks',
        type: 'object',
        icon: null,
        path: '/app/approve_workflow/instance_tasks',
        name: '待审批',
        tabApiName: 'object_instance_tasks'
      },
      children: [
        {
          id: 'instance_tasks',
          icon: null,
          path: '/app/approve_workflow/instance_tasks',
          name: '待审批'
        }
      ]
    },
    expected: '/app/approve_workflow/instance_tasks'
  },
  {
    name: 'Test 2: default_tab as string',
    appId: 'test_app',
    apiResponse: {
      id: 'test_app',
      default_tab: 'my_tab',
      children: []
    },
    expected: '/app/test_app/my_tab'
  },
  {
    name: 'Test 3: No default_tab, fallback to first child',
    appId: 'test_app',
    apiResponse: {
      id: 'test_app',
      children: [
        { id: 'tab1', path: '/app/test_app/tab1', index: 0 },
        { id: 'tab2', path: '/app/test_app/tab2', index: 1 }
      ]
    },
    expected: '/app/test_app/tab1'
  },
  {
    name: 'Test 4: No default_tab, children sorted by index',
    appId: 'test_app',
    apiResponse: {
      id: 'test_app',
      children: [
        { id: 'tab1', path: '/app/test_app/tab1', index: 2 },
        { id: 'tab2', path: '/app/test_app/tab2', index: 1 },
        { id: 'tab3', path: '/app/test_app/tab3', index: 0 }
      ]
    },
    expected: '/app/test_app/tab3'
  },
  {
    name: 'Test 5: default_tab is null (should fallback)',
    appId: 'test_app',
    apiResponse: {
      id: 'test_app',
      default_tab: null,
      children: [
        { id: 'tab1', path: '/app/test_app/tab1', index: 0 }
      ]
    },
    expected: '/app/test_app/tab1'
  },
  {
    name: 'Test 6: default_tab object without path (should fallback)',
    appId: 'test_app',
    apiResponse: {
      id: 'test_app',
      default_tab: { id: 'something' },
      children: [
        { id: 'tab1', path: '/app/test_app/tab1', index: 0 }
      ]
    },
    expected: '/app/test_app/tab1'
  },
  {
    name: 'Test 7: No default_tab and no children',
    appId: 'test_app',
    apiResponse: {
      id: 'test_app',
      children: []
    },
    expected: null
  }
];

// Run tests
console.log('🧪 Running default_tab navigation tests...\n');
let passed = 0;
let failed = 0;

tests.forEach((test, index) => {
  const result = testNavigation(test.appId, test.apiResponse);
  const success = result === test.expected;
  
  if (success) {
    console.log(`✅ ${test.name}`);
    console.log(`   Expected: ${test.expected}`);
    console.log(`   Got:      ${result}\n`);
    passed++;
  } else {
    console.log(`❌ ${test.name}`);
    console.log(`   Expected: ${test.expected}`);
    console.log(`   Got:      ${result}\n`);
    failed++;
  }
});

console.log('━'.repeat(60));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${tests.length} tests\n`);

if (failed === 0) {
  console.log('🎉 All tests passed! The default_tab navigation fix is working correctly.');
  process.exit(0);
} else {
  console.log('❌ Some tests failed. Please review the implementation.');
  process.exit(1);
}
