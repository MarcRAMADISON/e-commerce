import { NextApiRequest, NextApiResponse } from 'next'



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET' && req?.query?.email) {

    const result=await fetch(`http://localhost:1337/api/users?filters[email][$eq]=${req?.query?.email}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        })

    const data=await result.json();
    res.send({
      user:data[0]
    })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}