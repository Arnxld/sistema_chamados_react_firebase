import { useState } from 'react';
import './customers.css'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiUser } from 'react-icons/fi'
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';

export default function Customers() {
    const [nomeFantasia, setNomeFantasia] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [endereco, setEndereco] = useState('')

    async function handleAdd(e) {
        e.preventDefault()

        if(nomeFantasia !== '' && cnpj !== '' && endereco !== '') {
            await firebase.firestore().collection('customers')
            .add({
                nomeFantasia,
                cnpj,
                endereco
            })
            .then(() => {
                setNomeFantasia('')
                setCnpj('')
                setEndereco('')

                toast.info('Cliente cadastrado com sucesso')
            })
            .catch((error) => {
                console.log(error)
                toast.error('Erro ao cadastrar cliente')
            })
        }
        else {
            toast.error('Preencha todos os campos!')
        }
    }

    return (
        <div>
            <Header/>
            <div className="content">
                <Title name="Clientes">
                    <FiUser size={24} />
                </Title>

                <div className="container">
                    <form className="form-profile customers" onSubmit={handleAdd}>
                        <label>Nome Fantasia</label>
                        <input type="text" placeholder="Nome da empresa" value={nomeFantasia} onChange={(e) => setNomeFantasia(e.target.value)}/>

                        <label>CNPJ</label>
                        <input type="text" placeholder="CNPJ" value={cnpj} onChange={(e) => setCnpj(e.target.value)}/>

                        <label>Endereço</label>
                        <input type="text" placeholder="Endereço da empresa" value={endereco} onChange={(e) => setEndereco(e.target.value)}/>

                        <button type="submit">Cadastrar Cliente</button>
                    </form>
                </div>
            </div>
        </div>
    )
}