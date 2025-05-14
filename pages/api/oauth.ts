import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const clientKey = "sbawsbi6ko0re7vr3t"; // 从环境变量中获取 Client Key
    const redirectUri = "https://nextjs-dashboard-jade-rho-69.vercel.app/api/redirect"; // 从环境变量中获取 Redirect URI

    if (!clientKey || !redirectUri) {
        return res.status(500).json({ error: 'Missing TikTok configuration' });
    }
    const csrfState = Math.random().toString(36).substring(2)
    // 组装 TikTok 授权 URL
    let tiktokAuthUrl = "https://www.tiktok.com/v2/auth/authorize/";
    // the following params need to be in `application/x-www-form-urlencoded` format.
    tiktokAuthUrl += `?client_key=${clientKey}`;
    tiktokAuthUrl += "&scope=user.info.basic";
    tiktokAuthUrl += "&response_type=code";
    tiktokAuthUrl += `&redirect_uri=${redirectUri}`;
    tiktokAuthUrl += "&state=" + csrfState;

    // 重定向到 TikTok 授权 URL
    res.redirect(tiktokAuthUrl);
}