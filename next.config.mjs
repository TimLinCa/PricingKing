/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/',
                destination: '/gp/home',

            },
        ]
    },

};



export default nextConfig;
