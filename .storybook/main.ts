import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';

const config: StorybookConfig = {
	stories: [
		"../src/**/*.mdx",
		"../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
	],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-onboarding",
		"@storybook/addon-interactions",
		"@storybook/addon-actions/register"
	],
	framework: {
		name: "@storybook/nextjs",
		options: {}
	},
	features:{
	},
	docs: {
		autodocs: "tag"
	},
	
	webpackFinal: async (config) => {
		if (config.resolve && config.module?.rules) {
			config.resolve.alias = {
				...config.resolve.alias,
				'@': path.resolve(__dirname, '../src'),
				'@public': path.resolve(__dirname, '../public'),
				'@comps': path.resolve(__dirname, '../src/components'),
				 "next-auth/react":path.resolve(__dirname,"../src/__mocks__/next-auth/react.ts"),
				 "next/navigation":path.resolve(__dirname,"../src/__mocks__/next/navigation.ts"),
				 [path.resolve(__dirname,"../src/actions/user")]:path.resolve(__dirname,"../src/__mocks__/userActions.ts"),
				//[path.resolve(__dirname,"../src/store/ToastStore")]:path.resolve(__dirname,"../src/__mocks__/useToastStore.tsx"),
				[path.resolve(__dirname,"../src/store/modalStore")]:path.resolve(__dirname,"../src/__mocks__/useModalStore.tsx"),
			};
const imageRule = config.module.rules.find((rule) => {
    if (typeof rule !== 'string' && rule.test instanceof RegExp) {
      return rule.test.test('.svg')
    }
  })
  if (typeof imageRule !== 'string') {
    imageRule.exclude = /\.svg$/
  }

  config.module.rules.push({
    test: /\.svg$/,
    use: ['@svgr/webpack'],
  })
		}
		return config;
	}
};
export default config;
