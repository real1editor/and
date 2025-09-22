// api/feedback.js - Express router
const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

router.post('/', async (req,res) => {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
  const { name, email, message } = req.body || {};
  if (!message) return res.status(400).json({ ok:false, error:'Message is required' });

  const date = new Date().toLocaleString('en-GB', { timeZone:'UTC', day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
  const telegramMessage = `💡 *New Feedback Submission*\n\n👤 *Name:* ${name || 'Not provided'}\n📧 *Email:* ${email || 'Not provided'}\n💬 *Feedback:* ${message}\n\n⏱ _UTC_: ${date}`;

  if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
    console.warn('BOT_TOKEN or ADMIN_CHAT_ID not set — returning success without Telegram notification');
    return res.json({ ok:true, forwarded:false });
  }

  try{
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method:'POST', headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ chat_id: ADMIN_CHAT_ID, text: telegramMessage, parse_mode: 'Markdown' })
    });
    const data = await response.json();
    if (!data.ok) return res.status(500).json({ ok:false, error:'Telegram error' });
    return res.json({ ok:true, forwarded:true });
  } catch(err){ console.error(err); return res.status(500).json({ ok:false, error:'Internal error' }); }
});

module.exports = router;
