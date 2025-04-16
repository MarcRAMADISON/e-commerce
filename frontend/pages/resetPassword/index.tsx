

import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";



interface formObject {
    confirmPassword: string,
    password: string
}

const defaultValues = {
    confirmPassword: '',
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
            .fetch(`http://localhost:1337/api/auth/reset-password`, {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                    password: values?.password,
                    passwordConfirmation: values?.confirmPassword,
                    code: router.query.code
                  }),
                cache:'no-cache'
            })

    }

    return (<div>
        <input type="password" name='password' value={values?.password} onChange={handleChange} />
        <input type="password" name='confirmPassword' value={values?.confirmPassword} onChange={handleChange} />
        <button onClick={handleConnect}>Enregistrer</button>
        <Link href='/login'>Retour</Link>
    </div>
    );

}


export default IndexPage;