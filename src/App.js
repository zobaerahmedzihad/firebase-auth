import React, { useState } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import './App.css';
import firebaseConfig from './firebase.config'

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

// firebase.initializeApp(firebaseConfig);

function App() {

   const [user , setUser] = useState({
     isSignedIn: false,
     name: '', 
     email: '',
     password: '',
     photo : ''
   })
    const provider = new firebase.auth.GoogleAuthProvider();

    const handleSineIn = () => {
      firebase.auth().signInWithPopup(provider)
     
        .then( res => {
          const {displayName , email , photoURL} = res.user;
          const signedInUser = {
            isSignedIn : true,
            name : displayName,
            email : email,
            photo : photoURL
          }
          setUser(signedInUser);
          // console.log(displayName , email , photoURL);                                         
        })
      .catch(error => {
        console.log(error);
        console.log(error.message);
      }) 
    }
    const {displayName , email , photo} = user;
           
    const handleSignOut = () => {
    firebase.auth().signOut()
      .then((res)=> {
        const userSignOut = {
          isSignedIn : false,
          name: '',
          email: '',
          photo: '',
          error: '',
          success: false
        }
    setUser(userSignOut)
      })
      .catch(error => {
        console.log(error);
      })
    }



    const handleBlur = (e) => {
      let isFieldValid = true;
        // console.log(e.target.name , e.target.value);
        if(e.target.name === 'email'){
          isFieldValid = /\S+@\S+\.\S+/.test(e.target.value)
          
        }
        if(e.target.name === 'password'){
            const isPasswordValid = e.target.value.length > 6
            const passwordHasNumber =  /\d{1}/.test(e.target.value)
            isFieldValid = passwordHasNumber && isPasswordValid
         
        }
        if(isFieldValid){
          const newUserInfo = {...user}
          newUserInfo[e.target.name] = e.target.value;
          setUser(newUserInfo)
        }
    }

    const handleSubmit = (e) => {
      console.log(user.email , user.password);
      if(user.email && user.password){

        firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then((userCredential) => {
          var user = userCredential.user;
          const newUserInfo = {...user}
          newUserInfo.error = "";
          newUserInfo.success = true;
          setUser(newUserInfo)
          console.log( "this is user : ", user);
         
        })
        .catch((error) => {
          const newUserInfo = {...user};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo)
          // var errorCode = error.code;
          // var errorMessage = error.message;
          // console.log(errorCode , errorMessage);
        });
      }

      e.preventDefault();
    }

  return (
    <div className = 'style1' >
      
      {
        user.isSignedIn ?    <button onClick = {handleSignOut} >Sign out</button> :
        <button onClick = {handleSineIn} >Sing In</button>
      }
    
     {
       user.isSignedIn &&
        <div> 
         
          <h2>Welcome to , {displayName} </h2>
          <h3>Email : {email} </h3>
          <img src={photo} alt=""/>
        </div>
     }
                                 {/* module 41  */}

     <div className = "style1">
      <h1> Our Own Authentication System. </h1>
      <form onSubmit = {handleSubmit}>
          <input type="text" name="name" onBlur = {handleBlur} placeholder = "Name"/><br/><br/>
          <input type="email" onBlur = {handleBlur} name = "email" placeholder ="Enter Your Email" required /><br/><br/>
          <input type="password" onBlur = {handleBlur} name = "password" placeholder ="Enter Your Password" required /><br/><br/>
          <input type="button" onClick = {handleSubmit} value="Submit"/>

      </form>
        <p style = {{color: 'red'}} > {user.error }</p>
        {
          user.success && <p style = {{color: 'green'}} > User created successfully. </p>
        }
     </div>

    </div>
  );
}

export default App;

 // const provider = new firebase.auth.GoogleAuthProvider();
  // const handleSineIn =()=> {
  //   firebase.auth().signInWithPopup(provider)
  //     .then(res => {
  //       const {displayName , photoURL , email} = res.user;
  //       console.log(displayName , photoURL , email);
  //     })
  // }