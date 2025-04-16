import { NextApiRequest, NextApiResponse } from 'next'



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET' && req?.query?.idArticle) {

    const result=await fetch(`http://localhost:1337/api/notes?fields=note&filters[article][$eq]=${req?.query?.idArticle}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        })

    const data=await result.json();

    const notes=data.data.map((note:any)=>note.attributes.note)

    const total=(notes || []).reduce((total:number,current:number)=>{
        return total+current
    },0)

    const averageNote=parseFloat(total)/notes.length

    res.send({
      note: parseFloat(averageNote as any),
      nombre: notes.length
    })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}