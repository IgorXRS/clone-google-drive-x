import './App.css';
import React, {useEffect, useState} from 'react';
import {auth, provider} from './firebase';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom/cjs/react-router-dom';
import Home from './Home';
import LogoDrive from './icon2.png';

function App() {
  const [login, setLogin] = useState(null);

  useEffect(()=>{
    //Sistema de login persistente.
    auth.onAuthStateChanged((val)=>{
      setLogin({
        nome: val.displayName,
        imagem: val.photoURL,
        email: val.email,
        uid: val.uid

      });
      console.log(val.photoURL);
      
      
    })
  },[])

  function handlelogin(e){
    e.preventDefault();
    auth.signInWithPopup(provider)
    .then(function(result){
      if(result){
        setLogin(result.user.email);
      }
    })
  }
  return (
    <div className="App">
      {(login)?(
        <Router>

          <Switch>

            <Route path="/home">

              <Home login={login} />
            </Route>
            <Route path="/">

              <Home login={login} />
            </Route>
          </Switch>
        </Router>
      ):
        <>
          <div className='loginTela'>
            <h1>Bem vindo ao Google Drive X</h1>
            <p>Uma forma segura e eficiente de guardar seus aquivos em nuvem.</p>
            <img className='img2' src={LogoDrive} /><img className='img' src={LogoDrive} />
            <a className='loginBtn' onClick={(e)=>handlelogin(e)} href='#'>Fazer Login!</a>
          </div>
        </>
      }
     
    </div>
  );
}

export default App;
