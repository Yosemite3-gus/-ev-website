import { cars } from '../data/cars'
import { searchKnowledge } from '../data/knowledge'

const DEEPSEEK_BASE = 'https://api.deepseek.com'
const MODEL = 'deepseek-chat'

const SYSTEM_PROMPT = `你是"电小助"，一位专业的电动车选购顾问。你的特点：
- 熟悉中国市场在售的主流电动车（比亚迪、特斯拉、蔚来、小鹏、理想、小米、极氪、零跑、广汽埃安等）
- 能根据用户需求（预算、用途、家庭情况、充电条件）推荐合适的车型
- 回答风格：热情、专业、简洁，用数据和对比说话
- 回答控制在300字以内，重点信息用列表呈现
- 如果用户问题超出电动车领域，礼貌引导回正题`

function buildCarListContext() {
  const lines = ['## 当前热门车型数据\n']
  for (const car of cars) {
    lines.push(
      `- ${car.name} | ${car.type} | ${car.price_range} | 续航${car.range_km}km | 亮点: ${car.highlights.slice(0, 3).join(', ')}`
    )
  }
  return lines.join('\n')
}

async function callDeepSeek(messages, maxTokens = 600) {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY || localStorage.getItem('deepseek_api_key')
  if (!apiKey) throw new Error('请先设置 API Key')

  const res = await fetch(`${DEEPSEEK_BASE}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `API 请求失败 (${res.status})`)
  }

  const data = await res.json()
  return data.choices[0].message.content
}

export async function chat(query, history = []) {
  const carContext = buildCarListContext()
  const knowledgeArticles = searchKnowledge(query)

  const messages = [{ role: 'system', content: SYSTEM_PROMPT }]

  if (knowledgeArticles.length > 0) {
    const knowledgeText = knowledgeArticles.map((a) => `### ${a.title}\n${a.content}`).join('\n\n---\n')
    messages.push({ role: 'system', content: `相关知识库资料：\n${knowledgeText}` })
  }

  messages.push({ role: 'system', content: carContext })

  for (const h of history.slice(-6)) {
    messages.push({ role: h.role, content: h.content })
  }
  messages.push({ role: 'user', content: query })

  return callDeepSeek(messages, 600)
}

export async function compareCars(carNames) {
  const matched = []
  for (const name of carNames) {
    const car = cars.find((c) => name.trim() === c.name)
    if (car) matched.push(car)
  }

  if (matched.length < 2) {
    const carList = cars.map((c) => c.name).join('、')
    return `抱歉，只找到了 ${matched.length} 款车型，请确认名称。可对比的车型包括：${carList}。`
  }

  const carsJson = JSON.stringify(matched, null, 2)
  const prompt = `请对比以下${matched.length}款车型，从价格、续航、动力、充电速度、智能化、适合人群等维度分析。

车型数据：
${carsJson}

要求：
1. 先给一个总评（哪款适合什么人）
2. 用表格对比关键参数
3. 最后给出选购建议
4. 控制在400字以内`

  return callDeepSeek(
    [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    800
  )
}
