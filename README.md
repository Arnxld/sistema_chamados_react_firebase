# Sistema de Chamados

Este é um sistema de chamados desenvolvido utilizando Reactjs e o Firebase como back-end

## Usabilidade

necessário criar um arquivo "firebaseConnection.js" com a seguinte estrutura:

```javascript
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

// firebase console configs
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};
  

if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase
```

