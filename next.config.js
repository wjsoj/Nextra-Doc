// next.config.js
module.exports = async () => {
  const withNextra = (await import('nextra')).default({
    theme: 'nextra-theme-docs',
    themeConfig: './theme.config.tsx',
    latex: true,
  });

  return withNextra();
};
