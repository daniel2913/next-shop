/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: false,
})
const nextConfig = withBundleAnalyzer({
	experimental: {},
	typescript: {
		ignoreBuildErrors: true //FIsg
	},
	eslint: {
		ignoreDuringBuilds: true
	},
	images: {
		loader: 'custom',
		loaderFile: './src/helpers/imageLoader.ts'
	},
	webpack(config) {
		const fileLoaderRule = config.module.rules.find((rule) =>
			rule.test?.test?.(".svg"),
		);
		config.module.rules.push(
			{
				...fileLoaderRule,
				test: /\.svg$/i,
				resourceQuery: /url/,
			},
			{
				test: /\.svg$/i,
				resourceQuery: { not: /url/ },
				use: ["@svgr/webpack"],
			},
		);
		fileLoaderRule.exclude = /\.svg$/i;
		config.experiments = {
			topLevelAwait: true,
			layers: true,
		};
		return config;
	},
});
module.exports = nextConfig;
