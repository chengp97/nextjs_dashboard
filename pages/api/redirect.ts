import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { code, state, error } = req.query;

    if (error) {
        console.error('TikTok authorization error:', error);
        return res.status(400).json({ error: 'Authorization failed', details: error });
    }

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

        const tokenUrl = 'https://open.tiktokapis.com/v2/oauth/token/';
        const body = new URLSearchParams({
            client_key: clientKey,
            client_secret: clientSecret,
            code: code as string,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
        });

        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body.toString(),
        });

        const data = await response.json();
        console.log('TikTok API Response:', data);

        if (!response.ok || !data.data || !data.data.access_token) {
            console.error('Failed to fetch access token:', data);
            return res.status(response.status).json({ error: data });
        }

        const accessToken = data.data.access_token;
        const openId = data.data.open_id;

        // 重定向到前端的 dashboard 页面，携带 open_id 和 access_token
        const redirectTo = `/dashboard?open_id=${openId}&access_token=${accessToken}`;
        res.redirect(302, redirectTo);
    } catch (error) {
        console.error('Error during TikTok redirect handling:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}