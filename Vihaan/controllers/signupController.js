const userID = document.getElementById("userID");
const Password = document.getElementById("Password");
const confirmPassword = document.getElementById("confirmPassword");
const submitButton = document.getElementById("submit");

submitButton.addEventListener("click", (event) => {
  event.preventDefault();
  if(Password.value === confirmPassword.value){
    const newLoginDetails = {
      userID: userID.value,
      Password: Password.value,
    };
    fetch('http://localhost:2000224/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newLoginDetails),
    })
    .then(response => response.json())
    .then(data => console.log('User created successfully:', data))
    .catch((error) => console.log('Error creating user:', error));
  } else {
    alert("Passwords do not match");
  }
});