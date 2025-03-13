import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span className='text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-br from-indigo-700 to-pink-600 dark:from-indigo-200 dark:to-pink-100'>计算概论（C）</span>,
  darkMode: true,
  project: {
    link: 'https://github.com/wjsoj/Nextra-Doc',
  },
  // chat: {
  //   link: 'https://discord.com',
  // },
  docsRepositoryBase: 'https://github.com/wjsoj/Nextra-Doc',
  footer: {
    content: (
      <div>
        2024年秋季计算概论（C）Python 2班 课程团队
        <br />
        基于 <a className='text-sky-800 dark:text-sky-200' href="https://nextra.site" target="_blank">Nextra</a>  构建
      </div>
    ),
  },
  banner: {
    key: '文档施工中',
    content: (<span>🎉 2024年秋季学期已结束，文档站进入归档状态</span>),
  }
}

export default config
