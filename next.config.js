
const URL = process.env.NEXT_PUBLIC_PUBLIC_API_URL || "";
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' ${URL} blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
`;

/** @type {import('next').NextConfig} */
export default {
	experimental: {
	},
	async headers() {
		return process.env.NODE_ENV === "production" ? [
			{
				source: "/(.*)",
				headers: [
					{
						key: "Content-Security-Policy",
						value: cspHeader.replace(/\n/g, ""),
					},
				],
			},
		] : [];
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		loader: "custom",
		loaderFile: "./src/helpers/imageLoader.ts",
	},
	/**@param config {import("next/dist/server/config-shared").NextJsWebpackConfig} */
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

};
