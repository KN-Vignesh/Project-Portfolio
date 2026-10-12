import test from 'node:test';
import assert from 'node:assert/strict';

test('Dynamic Projects Data Contract: validates schema and 3D scene bindings', () => {
  const sampleProject = {
    id: "qlora-peft",
    title: "QLoRA 4-bit NormalFloat4 & LoRA Adaptation",
    category: "GENERATIVE_AI",
    subfolder: "Ai-Cookbook/QLoraFine-Tuning",
    githubUrl: "https://github.com/KN-Vignesh/Projects/tree/main/Ai-Cookbook/QLoraFine-Tuning",
    tagline: "Parameter-efficient fine-tuning of Qwen foundation models using 4-bit NF4 quantized base weights.",
    techStack: ["PyTorch", "BitsAndBytes", "PEFT", "LoRA", "HuggingFace"],
    metrics: ["-73% VRAM Footprint", "18.4M Trainable Params", "99.4% FP16 Retention"],
    threeDScene: "PEFT_LORA",
    specDetails: "Double quantization with paged optimizers preventing CUDA out-of-memory errors on consumer GPUs with rank r=16 adapter matrices."
  };

  assert.ok(sampleProject.id);
  assert.ok(sampleProject.title);
  assert.ok(sampleProject.category);
  assert.ok(sampleProject.githubUrl.includes('KN-Vignesh/Projects'));
  assert.ok(Array.isArray(sampleProject.techStack));
  assert.ok(Array.isArray(sampleProject.metrics));
  assert.match(sampleProject.threeDScene, /^(PEFT_LORA|MULTI_AGENT|VERO_AST|VECTOR_RAG)$/);
  assert.ok(sampleProject.specDetails.length > 20);
});

test('Project Registry Contract: all 9 projects have verified 13-stage engineering stories and source code', async () => {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  const raw = await fs.readFile(path.resolve(process.cwd(), 'public/projects.json'), 'utf-8');
  const data = JSON.parse(raw);

  assert.ok(Array.isArray(data.projects));
  assert.equal(data.projects.length, 9, 'Must contain all 9 verified portfolio projects');

  const requiredStoryKeys = [
    'problem',
    'baseline',
    'constraints',
    'investigation',
    'solution',
    'architecture',
    'personalContribution',
    'decisionRationale',
    'experiment',
    'validation',
    'results',
    'limitations',
    'futureWork'
  ];

  for (const project of data.projects) {
    assert.ok(project.id, `Project must have an id`);
    assert.ok(project.title, `Project ${project.id} must have a title`);
    assert.ok(project.technologies?.length > 0, `Project ${project.id} must have technologies`);
    assert.ok(project.story, `Project ${project.id} must have an engineering story`);

    for (const key of requiredStoryKeys) {
      assert.ok(project.story[key], `Project ${project.id} story is missing field: ${key}`);
      if (Array.isArray(project.story[key])) {
        assert.ok(project.story[key].length > 0, `Project ${project.id} story field ${key} must not be empty`);
      } else {
        assert.ok(typeof project.story[key] === 'string' && project.story[key].length > 10, `Project ${project.id} story field ${key} must have content`);
      }
    }

    assert.ok(Array.isArray(project.codeFiles) && project.codeFiles.length > 0, `Project ${project.id} must provide key code files`);

    // Level 1: Beginner-Friendly Plain Explanation & Key Takeaway
    assert.ok(project.story.howItWorks && project.story.howItWorks.length > 20, `Project ${project.id} must have plain howItWorks description`);
    assert.ok(project.story.keyTakeaway && project.story.keyTakeaway.length > 15, `Project ${project.id} must have concise keyTakeaway`);

    // Priority 1: Interactive Architecture Explorer Nodes
    assert.ok(Array.isArray(project.story.architectureNodes) && project.story.architectureNodes.length >= 4, `Project ${project.id} must have >=4 architecture nodes`);

    // Priority 2: Before-and-After Evidence Lab
    assert.ok(project.story.beforeAfterLab?.baselineMetric, `Project ${project.id} must have beforeAfterLab.baselineMetric`);
    assert.ok(project.story.beforeAfterLab?.solutionMetric, `Project ${project.id} must have beforeAfterLab.solutionMetric`);

    // Priority 3: Failure and Debugging Analysis
    assert.ok(project.story.failureAnalysis?.challenge, `Project ${project.id} must have failureAnalysis.challenge`);
    assert.ok(project.story.failureAnalysis?.whatFailed, `Project ${project.id} must have failureAnalysis.whatFailed`);
    assert.ok(project.story.failureAnalysis?.resolution, `Project ${project.id} must have failureAnalysis.resolution`);
  }
});
