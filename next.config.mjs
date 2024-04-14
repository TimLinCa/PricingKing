/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/pages/pk/home',
                permanent: false,
            },
        ]
    },
    experimental: {
        serverComponentsExternalPackages: [
            "puppeteer-core",
            "@sparticuz/chromium-min",
        ],
    }
};

export default nextConfig;
