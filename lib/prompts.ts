/**
 * Prompt 配置文件
 * 所有世界线的 AI 生成提示词集中管理
 *
 * 每个 Prompt 包含:
 * - id: 唯一标识符，与 worldline id 对应（也用于定位 showcase 图片目录）
 * - name: 显示名称
 * - prompt: AI 生成提示词（英文）
 * - negativePrompt: 负面提示词（可选）
 * - sampleStrength: 风格强度 (0-2)
 * - tags: 标签分类
 * - hasShowcase: 是否有展示图片（默认 true）
 *
 * 展示图片约定路径: /showcase/{id}/before.png, /showcase/{id}/after.png
 */

export interface PromptConfig {
  id: string;
  name: string;
  prompt: string;
  negativePrompt?: string;
  sampleStrength: number;
  tags: string[];
  hasShowcase?: boolean; // 默认 true，表示有展示图片
  proBetter?: boolean; // 是否 Pro 模型效果更好
  showCompare?: boolean; // 默认 true，是否显示 before/after 对比；false 则只显示 after.png
}

/**
 * 所有可用的 Prompt 配置
 *
 * tags 结构：
 * - 第一个 tag: 主分类（用于检索筛选），使用 ID 格式
 * - 后续 tags: 描述性标签（个性化展示），使用 ID 格式
 * - 所有 tag 都在 i18n 中有翻译
 */
