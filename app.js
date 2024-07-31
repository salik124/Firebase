import { 
    auth, 
    db, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    collection, 
    addDoc, 
    getDocs 
  } from './firebaseConfig.js';
  
  document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login');
    const logoutButton = document.getElementById('logout');
    const eventsButton = document.getElementById('events');
    const authForm = document.getElementById('auth-form');
    const eventForm = document.getElementById('event-form');
    const toggleAuthButton = document.getElementById('toggle-auth');
    const eventsList = document.getElementById('events-list');
  
    // Handle login/signup
    if (authForm) {
      authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const isSignup = authForm.querySelector('button').textContent === 'Signup';
        
        try {
          if (isSignup) {
            await createUserWithEmailAndPassword(auth, email, password);
          } else {
            await signInWithEmailAndPassword(auth, email, password);
          }
          window.location.href = 'index.html';
        } catch (error) {
          console.error('Error during authentication:', error);
        }
      });
  
      toggleAuthButton.addEventListener('click', () => {
        const isSignup = toggleAuthButton.textContent.includes('Signup');
        toggleAuthButton.textContent = isSignup ? 'Switch to Login' : 'Switch to Signup';
        authForm.querySelector('button').textContent = isSignup ? 'Signup' : 'Login';
      });
    }
  
    // Handle logout
    if (logoutButton) {
      logoutButton.addEventListener('click', async () => {
        try {
          await signOut(auth);
          window.location.href = 'auth.html';
        } catch (error) {
          console.error('Error during sign out:', error);
        }
      });
    }
  
    // Handle event management
    if (eventForm) {
      eventForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const eventName = document.getElementById('event-name').value;
  
        try {
          const user = auth.currentUser;
          if (user) {
            await addDoc(collection(db, 'events'), {
              name: eventName,
              uid: user.uid,
              timestamp: new Date()
            });
            loadEvents();
          }
        } catch (error) {
          console.error('Error adding event:', error);
        }
      });
    }
  
    // Load events
    if (eventsList) {
      const loadEvents = async () => {
        eventsList.innerHTML = '';
        try {
          const querySnapshot = await getDocs(collection(db, 'events'));
          querySnapshot.forEach((doc) => {
            const event = doc.data();
            const li = document.createElement('li');
            li.textContent = event.name;
            eventsList.appendChild(li);
          });
        } catch (error) {
          console.error('Error loading events:', error);
        }
      };
      
      loadEvents();
    }
  });
  