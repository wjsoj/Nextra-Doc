import { useState, useEffect, useRef } from 'react';
import { CountUp } from 'countup.js';
import { useCompletion } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import { Textarea, Select, SelectItem, Code, Chip } from "@nextui-org/react";
import { homeworks } from "./constant.js"

export default function Homework() {
  const [attempt, setAttempt] = useState(1);
  const [content, setContent] = useState('');
  const [totalScore, setTotalScore] = useState(100);
  const [questions, setQuestions] = useState<string[]>([]);
  const [deductions, setDeductions] = useState<number[]>([]);
  const [completionCount, setCompletionCount] = useState(0); // 添加判分计数
  const totalScoreRef = useRef(null);
  const [previousTotalScore, setPreviousTotalScore] = useState(100);
  const [problemQuestions, setProblematicQuestions] = useState<string[]>([]);

  const handleSubmit = () => {
    setTotalScore(100);
    setDeductions([]);
    setQuestions([]);
    setQuestions([]);
    setCompletionCount(0);
    setProblematicQuestions([]);

    const regex = /思考题\s*\d+-\d+-\d+[\s\S]*?(?=(思考题\s*\d+-\d+-\d+|$))/g;
    const matches = content.match(regex);
    const extractedQuestions = matches ? matches.map(match => match.trim()) : [];
    if (extractedQuestions.length === 0) {
      return;
    }
    setQuestions(extractedQuestions);
  };

  // 定义处理扣分的函数
  const handleDeduction = (deduction: number, questionNumber: string) => {
    setDeductions(prev => {
      const newDeductions = prev.slice();
      newDeductions.push(deduction);
      return newDeductions;
    });
    if (deduction > 0) {
      setProblematicQuestions(prev => [...prev, questionNumber]);
    }
  };

  useEffect(() => {
    const totalDeduction = deductions.reduce((total, ded) => total + ded, 0);
    setTotalScore(100 - totalDeduction);
  }, [deductions]);

  useEffect(() => {
    if (totalScoreRef.current) {
      const countUp = new CountUp(totalScoreRef.current, totalScore, {
        startVal: previousTotalScore,
      });
      countUp.start();
    }
    setPreviousTotalScore(totalScore);
  }, [totalScore]);

  useEffect(() => {
    if (completionCount === questions.length && questions.length > 0) {
      // 判分完毕，清空输入框
      setContent('');
    }
  }, [completionCount]);

  return (
    <div className="p-4">
      <Select
        items={homeworks}
        isRequired
        label="作业"
        labelPlacement='outside'
        placeholder='选择思考题作业'
        disabledKeys={["3"]}
        className='max-w-sm'
        onChange={(e) => setAttempt(parseInt(e.target.value))}
      >
        {(homework) => (
          <SelectItem key={homework.key}>
            {homework.label}
          </SelectItem>
        )}
      </Select>

      <Textarea
        minRows={3}
        maxRows={20}
        label="粘贴文本"
        labelPlacement='outside'
        placeholder="请粘贴notebook文本"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className='w-full mt-1 pr-2 flex flex-row justify-between items-center'>
        <div className="flex items-center">
          <button type="button" className="inline-flex shrink-0 justify-center items-center size-8 rounded-lg text-gray-500 hover:bg-gray-100 focus:z-10 focus:outline-none focus:bg-gray-100 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2"></rect>
              <line x1="9" x2="15" y1="15" y2="9"></line>
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-x-1">
          <button type="button" className="inline-flex shrink-0 justify-center items-center size-8 w-16 rounded-lg text-white bg-blue-600 hover:bg-blue-500 focus:z-10 focus:outline-none focus:bg-blue-500"  onClick={handleSubmit}>
            <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"></path>
            </svg>
            <span className='text-sm ml-2'>提交</span>
          </button>
        </div>
      </div>
      
      {
        completionCount ? 
        <div className='mb-8 mt-4 flex flex-row justify-between w-full items-center'>
          <div>
            <span className='text-slate-700 dark:text-slate-400'>总分：</span>
            <p className='text-4xl font-bold' ref={totalScoreRef}></p>
          </div>
          <div>
            <span className='text-slate-700 dark:text-slate-400'>题目总数：</span>
            <p className='text-4xl font-bold'>{questions.length}</p>
          </div>
          <div>
            <span className='text-slate-700 dark:text-slate-400'>有问题的题目：</span>
            {/* 创建一系列Link，利用id锚点，点击即可到达题号 */}
            <div className='flex flex-row flex-wrap items-center space-x-2'>
              {problemQuestions.map((questionNumber, index) => (
                <a key={index} href={`#${questionNumber}`} className='font-semibold text-sky-800 dark:text-sky-300 text-lg hover:underline'>{questionNumber}</a>
              ))}
            </div>
          </div>
        </div> : null
      }
      {/* 分界线 */}
      <hr className='my-4' />
      <div className='flex flex-col space-y-6'>
        {questions.map((question, index) => (
          <CompletionOutput
            attempt={attempt}
            key={index}
            question={question}
            onDeduction={(deduction: number) => handleDeduction( deduction, question.match(/思考题\s*(\d+-\d+-\d+)/)?.[1] || '')} // 传递扣分处理函数和题号
            onComplete={() => setCompletionCount(prev => prev + 1)} // 判分完成计数增加
          />
        ))}
      </div>
    </div>
  );
};

const CompletionOutput = ({ attempt, question, onDeduction, onComplete }: { attempt: number; question: string; onDeduction: (deduction: number) => void; onComplete: () => void }) => {
  const { completion, complete } = useCompletion({
    api: '/api/homework',
  });
  const [deduction, setDeduction] = useState(0);
  const [loading, setLoading] = useState(false);
  const [questionNumber, setQuestionNumber] = useState('');

  useEffect(() => {
    const fetchCompletion = async () => {
      // 从 question 中提取题号
      const match = question.match(/思考题\s*(\d+-\d+-\d+)/);
      const questionNumber = match ? match[1] : '';
      setQuestionNumber(questionNumber);
      setLoading(true);
      await complete(`${attempt}黉${questionNumber}黉${question}`);
      setLoading(false);
    };
    fetchCompletion();
  }, [attempt, question]);

  useEffect(() => {
    if (completion && !loading) {
      const ded = extractDeduction(completion);
      setDeduction(ded);
      onDeduction(ded); // 将扣分传递给父组件
      onComplete(); // 通知父组件判分完成
    };
  }, [loading]);

  return (
    <div className='flex flex-col justify-center'>
      <div className='flex flex-row space-x-4 items-center'>
        <h2 id={questionNumber} className='text-xl font-bold'>思考题 {questionNumber}</h2>
        <Chip size='sm' color={loading ? 'default' : (deduction ? 'warning' : 'success')} className='mr-2'>
          {loading ? '判分中' : (deduction ? '扣'+deduction+'分' : '无扣分')}
        </Chip>
      </div>
      <Code className='text-wrap my-2'>{question}</Code>
      {/* 使用 react-markdown 渲染 AI 的回答，并添加 Tailwind CSS 类 */}
      {completion && (
        <ReactMarkdown className="prose prose-sm max-w-none">
          {completion}
        </ReactMarkdown>
      )}
    </div>
  );
};

const extractDeduction = (aiResponse: string): number => {
  const match = aiResponse.match(/扣分：(\d)/);
  return match ? parseInt(match[1], 10) : 0;
};
