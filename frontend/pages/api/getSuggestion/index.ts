import { NextApiRequest, NextApiResponse } from 'next'



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET' && req?.query?.idUser && req?.headers?.authorization) {

    const result = await fetch(`http://localhost:1337/api/preferences?populate[0]=categorie.articles.images&populate[1]=categorie.images&filters[users_permissions_user][$eq]=${req?.query?.idUser}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${req?.headers?.authorization}`
      }
    })

    const preferences = await result?.json();
    const categories = (preferences?.data || []).map((data) => data?.attributes?.categorie?.data)
    const articles = (categories || []).map((categorie) => categorie.attributes.articles)
    const formatArticle = (articles || []).map((article) => article.data)
    const suggestions = (formatArticle || []).reduce((total, current) => {
      const res = current.map((c) => ({ id: c.id, ...c.attributes }))
      return [...total, ...res];
    }, [])

    res.send({
      suggestions: req.query.start && req.query.limit ? 
      suggestions.slice(req.query.start, parseInt(req?.query?.start as any, 10) + parseInt(req?.query?.limit as any, 10)) : 
      suggestions.slice(0, 6),
      length:Math.ceil(suggestions.length/parseInt(req?.query?.limit as any))
    })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}