export const prompts: PromptConfig[] = [
  {
    id: 'christmas-special',
    name: '圣诞特辑',
    prompt:
      '(santa hat:1.3), (red scarf:1.2), outdoors, winter, heavy snow, snowflakes, falling snow, night, street lights, blurry background, depth of field, masterpiece, best quality, highres, soft lighting',
    negativePrompt: 'lowres, bad quality, blurry, artifacts',
    sampleStrength: 1.0,
    tags: ['christmas', 'winter'],
    showCompare: false,
  },
  {
    id: 'studio-portrait',
    name: '光影实验室',
    prompt:
      '将图片转换为摄影棚风格的顶级半身肖像照。人物穿着都市休闲服饰，动作自然放松，镜头特写、聚焦面部。背景为柔和的渐变色，层次分明，突出主体与背景的分离，并加入 gobo lighting 光影投射，形成几何或窗棂状的光影效果。画面氛围静谧而温柔，细腻胶片颗粒质感，柔和定向光轻抚面庞，在眼神处留下光点，营造经典黑白摄影的高级氛围。中心构图',
    sampleStrength: 0.75,
    tags: ['portrait', 'photon-capture', 'monochrome-matrix'],
  },
  {
    id: 'tech-startup',
    name: '硅谷原型体',
    prompt: `Edit this image. I need a professional, high-resolution, profile photo, maintaining the exact facial structure, identity, and key features of the person in the input image. The subject is framed from the chest up, with ample headroom and negative space above their head, ensuring the top of their head is not cropped. The person looks directly at the camera with a relaxed, approachable expression, and the subject's body is casually positioned with a slight lean. They are styled for a professional photo studio shoot, wearing a modern henley shirt in heather gray with rolled sleeves. The background is a solid '#141414' neutral studio. Shot from a high angle with bright and airy soft, diffused studio lighting, gently illuminating the face and creating a subtle catchlight in the eyes, conveying a sense of innovation and accessibility. Captured on an 85mm f/1.8 lens with a shallow depth of field, exquisite focus on the eyes, and beautiful, soft bokeh. Observe crisp detail on the fabric texture of the henley, individual strands of hair, and natural, realistic skin texture，keep the glass if the picture has . The atmosphere exudes confidence, innovation, and modern professionalism. Clean and bright cinematic color grading with subtle warmth and balanced tones, ensuring a polished and contemporary feel.`,
    sampleStrength: 1.0,
    tags: ['professional', 'neural-link', 'founder-mode'],
  },
  {
    id: 'collectible-figure',
    name: '量子人偶',
    prompt:
      'Create a 1/7 scale commercialized figure of the character in the illustration, in a realistic style and environment. Place the figure on a computer desk, using a circular transparent acrylic base without any text. On the computer screen, display the ZBrush modeling process of the figure. Next to the computer screen, place a BANDAI-style toy packaging box printed with the original artwork.',
    sampleStrength: 1.0,
    tags: ['3d', 'materialization', 'collection-protocol'],
  },
  {
    id: 'federal-diplomat',
    name: '联邦特使',
    prompt: `Keep the facial features of the person in the uploaded image exactly consistent. Dress them in a professional navy blue business suit with a white shirt, similar to the reference image. Background: Place the subject against a clean, solid dark gray studio photography backdrop. The background should have a subtle gradient, slightly lighter behind the subject and darker towards the edges (vignette effect). There should be no other objects. Photography Style: Shot on a Sony A7III with an 85mm f/1.4 lens, creating a flattering portrait compression. Lighting: Use a classic three-point lighting setup. The main key light should create soft, defining shadows on the face. A subtle rim light should separate the subject's shoulders and hair from the dark background. Crucial Details: Render natural skin texture with visible pores, not an airbrushed look. Add natural catchlights to the eyes. The fabric of the suit should show a subtle wool texture. Final image should be an ultra-realistic, 8k professional headshot.`,
    sampleStrength: 1.0,
    tags: ['professional', 'diplomatic-weight', 'first-contact'],
  },
  {
    id: 'puzzle-deconstruction',
    name: '解构协议',
    prompt: `Edit this image. Keep the facial features of the person in the uploaded image exactly consistent, maintaining identity and structure perfectly. The subject is posing against a clean white background. Render the face as if it is composed of interlocking jigsaw puzzle pieces—each piece is distinct with sharp edges and subtle 3D depth. The subject is delicately holding one puzzle piece removed from their cheek, revealing a hollow, pitch-black void underneath (cosmic horror style). Their gaze is direct, intense, and unwavering. Lighting is focused and directional, creating a surreal yet hyper-realistic atmosphere, accentuating the contours of the puzzle pieces and skin texture. A bold, fashion magazine title 'NTHME' is positioned behind the subject's head. Avant-garde, surrealism, 8k resolution, cinematic lighting.`,
    sampleStrength: 1.0,
    tags: ['surreal', 'topology-reconstruct', 'void-index'],
  },
  {
    id: 'reverse-engineering',
    name: '逆向工程',
    prompt: `Edit this image. Generate a technical 'reverse engineering' style character concept sheet on beige sketch-paper. Center: full-body illustration of the person in the uploaded image, maintaining facial features and identity, rendered in clean line art. Around the center: deconstruct the subject's outfit like a technical schematic with thin pencil arrows pointing to separated components. Analyze and display: 1. Clothing layers (outer shell, inner lining, bottoms, footwear). 2. Material analysis (close-ups of fabric textures, stitching patterns). 3. Inventory loadout (an open bag displaying daily items/gadgets inferred from the subject's style). 4. Three expressive headshots (emotional states). Add handwritten English annotations explaining the 'specs' of the gear. Style: 2D hand-drawn engineering blueprint, soft shadows, concept art, 4K HD.`,
    sampleStrength: 0.8,
    tags: ['concept', 'engineering-weight', 'master-craftsman'],
  },
  {
    id: 'post-apocalyptic',
    name: '末日幸存者',
    prompt: `Generate a cinematic image of [the person in this image] as a rugged survivor walking through an overgrown ruined city. Outfit: Wearing a faded plaid flannel shirt and a dirty denim jacket with holes, dark grey muddy jeans. Look: Keep the person's identity exactly as is, but make their hair messy and windblown. Apply realistic dirt, grime, and sweat to their face to match the post-apocalyptic atmosphere. The face should look weathered, not clean. Background: A desolate city street reclaimed by nature, ivy covering concrete, rusted cars, overcast soft lighting. 35mm cinematic photography.`,
    sampleStrength: 1.0,
    tags: ['cinematic', 'survival-protocol', 'wasteland-era'],
    proBetter: true,
    showCompare: false,
  },
  {
    id: 'hairstyle-matrix',
    name: '发型矩阵',
    prompt: `Create a 2x4 grid showing the man in the reference image with 8 radically different hairstyles from various subcultures.

Crucial: The hairstyles must have distinct silhouettes. Do not just generate short hair. Include long hair, shaved heads, and textured hair.
Facial Hair: Change the beard/mustache to match the personality of the hair.

The 8 Styles:

Punk Mohawk (Shaved sides, tall strip of hair)
Viking Warrior (Long braided hair + Big Beard)
The Mullet (Business front, party back + Mustache)
Slicked Undercut (Sharp, professional, clean shaven)
Long Dreadlocks (Thick texture, down to shoulders)
The Afro (Big volume, round shape)
Greaser Pompadour (High volume 50s style)
Samurai Bun (Top knot, shaved undercut)
Label each style clearly with text at the bottom.`,
    sampleStrength: 1.0,
    tags: ['portrait', 'style-morph', 'multi-variant'],
    showCompare: false,
  },
  {
    id: 'cartoon-diner',
    name: '漫画餐厅',
    prompt: `Create a mixed-media masterpiece featuring [the person in the attached image] sitting in a retro American diner.

The Style: A "Who Framed Roger Rabbit" style composite. The person must look photorealistic (keep their exact facial identity), while the food around them comes to life as flat, 2D thick-line cartoons.

The Scene: The person is holding a burger, looking shocked as their lunch attacks them.
The Cartoons: A pizza slice surfing on cheese, an angry french fry box, and flying ketchup bottles.
Details: Add comic book text bubbles like "ÑAM!" and "CRUNCH!" floating in the air.
Lighting: Warm, cinematic diner lighting. Maximum chaos, screen filled with doodles`,
    sampleStrength: 1.0,
    tags: ['surreal', 'mixed-media', 'retro-pop'],
    showCompare: false,
  },
  {
    id: 'mars-cctv',
    name: '火星监控',
    prompt: `Generate a grainy security camera frame from inside a Mars habitat airlock.

Subject: The person in the attached reference image is sitting on a crate, looking up at the camera with a tired, manic expression. They are wearing a dirty, futuristic flight suit.
Visual Style: Low-quality CCTV footage. Heavy video noise, compression blocks, and horizontal tracking lines. Fish-eye lens distortion.
Lighting: The room is bathed in red emergency lighting, but a faint cool light illuminates the subject's face so their identity is clear.
Overlay: Green pixelated text on screen reading "REC ●" and a timecode.`,
    sampleStrength: 1.0,
    tags: ['cinematic', 'found-footage', 'off-world'],
    showCompare: false,
  },
  {
    id: 'wildlife-photographer',
    name: '野生动物摄影师',
    prompt: `Create a National Geographic style shot of [the person in the attached image] as a wildlife photographer.

The Pose: He is lying on his stomach in the African savannah grass, propped up on his elbows, smiling warmly.
The Face: Keep his face uncovered and 100% accurate to the reference photo.
The Gear: A professional DSLR with a huge telephoto lens is resting on the grass in front of him (he is taking a break, not shooting).
The Scene: A cute lion cub is playfully climbing onto his shoulder.
Lighting: Stunning golden hour sunlight, cinematic depth of field, 8K ultra-realistic.`,
    sampleStrength: 1.0,
    tags: ['cinematic', 'golden-hour', 'nat-geo'],
    showCompare: false,
  },
];

/**
 * 根据 ID 获取 Prompt 配置
 */
export function getPromptById(id: string): PromptConfig | undefined {
  return prompts.find((p) => p.id === id);
}

/**
 * 根据标签过滤 Prompts
 */
export function getPromptsByTag(tag: string): PromptConfig[] {
  return prompts.filter((p) => p.tags.includes(tag));
}

/**
 * 获取所有唯一标签
 */
export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  prompts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

/**
 * 构建完整的 prompt（包含负面提示词）
 */
export function buildFullPrompt(config: PromptConfig): string {
  if (config.negativePrompt) {
    return `${config.prompt}\nNegative prompt: ${config.negativePrompt}`;
  }
  return config.prompt;
}
