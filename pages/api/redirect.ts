import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { code, state, error } = req.query;

    // 检查是否有错误返回
    if (error) {
        console.error('TikTok authorization error:', error);
        return res.status(400).json({ error: 'Authorization failed', details: error });
    }

    // 检查是否有授权码
    if (!code) {
        return res.status(400).json({ error: 'Missing authorization code' });
    }

    try {
        const clientKey = "sbawsbi6ko0re7vr3t"; // 从环境变量中获取 Client Key
        const clientSecret = "dq6h9ZVoKEpBFxjp4iKef2lyOTL8aNs2"; // 从环境变量中获取 Client Secret
        const redirectUri = "https://nextjs-dashboard-jade-rho-69.vercel.app/api/redirect"; // 从环境变量中获取 Redirect URI

        if (!clientKey || !clientSecret || !redirectUri) {
            return res.status(500).json({ error: 'Missing TikTok configuration' });
        }

        // 请求访问令牌的 URL
        const tokenUrl = 'https://open.tiktokapis.com/v2/oauth/token/';

        // 请求体
        const body = new URLSearchParams({
            client_key: clientKey,
            client_secret: clientSecret,
            code: code as string,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
        });

        // 发起 POST 请求以获取访问令牌
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body.toString(),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Failed to fetch access token:', data);
            return res.status(response.status).json({ error: data });
        }

        // 成功获取访问令牌
        const accessToken = data.data.access_token;
        const openId = data.data.open_id;
        // 重定向到前端的 dashbord 页面，携带 open_id 和 access_token
        const redirectTo = `/dashborad?open_id=${openId}&access_token=${accessToken}`;
        return res.redirect(302, redirectTo);
    } catch (error) {
        console.error('Error during TikTok redirect handling:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}