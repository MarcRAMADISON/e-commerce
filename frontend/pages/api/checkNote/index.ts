import { NextApiRequest, NextApiResponse } from 'next'



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET' && req?.query?.idArticle && req?.query?.idUser) {

    const result=await fetch(`http://localhost:1337/api/notes?fields=note&filters[article][$eq]=${req?.query?.idArticle}&filters[users_permissions_user][$eq]=${req?.query?.idUser}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        })

    const data=await result.json();

    res.send({
      status: data?.data[0]?.attributes?.note ? true : false,
    })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}