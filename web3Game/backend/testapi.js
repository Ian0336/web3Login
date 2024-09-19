const data = {
  address: "0x5Dba29C71575F4b271926c98F5170d86FfEb1bab",
  message: "Sign in to your account",
  signature: "0x40cb7902881264bdda70765e104297518dd8ea2829e901e6fb33cea30305088f3185443282210e544df67dd4697d0bc8d4650eb39db11bacd3d6b0b1b11158c11b"
};
// send Post request to the server with the data
// Use the fetch API to send a POST request to the /verify endpoint
fetch('http://localhost:3001/verify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
  .then(response => response.json())  // Parse the JSON response
  .then(result => {
    console.log('Success:', result);
  })
  .catch(error => {
    console.error('Error:', error);
  });
// fetch("http://localhost:3001/", {
//   method: "GET",
//   headers: {
//     "Content-Type": "text/html"
//   },
  
// }).then(response => {
//   console.log(response.);

// }).catch(err => {
//   console.log(err);
// }
// );