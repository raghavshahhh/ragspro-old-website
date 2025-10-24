export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { email } = req.body

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Valid email required' })
  }

  try {
    // Mailchimp expects API key in Basic auth (anystring:APIKEY base64) or use server SDK
    const listId = process.env.MAILCHIMP_LIST_ID
    const apiKey = process.env.MAILCHIMP_API_KEY

    if (!listId || !apiKey) {
      console.error('Mailchimp env vars missing')
      return res.status(500).json({ message: 'Mailchimp not configured' })
    }

    const auth = Buffer.from(`anystring:${apiKey}`).toString('base64')
    const response = await fetch(`https://us1.api.mailchimp.com/3.0/lists/${listId}/members`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
        tags: ['ragspro-website']
      })
    })

    if (response.ok) {
      return res.status(200).json({ message: 'Successfully subscribed!' })
    } else {
      throw new Error('Newsletter service error')
    }
  } catch (error) {
    console.error('Newsletter signup error:', error)
    return res.status(500).json({ message: 'Subscription failed. Please try again.' })
  }
}