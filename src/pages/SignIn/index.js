import {useState, useContext} from 'react'
import {Link} from 'react-router-dom'

import { AuthContext } from '../../contexts/auth'
import logo from '../../assets/logo.png'
import './signin.css'

function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault();
    if(email !== '' && password !== '') {
      signIn(email, password)
    }
  }

  const { signIn, loadingAuth } = useContext(AuthContext)

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="Sistema logo" />
        </div>

        <form onSubmit={handleSubmit}>
          <h1>Entrar</h1>
          <input type="text" placeholder="email@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="*******" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <button type="submit">{ loadingAuth ? 'Carregando...' : 'Acessar'}</button>
        </form>

        <Link to="/register">Criar uma conta</Link>
      </div>
    </div>
  );
}
  
  export default SignIn;
  