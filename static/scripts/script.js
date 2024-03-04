// async function getUsers() {
//     try {
//       const response = await fetch('http://localhost:8000/scripts/gebruikers.json')
  
//       if (!response.ok) {
//         throw new Error('Netwerkfout bij het ophalen van gegevens')
//       }
  
//       const data = await response.json()
//       const users = data.users
//       console.log('Lijst van gebruikers: ', users)
//       return users
      
//     } catch (error) {
//       console.error('Er is een fout opgetreden:', error)
//     }
//   }
  
  
//   async function login() {
      
//       const usernameInput = document.getElementById('username')
//       const passwordInput = document.getElementById('password')
      
//       // haal de wachtwoorden op uit het JSON-bestand
//       // gebruik await omdat getCredentials async functie is
//        try {
//           // haal de wachtwoorden op uit het JSON-bestand
//           const users = await getUsers()
  
//           // probeer de gebruiker met de opgegeven gebruikersnaam te vinden in de array met gebruikers
//           // als deze gebruiker niet bestaat zal myUser undefined zijn
//           const myUser = users.find(x => x.name === usernameInput.value)
//           if (myUser) {
//               console.log('Gebruiker gevonden: ', myUser)
//           } else {
//               console.log('Gebruiker niet gevonden')
//           }
          
//           // controleer of we een gebruiker met deze gebruikersnaam hebben gevonden en zo ja, 
//           // of het wachtwoord overeenkomt
//           if (myUser && myUser.password === passwordInput.value) {
//               alert('Login successful!')
//           } else {
//               alert('Invalid username or password')
//           }
//       } catch (error) {
//           console.error('Er is een fout opgetreden bij het inloggen:', error)
//       }
//   }
  