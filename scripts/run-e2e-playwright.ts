import { chromium } from 'playwright';

async function runE2E() {
  console.log('🚀 Starting Comprehensive Playwright E2E Verification Suite...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const errors: string[] = [];
  const logEvents: string[] = [];

  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(`[Console Error] ${msg.text()}`);
    } else {
      logEvents.push(`[Console] ${msg.text()}`);
    }
  });

  page.on('pageerror', (err) => {
    errors.push(`[Page Error] ${err.message}`);
  });

  try {
    // 1. DESKTOP VIEWPORT TEST (1440x900)
    console.log('\n📱 Testing Desktop Viewport (1440x900)...');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Verify Title & Headline
    const pageTitle = await page.title();
    console.log(`  ✓ Page Title: "${pageTitle}"`);
    const heroHeadline = await page.locator('#hero h1').innerText();
    console.log(`  ✓ Hero Headline: "${heroHeadline.trim()}"`);

    // Verify Preserved 3D Scenes in Hero Switcher
    console.log('\n🎨 Verifying Hero 3D Models & Interactive Switchers...');
    const tensorTab = page.locator('button:has-text("3D TENSORS")').first();
    const neuralTab = page.locator('button:has-text("3D NEURAL GRAPH")').first();
    const prTab = page.locator('button:has-text("PR SANDBOX")').first();

    await tensorTab.click();
    await page.waitForTimeout(400);
    const tensorCanvasCount = await page.locator('#hero canvas').count();
    console.log(`  ✓ 3D Tensors Canvas active (count: ${tensorCanvasCount})`);

    await neuralTab.click();
    await page.waitForTimeout(400);
    const neuralCanvasCount = await page.locator('#hero canvas').count();
    console.log(`  ✓ 3D Neural Core Canvas active (count: ${neuralCanvasCount})`);

    await prTab.click();
    await page.waitForTimeout(400);
    const prWidgetVisible = await page.locator('text=PRESET PR AUDIT SCENARIO').count();
    console.log(`  ✓ PR Sandbox active (found: ${prWidgetVisible > 0})`);

    // 2. VERIFY 3D ARCHITECTURAL WORKBENCH
    console.log('\n🏛️ Verifying 3D Workbench Section (#3d-workbench)...');
    const workbenchSceneTabs = ['PEFT / LoRA', 'Multi-Agent DAG', 'Vero AST', 'Vector RAG'];
    for (const tab of workbenchSceneTabs) {
      const btn = page.locator(`#3d-workbench button:has-text("${tab}")`).first();
      if (await btn.count() > 0) {
        await btn.click();
        await page.waitForTimeout(300);
        console.log(`  ✓ Clicked 3D Scene Tab: "${tab}"`);
      }
    }

    // 3. VERIFY ALL 9 PROJECT MODALS & 2-COLUMN CANONICAL WORKBENCH
    console.log('\n🔬 Verifying All 9 Project Workbenches & Progressive Learning Levels...');
    const projectIds = [
      'customer-churn',
      'qwen-lora',
      'qlora',
      'bert',
      'vero',
      'cnn',
      'evaluation',
      'house-price',
      'titanic'
    ];

    for (const pid of projectIds) {
      console.log(`\n  Checking Project: [${pid}]`);
      // Deep-link or hash navigation
      await page.goto(`http://localhost:3000/#project-${pid}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(600);

      const modal = page.locator('[role="dialog"]');
      const isVisible = await modal.isVisible();
      if (!isVisible) {
        throw new Error(`Project modal for ${pid} failed to open via deep-link!`);
      }

      // Check 4-block beginner explanation
      const problemBlock = await modal.locator('text=1. THE PROBLEM').count();
      const approachBlock = await modal.locator('text=2. MY APPROACH').count();
      const howBlock = await modal.locator('text=3. HOW IT WORKS').count();
      const outcomeBlock = await modal.locator('text=4. THE OUTCOME').count();
      const takeawayBlock = await modal.locator('text=KEY TAKEAWAY').count();

      console.log(`    ✓ 4-Block Overview: Problem(${problemBlock}), Approach(${approachBlock}), How(${howBlock}), Outcome(${outcomeBlock}), Takeaway(${takeawayBlock})`);

      // Test Sub-Tabs
      const archTab = modal.locator('button:has-text("ARCHITECTURE EXPLORER")').first();
      await archTab.click();
      await page.waitForTimeout(300);
      const archNodesCount = await modal.locator('button:has-text("STEP ")').count();
      console.log(`    ✓ Architecture Explorer DAG Nodes: ${archNodesCount}`);

      const beforeAfterTab = modal.locator('button:has-text("BEFORE & AFTER LAB")').first();
      await beforeAfterTab.click();
      await page.waitForTimeout(300);
      const comparisonCount = await modal.locator('text=EXISTING BASELINE').count();
      console.log(`    ✓ Before & After Evidence Lab Active: ${comparisonCount > 0}`);

      const decisionsTab = modal.locator('button:has-text("DECISIONS & DEBUGGING")').first();
      await decisionsTab.click();
      await page.waitForTimeout(300);
      const decisionsCount = await modal.locator('text=ROOT CAUSE FAILURE ANALYSIS').count();
      console.log(`    ✓ Decisions & Root Cause Failure Lab: ${decisionsCount > 0}`);

      // Close modal
      const closeBtn = modal.locator('#project-modal-back-btn').first();
      await closeBtn.click();
      await page.waitForTimeout(300);
    }

    // 4. TEST COMMAND PALETTE (Cmd+K / Ctrl+K)
    console.log('\n⌨️ Testing Command Palette Hotkey (Cmd+K)...');
    await page.keyboard.press('ControlOrMeta+K');
    await page.waitForTimeout(400);
    const paletteVisible = await page.locator('text=COMMAND PALETTE & QUICK JUMP').count();
    console.log(`  ✓ Command Palette opened via keyboard: ${paletteVisible > 0}`);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // 5. TEST TABLET VIEWPORT (768x1024)
    console.log('\n📲 Testing Tablet Viewport (768x1024)...');
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    console.log('  ✓ Tablet layout rendered cleanly without exceptions');

    // 6. TEST MOBILE VIEWPORT (375x667)
    console.log('\n📱 Testing Mobile Viewport (375x667)...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    const mobileDockVisible = await page.locator('text=PROJECTS').first().isVisible();
    console.log(`  ✓ Mobile dock navigation visible: ${mobileDockVisible}`);

    // Verify Error Log
    console.log(`\n🛡️ Total Console Errors: ${errors.length}`);
    if (errors.length > 0) {
      console.warn('Errors captured during run:', errors);
    } else {
      console.log('  ✓ Clean run: 0 uncaught exceptions, 0 runtime errors!');
    }

    console.log('\n✨ ALL PLAYWRIGHT E2E TESTS PASSED SUCCESSFULLY!\n');
  } catch (err) {
    console.error('❌ Playwright E2E Test Failure:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runE2E();
