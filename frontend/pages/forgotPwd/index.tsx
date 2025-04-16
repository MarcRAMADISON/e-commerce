//This is a loggin page

import { useState } from "react";
import { setLocalStorage, theme } from "../../utils/utils";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../components/layout";
import { Button, Paper, TextField, Typography } from "@mui/material";



interface formObject {
    email: string,
    name: string,
    password: string
}

const defaultValues = {
    email: '',
    name: '',
    password: ''
}

const IndexPage = () => {
    const [values, setValues] = useState<formObject>(defaultValues)
    const router = useRouter()

    const handleChange = (event: any) => {
        event.preventDefault();
        setValues((prev: formObject) => ({ ...prev, [event.target.name]: event.target.value }))
    }


    const handleConnect = (event: any) => {
        event.preventDefault();
        event.stopPropagation();

        window
            .fetch(`http://localhost:1337/api/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: values.email
                }),
                cache: 'no-cache'
            })

    }

    return (
        <Layout showMenuBar={false}>
            <Paper sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: "30px", mt: '50px' }}>
                <Typography variant='h6'>Mot de passe oublié</Typography>
                <TextField sx={{ minWidth: '300px', mt: '20px' }} label='votre adresse e-mail' type="email" name='email' value={values?.email} onChange={handleChange} />
                <Button sx={{ minWidth: '300px', mt: '50px' }} variant='contained' onClick={handleConnect}>Envoyer un mail de récupération</Button>
                <Link style={{marginTop:'20px',color:theme.palette.primary.main}} href='/login'>Retour</Link>
            </Paper>
        </Layout>
    );

}


export default IndexPage;