export default {
  plugins: {
    '@tailwindcss/postcss': {
      content: ['./src/**/*.{js,ts,jsx,tsx,html}'], // 确保包含你所有的组件路径
    },
  },
};
