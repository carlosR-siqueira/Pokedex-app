/** @type {import('next').NextConfig} */
const nextConfig = {

images: {
    remotePatterns: [
        {
            protocol: 'https',
            hostname: 'pngimg.com',
            port: '',
            pathname: '**'
        },
        {
            protocol: 'https',
            hostname: 'raw.githubusercontent.com',
            port: '',
            pathname: '**'
        }
    ]
}
}
export default nextConfig;


