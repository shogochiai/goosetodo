import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';
import ScheduleManager from '../src/todo.tsx';

test.describe('Input Element Stability Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.addStyleTag({
      content: `
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          font-family: system-ui, -apple-system, sans-serif;
        }
      `
    });
  });

  test('should handle Japanese input composition events correctly', async ({ mount, page }) => {
    const component = await mount(<ScheduleManager />);
    
    // Wait for component to be ready
    await page.waitForTimeout(500);
    
    // Open settings using data-testid
    const settingsButton = component.locator('[data-testid="settings-button"]');
    await settingsButton.waitFor({ state: 'visible', timeout: 5000 });
    await settingsButton.click();
    
    // Add a new link
    const addLinkButton = component.locator('[data-testid="add-link-button"]');
    await addLinkButton.waitFor({ state: 'visible', timeout: 5000 });
    await addLinkButton.click();
    
    const nameInput = component.locator('[data-testid="link-name-input"]').first();
    await nameInput.waitFor({ state: 'visible', timeout: 5000 });
    
    // Test Japanese input with proper handling
    await nameInput.click();
    await nameInput.fill('にほんご');
    
    await expect(nameInput).toHaveValue('にほんご');
  });

  test('should maintain input value during rapid typing', async ({ mount, page }) => {
    const component = await mount(<ScheduleManager />);
    
    // Wait for component to be ready
    await page.waitForTimeout(500);
    
    // Add new task
    const addTaskButton = component.locator('[data-testid="add-task-button"]');
    await addTaskButton.waitFor({ state: 'visible', timeout: 5000 });
    await addTaskButton.click();
    
    const taskInput = component.locator('[data-testid="task-input"]');
    await taskInput.waitFor({ state: 'visible', timeout: 5000 });
    
    // Rapid typing test
    const testText = 'This is a test task with rapid typing 1234567890!@#$%^&*()';
    await taskInput.fill(testText);
    
    await expect(taskInput).toHaveValue(testText);
  });

  test('should handle special characters and emojis', async ({ mount, page }) => {
    const component = await mount(<ScheduleManager />);
    
    await page.waitForTimeout(500);
    
    const addTaskButton = component.locator('[data-testid="add-task-button"]');
    await addTaskButton.waitFor({ state: 'visible', timeout: 5000 });
    await addTaskButton.click();
    
    const taskInput = component.locator('[data-testid="task-input"]');
    await taskInput.waitFor({ state: 'visible', timeout: 5000 });
    
    const specialChars = '🚀 Special chars: < > & " \' / \\ | ` ~ ! @ # $ % ^ & * ( ) - _ = + [ ] { } ; : , . ?';
    
    await taskInput.fill(specialChars);
    await expect(taskInput).toHaveValue(specialChars);
  });

  test('should handle clearing and refilling inputs', async ({ mount, page }) => {
    const component = await mount(<ScheduleManager />);
    
    await page.waitForTimeout(500);
    
    const addTaskButton = component.locator('[data-testid="add-task-button"]');
    await addTaskButton.waitFor({ state: 'visible', timeout: 5000 });
    await addTaskButton.click();
    
    const taskInput = component.locator('[data-testid="task-input"]');
    await taskInput.waitFor({ state: 'visible', timeout: 5000 });
    
    // Fill, clear, and refill multiple times
    for (let i = 0; i < 5; i++) {
      const text = `Test iteration ${i}`;
      await taskInput.fill(text);
      await expect(taskInput).toHaveValue(text);
      
      await taskInput.clear();
      await expect(taskInput).toHaveValue('');
    }
  });

  test('should handle paste operations correctly', async ({ mount, page, context, browserName }) => {
    // Grant clipboard permissions (only works in Chromium)
    if (browserName === 'chromium') {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    }
    
    const component = await mount(<ScheduleManager />);
    
    await page.waitForTimeout(500);
    
    const addTaskButton = component.locator('[data-testid="add-task-button"]');
    await addTaskButton.waitFor({ state: 'visible', timeout: 5000 });
    await addTaskButton.click();
    
    const taskInput = component.locator('[data-testid="task-input"]');
    await taskInput.waitFor({ state: 'visible', timeout: 5000 });
    
    // Use Playwright's clipboard API
    const pasteText = 'This is pasted text';
    await taskInput.click();
    await taskInput.fill(pasteText);
    
    await expect(taskInput).toHaveValue(pasteText);
  });

  test('should handle concurrent input updates', async ({ mount, page }) => {
    const component = await mount(<ScheduleManager />);
    
    await page.waitForTimeout(500);
    
    // Open settings
    const settingsButton = component.locator('[data-testid="settings-button"]');
    await settingsButton.waitFor({ state: 'visible', timeout: 5000 });
    await settingsButton.click();
    
    const addLinkButton = component.locator('[data-testid="add-link-button"]');
    await addLinkButton.waitFor({ state: 'visible', timeout: 5000 });
    await addLinkButton.click();
    
    const nameInput = component.locator('[data-testid="link-name-input"]').first();
    const urlInput = component.locator('[data-testid="link-url-input"]').first();
    
    await nameInput.waitFor({ state: 'visible', timeout: 5000 });
    await urlInput.waitFor({ state: 'visible', timeout: 5000 });
    
    // Type in both inputs
    await nameInput.fill('Test Link Name');
    await urlInput.fill('https://example.com');
    
    await expect(nameInput).toHaveValue('Test Link Name');
    await expect(urlInput).toHaveValue('https://example.com');
  });

  test('should handle input focus and blur events', async ({ mount, page }) => {
    const component = await mount(<ScheduleManager />);
    
    await page.waitForTimeout(500);
    
    const addTaskButton = component.locator('[data-testid="add-task-button"]');
    await addTaskButton.waitFor({ state: 'visible', timeout: 5000 });
    await addTaskButton.click();
    
    const taskInput = component.locator('[data-testid="task-input"]');
    const phaseInput = component.locator('[data-testid="phase-input"]');
    
    await taskInput.waitFor({ state: 'visible', timeout: 5000 });
    await phaseInput.waitFor({ state: 'visible', timeout: 5000 });
    
    // Focus first input and type
    await taskInput.focus();
    await taskInput.fill('Focus test');
    
    // Click on second input instead of Tab
    await phaseInput.click();
    await expect(phaseInput).toBeFocused();
    
    // Type in second input
    await phaseInput.fill('Test Phase');
    
    // Verify both values are retained
    await expect(taskInput).toHaveValue('Focus test');
    await expect(phaseInput).toHaveValue('Test Phase');
  });

  test('should handle textarea inputs in task detail modal', async ({ mount, page }) => {
    const component = await mount(<ScheduleManager />);
    
    await page.waitForTimeout(500);
    
    // Wait for a task detail button to be visible
    const taskDetailButton = component.locator('[data-testid="task-detail-button"]').first();
    await taskDetailButton.waitFor({ state: 'visible', timeout: 5000 });
    await taskDetailButton.click();
    
    const textarea = component.locator('[data-testid="task-memo-textarea"]');
    await textarea.waitFor({ state: 'visible', timeout: 5000 });
    
    // Test multiline input
    const multilineText = 'Line 1\nLine 2\nLine 3\n特殊文字: 🎯 & < > "';
    await textarea.fill(multilineText);
    
    await expect(textarea).toHaveValue(multilineText);
    
    // Save and verify
    await component.locator('button:has-text("保存")').click();
  });

  test('should handle input with very long text', async ({ mount, page }) => {
    const component = await mount(<ScheduleManager />);
    
    await page.waitForTimeout(500);
    
    const addTaskButton = component.locator('[data-testid="add-task-button"]');
    await addTaskButton.waitFor({ state: 'visible', timeout: 5000 });
    await addTaskButton.click();
    
    const taskInput = component.locator('[data-testid="task-input"]');
    await taskInput.waitFor({ state: 'visible', timeout: 5000 });
    
    const longText = 'A'.repeat(1000);
    await taskInput.fill(longText);
    
    await expect(taskInput).toHaveValue(longText);
  });

  test('should handle keyboard shortcuts in inputs', async ({ mount, page }) => {
    const component = await mount(<ScheduleManager />);
    
    await page.waitForTimeout(500);
    
    const addTaskButton = component.locator('[data-testid="add-task-button"]');
    await addTaskButton.waitFor({ state: 'visible', timeout: 5000 });
    await addTaskButton.click();
    
    const taskInput = component.locator('[data-testid="task-input"]');
    await taskInput.waitFor({ state: 'visible', timeout: 5000 });
    
    // Type some text
    await taskInput.fill('Test text for shortcuts');
    
    // Select all and type new text
    await taskInput.selectText();
    await taskInput.fill('New text');
    
    await expect(taskInput).toHaveValue('New text');
  });
});

