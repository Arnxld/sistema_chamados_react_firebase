import Header from "../../components/Header"
import Title from "../../components/Title"
import './new.css'
import { FiPlus } from "react-icons/fi"
import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../contexts/auth"
import firebase from '../../services/firebaseConnection'
import { toast } from "react-toastify"
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min"

export default function New() {
    const {id} = useParams()
    const history = useHistory()

    const [customers, setCustomers] = useState([])
    const [loadCustomers, setLoadCustomers] = useState(true)
    const [customerSelected, setCustomerSelected] = useState(0)

    const [assunto, setAssunto] = useState('Suporte') // porque ao entrar na pagina já vai estar selecionado suporte
    const [status, setStatus] = useState('Aberto') 
    const [complemento, setComplemento] = useState('')

    // state para verificar se há id passado na rota e se é válido
    const [idCustomer, setIdCustomer] = useState(false)

    const { user } = useContext(AuthContext)

    useEffect(() => {
        async function loadCustomers() {
            await firebase.firestore().collection('customers')
            .get()
            .then((snapshot) => {
                let lista = []

                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia
                    })
                })

                if(lista.length === 0) {
                    console.log('Nenhuma empresa encontrada')
                    setCustomers([{id:'1', nomeFantasia:'freela' }])
                    setLoadCustomers(false)
                    return
                }

                setCustomers(lista)
                setLoadCustomers(false)

                if (id) {
                    loadId(lista)
                }
            })
            .catch((error) => {
                console.log('Algo errado aconteceu', error)
                setLoadCustomers(false)
                setCustomers([{id:'1', nomeFantasia:'' }])
            })
        }

        loadCustomers();
    }, [id])


    // troca de assunto
    function handleChangeSelect(e) {
        setAssunto(e.target.value)
    }

    //troca de status
    function handleOptionChange(e) {
        setStatus(e.target.value)
    }

    // troca de cliente
    function handleChangeCustomers(e) {
        setCustomerSelected(e.target.value)
    }

    async function handleRegister(e) {
        e.preventDefault()

        if(idCustomer) {
            await firebase.firestore().collection('chamados')
            .doc(id)
            .update({
                cliente: customers[customerSelected].nomeFantasia,
                clienteId: customers[customerSelected].id,
                assunto,
                status,
                complemento,
                userId: user.uid
            })
            .then(() => {
                toast.success('Chamado atualizado com sucesso')

                setCustomerSelected(0);
                setComplemento('')
                history.push('/dashboard')
            })
            .catch((err) => {
                toast.error('Erro ao editar, tente novamente mais tarde.')
                console.log(err)
            })

            return
        }

        await firebase.firestore().collection('chamados')
        .add({
           created: new Date(),
           cliente: customers[customerSelected].nomeFantasia,
           clienteId:  customers[customerSelected].id,
           assunto,
           status,
           complemento,
           userId: user.uid
        })
        .then(() => {

            toast.success('Cadastrado com sucesso')
            setComplemento('')
            setCustomerSelected(0)
        })
        .catch((error) => {
            toast.error('Erero ao registrar, tente mais tarde')
            console.log(error)
        })

    }

    async function loadId(lista) {
        await firebase.firestore().collection('chamados').doc(id)
        .get()
        .then((snapshot) => {
            setAssunto(snapshot.data().assunto)
            setStatus(snapshot.data().status)
            setComplemento(snapshot.data().complemento)

            let index = lista.findIndex(item => item.id === snapshot.data().clienteId)
            setCustomerSelected(index)
            setIdCustomer(true)
        })
        .catch((err) => {
            console.log('erro no id passado', err)
            setIdCustomer(false)
        })
    }

    return (
        <div>
            <Header/>
            <div className="content">
                <Title name="Novo chamado">
                    <FiPlus size={24} />
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleRegister}>
                        <label>Cliente</label>

                        {loadCustomers ? (
                            <input type="text" disabled={true} value="Carregando clientes..." />
                        ) : (
                            <select value={customerSelected} onChange={handleChangeCustomers}>
                            {customers.map((customer, index) => {
                                return (
                                    <option key={customer.id} value={index}>
                                        {customer.nomeFantasia}
                                    </option>
                                )
                            })}
                        </select>
                        )}
                        
                        

                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option value='Suporte'>Suporte</option>
                            <option value='Visita Tecnica'>Visita Técnica</option>
                            <option value='Financeiro'>Financeiro</option>
                        </select>

                        <label>Status</label>
                        <div className="status">
                            <input type="radio" name="radio" value="Aberto" onChange={handleOptionChange} checked={status === 'Aberto'}/>
                            <span>Em Aberto</span>
                            <input type="radio" name="radio" value="Progresso" onChange={handleOptionChange} checked={status === 'Progresso'}/>
                            <span>Progresso</span>
                            <input type="radio" name="radio" value="Atendido" onChange={handleOptionChange} checked={status === 'Atendido'}/>
                            <span>Atendido</span>
                        </div>

                        <label>Complemento</label>
                        <textarea type="text" placeholder="Descreva o problema (opcional)." onChange={(e) => setComplemento(e.target.value)}/>

                        <button type="submit">Registrar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}