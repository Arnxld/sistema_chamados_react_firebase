import { useState, useContext } from 'react'
import { FiSettings, FiUpload } from 'react-icons/fi'
import './profile.css'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { AuthContext } from '../../contexts/auth'
import avatar from '../../assets/avatar.png'
import firebase from '../../services/firebaseConnection'
import { toast } from 'react-toastify'


export default function Profile() {
    const { user, signOut, setUser, storageUser } = useContext(AuthContext)

    const [name, setName] = useState(user && user.name)
    const [email, setEmail] = useState(user && user.email)
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl)
    const [avatarImage, setAvatarImage] = useState(null)

    function handleFile(e) {
        if (e.target.files[0]) {
            const image = e.target.files[0]

            if(image.type === 'image/jpeg' || image.type === 'image/png') {
                setAvatarImage(image)
                setAvatarUrl(URL.createObjectURL(e.target.files[0]))
            } else {
                alert('Envie uma imagem do tipo PNG ou JPEG')
                setAvatarImage(null)
                return null
            }
        }
    }

    async function handleUpload() {
        const currentUid = user.uid

        console.log(avatarImage)

        const uploadTask = await firebase.storage()
        .ref(`images/${currentUid}/${avatarImage.name}`)
        .put(avatarImage)
        .then(async() => {
            await firebase.storage().ref(`images/${currentUid}`)
            .child(avatarImage.name).getDownloadURL()
            .then(async (url) => {
                let imageURL = url

                await firebase.firestore().collection('users')
                .doc(user.uid)
                .update({
                    avatarUrl: imageURL,
                    name
                })
                .then(() => {
                    let data = {
                        ...user,
                        avatarUrl: imageURL,
                        name
                    }
                    setUser(data)
                    storageUser(data)

                })
            })
        })
    }

    async function handleSave(e) {
        e.preventDefault()

        if (avatarImage == null && name !== '') {
            await firebase.firestore().collection('users')
            .doc(user.uid)
            .update({
                name
            })
            .then(() => {
                let data = {
                    ...user,
                    name
                }

                setUser(data)
                storageUser(data)
                toast.success("Dados atualizados!")
            })
            .catch(() => {})
        }
        else if(name !=='' && avatarImage !== null) {
            handleUpload()
        }
    }

    return(
        <div>
            <Header/>
            <div className='content'>
                <Title name="Meu Perfil">
                    <FiSettings size={25} />
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleSave}>
                        <label className="label-avatar">
                            <span>
                                <FiUpload color="#fff" size={24} />
                            </span>

                            <input type="file" accept="image/*" onChange={handleFile} />
                            <br/>
                            {avatarUrl === null ? 
                            <img src={avatar} width="250" height="250" alt="foto padrão de avatar"/> 
                            :
                            <img src={avatarUrl} width="250" height="250" alt="foto do usuário"/> 
                            }
                        </label>

                        <label>Nome</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

                        <label>Nome</label>
                        <input type="text" value={email} disabled={true} />

                        <button type="submit">Salvar</button>
                    </form>
                </div>

                <div className="container">
                    <button className="logout-btn" onClick={() => signOut()}>
                        Sair
                    </button>
                </div>
            </div>
        </div>
    )
}