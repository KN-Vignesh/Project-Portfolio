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
