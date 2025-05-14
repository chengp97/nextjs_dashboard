import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { access_token } = req.query;

    if (!access_token) {
        return res.status(400).json({ error: 'Missing access token' });
    }

    try {
        // 使用访问令牌获取用户信息
        const userInfoUrl = `https://open.tiktokapis.com/v2/user/info/`;
        const userInfoResponse = await fetch(userInfoUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access_token}`,
            },
        });

        const userInfoData = await userInfoResponse.json();

        if (!userInfoResponse.ok) {
            console.error('Failed to fetch user info:', userInfoData);
            return res.status(userInfoResponse.status).json({ error: userInfoData });
        }

        // 返回用户信息
        return res.status(200).json(userInfoData);
    } catch (error) {
        console.error('Error fetching user info:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}