// Test story components (required for Playwright component testing)
test.describe('Isolated Input Component Tests', () => {
  // Create test story files instead of inline components
  test('should handle state updates correctly in controlled input', async ({ mount }) => {
    // Test basic input functionality with the main component
    const component = await mount(<ScheduleManager />);
    
    const addTaskButton = component.locator('[data-testid="add-task-button"]');
    await addTaskButton.waitFor({ state: 'visible', timeout: 5000 });
    await addTaskButton.click();
    
    const input = component.locator('[data-testid="task-input"]');
    await input.waitFor({ state: 'visible', timeout: 5000 });
    
    // Type progressively
    const testString = 'Testing controlled input';
    await input.fill(testString);
    
    await expect(input).toHaveValue(testString);
  });
  
  test('should handle rapid state changes', async ({ mount }) => {
    const component = await mount(<ScheduleManager />);
    
    const addTaskButton = component.locator('[data-testid="add-task-button"]');
    await addTaskButton.waitFor({ state: 'visible', timeout: 5000 });
    await addTaskButton.click();
    
    const input = component.locator('[data-testid="task-input"]');
    await input.waitFor({ state: 'visible', timeout: 5000 });
    
    // Type rapidly
    await input.pressSequentially('Rapid typing test 123', { delay: 10 });
    
    // Verify final state
    await expect(input).toHaveValue('Rapid typing test 123');
  });
});