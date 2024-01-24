import React, {useState, useEffect} from "react";
import './Home.css'
import LogoDrive from './icon.png';
import { FaPlus } from "react-icons/fa6";
import { FaFolder } from "react-icons/fa";
import { db, storage, auth } from './firebase';
import { IoMdDownload } from "react-icons/io";
import { FaVideo } from "react-icons/fa6";


function Home(props){

    const [ progress, setProgress ] = useState(0);
    const [ arquivos, setArquivos ] = useState([]);

    useEffect(()=>{
        db.collection('drive').doc(props.login.uid).collection('files').onSnapshot((snapshot)=>{
            setArquivos(snapshot.docs.map(l=>{
                return l.data();
            }));
        })
    },[props]);

    function sair (e) {
        e.preventDefault();
        auth.signOut().then(() => {
            alert('Deslogado!');
            window.location.href="/";
        }).catch((error) => {
            // an error happened.
        });
    }

    function fazerUploadArquivo(uid){

        let arquivo = document.querySelector('[name=arquivo]').files[0];

       //alert(arquivo.name);
       //alert(arquivo.type);
        
        const uploadTask = storage.ref('drive/'+uid+'/files/'+arquivo.name).put(arquivo);

        uploadTask.on('state_changed',(snapshot)=>{
            const progressTemp = (snapshot.bytesTransferred/snapshot.totalBytes) * 1;
            
            setProgress(progressTemp);
        },

        function(error){

        },

        function(){
            storage.ref('drive/'+uid+'/files/'+arquivo.name).getDownloadURL().then((url)=>{
                db.collection('drive').doc(uid).collection("files").add({
                    arquivoURL: url,
                    tipo_arquivo: arquivo.type,
                    nome: arquivo.name
                })
            })
            alert('Upload realizado com sucesso!');
            setProgress(0);
        }
        )
    }

    return(
        <div className="home">
            <div className="header">
                <div className="header_logo">
                <img src={LogoDrive} />
                </div>
                <div className="header_pesquisa">
                    <input type="text" placeholder="O que você quer pesquisar?" />
                </div>
                <div className="header_user">
                    <img src={props.login.imagem} alt="Foto de perfil"/>
                    <a onClick={(e)=>sair(e)} href="#">Sair</a>
                </div>
            </div>

            <div className="main">
                <div className="main_sidebar">
                    <form>

                        <label className="main_btnFileSelect" for="arquivo"><FaPlus />NOVO</label>
                        <input onChange={()=>fazerUploadArquivo(props.login.uid)} id="arquivo" className="header_input" type="file"  name="arquivo" />
                    </form>
                    <div className="main_folders">
                        <div className="main_folderMeuDrive">
                            <FaFolder /><span>Meu Drive</span>
                        </div>
                        {
                            (progress > 0)?
                            <div>
                            <label for="file">Carregando progresso:</label>
                            <progress id="file" value={progress} max="1"> {progress}% </progress>
                            </div>
                            :
                            <div></div>
                        }
                    </div>
                </div>
                <div className="main_content">
                    <div className="mainTopoText">
                        <h2>Meu Drive</h2>
                    </div>
                    <div className="boxFiles">
                        {
                            arquivos.map(function(data){
                            if(data.tipo_arquivo == "video/mp4"){
                           
                                return (

                                <div className="boxFileSingle">
                                    <div className="iconDownload">
                                    <FaVideo />
                                    </div>
                                    <a href={data.arquivoURL}>
                                        {data.nome}
                                    </a>
                                </div>
                                )
                                }else if(data.tipo_arquivo == "image/png" || data.tipo_arquivo == "image/jpeg" || data.tipo_arquivo == "image/svg"){
                                return (

                                <div className="boxFileSingle">
                                    <div className="iconDownload">
                                    <img className="miniatura" src={data.arquivoURL} />
                                    </div>
                                    <a href={data.arquivoURL}>
                                        {data.nome}
                                    </a>
                                </div>
                                )
                                } else {
                                return (

                                    <div className="boxFileSingle">
                                        <div className="iconDownload">
                                        <IoMdDownload />
                                        </div>
                                        <a href={data.arquivoURL}>
                                            {data.nome}
                                        </a>
                                    </div>
                                    )
                                }                           
                            })
                        }
            
                    </div>
                </div>
            </div>
            
           
           
        </div>
    )


}

export default Home;