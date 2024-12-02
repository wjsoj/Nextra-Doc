import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai'
import { prompts } from './prompts.js';

const openai = createOpenAI({
	apiKey: process.env.OPENAI_API_KEY,
	baseURL: process.env.OPENAI_BASE_URL,
});

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  // 按逗号分隔字符串，分别赋给attempt, questionNumber, question = 
  const [attempt, questionNumber, question] = prompt.split('黉');
  const fullPrompt = `
  **题目内容和学生回答：** ${question}

  **题目和评分标准：** ${prompts[questionNumber]}
  `;
  // console.log(fullPrompt);

  const response = await streamText({
    model: openai('gpt-4o-mini'),
    system: `
    你是计算概论课程作业思考题打分助手，请根据用户提供的题目内容和评分标准，给出一行简单的评语和扣分数目，输出格式如下：

    评语：这里填写一行尽量短的评语

    扣分：这里填写扣分数目，没有扣分也需要输出0，一个数字，范围是0-5

    对于一道题，最多只能扣5分，如果代码运行报错或者没有提供相关代码或答案，5分扣完。
    请按照提供的评分要点给分，没有回答出要点或没有按照评分要求完成，酌情扣分1-3分。
    答出要点即可给满分，评分可以适当宽松，对代码、输出格式不作要求。请对照题目和学生的回答，对于没有做题的情况5分扣完。
    `,
    prompt: fullPrompt,
  })

  return response.toDataStreamResponse();
}
