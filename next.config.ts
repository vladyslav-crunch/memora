import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                port: "",
                pathname: "**",
            },
        ],
    },

    // // ✅ delete later
    // typescript: {
    //     ignoreBuildErrors: true,
    // },
    //
    // // ✅ delete later
    // eslint: {
    //     ignoreDuringBuilds: true,
    // },
};

export default nextConfig;
