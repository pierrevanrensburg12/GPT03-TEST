import fetch from 'node-fetch';

type CampaignInput = {
  name: string;
  budget: number;
};

export async function launchCampaign({ tenantId, campaign }: { tenantId: number; campaign: CampaignInput }) {
  const spendingCap = 1000; // placeholder
  if (campaign.budget > spendingCap) {
    throw new Error('Budget exceeds cap');
  }
  let attempt = 0;
  const maxAttempts = 3;
  const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

  while (attempt < maxAttempts) {
    try {
      console.log('Creating campaign for tenant', tenantId);
      // Placeholder call to Marketing API
      const res = await fetch('https://graph.facebook.com/v19.0/act_xxx/campaigns', { method: 'POST' });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      console.log('Campaign created', data.id);
      return { id: data.id, status: 'created' };
    } catch (err: any) {
      attempt++;
      if (attempt >= maxAttempts || err.status < 500) {
        throw err;
      }
      const wait = 2 ** attempt * 1000;
      console.log(`Retrying in ${wait}ms`);
      await delay(wait);
    }
  }
}
