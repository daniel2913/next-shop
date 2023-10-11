/** @type {import('next').NextConfig} */

const nextConfig = {
    sassOptions: {},
    experimental: {
        esmExternals: 'loose',
        appDir: true,
        serverComponentsExternalPackages: ['mongodb', 'mongoose'],
        serverActions: true,
    },
    webpack(config) {
        const fileLoaderRule = config.module.rules.find((rule) =>
            rule.test?.test?.('.svg')
        )

        config.module.rules.push(
            {
                ...fileLoaderRule,
                test: /\.svg$/i,
                resourceQuery: /url/,
            },
            {
                test: /\.svg$/i,
                issuer: /\.[jt]sx?$/,
                resourceQuery: { not: /url/ },
                use: ['@svgr/webpack'],
            }
        )
        fileLoaderRule.exclude = /\.svg$/i
        config.experiments = {
            topLevelAwait: true,
            layers: true,
        }
        return config
    },
}
module.exports = nextConfig
