import { NextApiRequest, NextApiResponse } from 'next'



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE' && req?.query?.idUser && req?.headers?.authorization) {

    const [commandes, paniers, comments, preferences,notes] = await Promise.all([
      await fetch(
        `http://localhost:1337/api/commandes?fields=id&filters[users_permissions_user][$eq]=${req?.query?.idUser}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: req?.headers?.authorization,
          },
        }
      ),
      await fetch(
        `http://localhost:1337/api/paniers?fields=id&filters[users_permissions_user][$eq]=${req?.query?.idUser}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: req?.headers?.authorization,
          },
        }
      ),
      await fetch(
        `http://localhost:1337/api/comments?fields=id&filters[users_permissions_user][$eq]=${req?.query?.idUser}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ),
      await fetch(
        `http://localhost:1337/api/preferences?fields=id&filters[users_permissions_user][$eq]=${req?.query?.idUser}`,
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization': `${req?.headers?.authorization}`
          },
        }
      ),
      await fetch(
        `http://localhost:1337/api/notes?fields=id&filters[users_permissions_user][$eq]=${req?.query?.idUser}`,
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization': `${req?.headers?.authorization}`
          },
        }
      )
    ])


    const dataComment = await comments.json();
    const dataPanier = await paniers.json();
    const dataCommande = await commandes.json();
    const dataPreference = await preferences.json();
    const dataNotes=await notes.json();

    if (dataNotes?.data?.length) {
      await Promise.all(dataNotes.data.map(async (note) => {
        return await fetch(`http://localhost:1337/api/notes/${note.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': req?.headers?.authorization
          }
        })
      }))
    }

    if (dataPreference?.data?.length) {
      await Promise.all(dataPreference.data.map(async (preference) => {
        return await fetch(`http://localhost:1337/api/preferences/${preference.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': req?.headers?.authorization
          }
        })
      }))
    }

    if (dataCommande?.data?.length) {
      await Promise.all(dataCommande.data.map(async (commande) => {
        return await fetch(`http://localhost:1337/api/commandes/${commande.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': req?.headers?.authorization
          }
        })
      }))
    }


    if (dataPanier?.data?.length) {
      await Promise.all(dataPanier.data.map(async (panier) => {
        console.log('comment', panier.id, req?.headers?.authorization)
        return await fetch(`http://localhost:1337/api/paniers/${panier.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': req?.headers?.authorization
          }
        })
      }))
    }


    if (dataComment?.data?.length) {
      await Promise.all(dataComment.data.map(async (comment) => {
        console.log('comment', comment.id, req?.headers?.authorization)
        return await fetch(`http://localhost:1337/api/comments/${comment.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': req?.headers?.authorization
          }
        })
      }))
    }

    const result = await fetch(`http://localhost:1337/api/users/${req?.query?.idUser}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req?.headers?.authorization
      }
    })

    const data = await result.json();

    res.send({
      data: data,
    })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}