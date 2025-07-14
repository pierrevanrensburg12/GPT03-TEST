import express from 'express';
import fetch from 'node-fetch';
import crypto from 'crypto';
// Placeholder AWS KMS encrypt
function encryptToken(token: string): string {
  return Buffer.from(token).toString('base64');
}

const app = express();

app.get('/facebook/connect', (req, res) => {
  const tenantId = req.query.tenant_id as string;
  const appId = process.env.FB_APP_ID || 'APP_ID';
  const redirectUri = process.env.FB_REDIRECT_URI || 'http://localhost:3000/facebook/callback';
  const scopes = [
    'business_management',
    'pages_manage_metadata',
    'pages_read_engagement',
    'ads_management',
    'pages_show_list'
  ].join(',');
  const oauthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&state=${tenantId}`;
  res.redirect(oauthUrl);
});

app.get('/facebook/callback', async (req, res) => {
  const code = req.query.code as string;
  const tenantId = req.query.state as string; // from state
  const appId = process.env.FB_APP_ID || 'APP_ID';
  const appSecret = process.env.FB_APP_SECRET || 'APP_SECRET';
  const redirectUri = process.env.FB_REDIRECT_URI || 'http://localhost:3000/facebook/callback';
  try {
    const tokenRes = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${code}`);
    const tokenData = await tokenRes.json() as any;
    const longLivedToken = tokenData.access_token;

    // Placeholder FBE API call
    const fbeRes = await fetch('https://graph.facebook.com/v19.0/me?fields=id', {
      headers: { Authorization: `Bearer ${longLivedToken}` }
    });
    const fbeData = await fbeRes.json() as any;

    const encryptedToken = encryptToken(longLivedToken);
    // Store into facebook_assets - placeholder
    console.log('Storing token for tenant', tenantId, encryptedToken, fbeData);

    res.send('Facebook connected');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error during Facebook connect');
  }
});

export default app;
