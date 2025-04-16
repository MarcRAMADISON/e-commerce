import { NextApiRequest, NextApiResponse } from 'next'



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE' && req?.body?.userPref) {
    await Promise.all(
        (req?.body?.userPref || []).map(async (pref:any)=>{
        return await fetch(`http://localhost:1337/api/preferences/${pref.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req?.body?.userToken}`
            }
        })
    }))

    res.send({
      status: 'Preferences deleted',
    })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}