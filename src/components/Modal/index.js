import './modal.css'
import { FiX } from 'react-icons/fi' 

export default function Modal({content, close}) {

    return(
        <div className="modal">
            <div className="container">
                <button>
                    <FiX size={24} color="#FFF" onClick={close}/>
                </button>

                <div>
                    <h2>Detalhes do chamado</h2>

                    <div className="row">
                        <span>Cliente: <a>{content.cliente}</a></span>
                    </div>

                    <div className="row">
                        <span>Assunto: <i>{content.assunto}</i></span>
                        <span>Cadastrado em: <i>{content.createdFormated}</i></span>
                    </div>

                    <div className="row">
                        <span>Status: <a style={{ color:'#FFF', backgroundColor: content.status == 'Aberto' ? '#5cb85c' : '#999'}}>{content.status}</a></span>
                    </div>

                    {content.complemento !== '' && (
                        <>
                            <h3>Complemento</h3>

                            <p>
                                {content.complemento}
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}