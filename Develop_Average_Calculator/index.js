// const express = require('express');
// const axios = require('axios');

// const app = express();
// app.use(express.json());

// const BASE_URL = 'http://20.244.56.144/evaluation-service';

// app.get('/register', async (req, res) => {
//   try {
//     const registerPayload = {
//       email: "mashookhkhan7862@gmail.com",
//       name: "Mashookh Ahmed Khan",
//       mobileNo: "7987925094",
//       githubUsername: "MashookhKhanlol",
//       rollNo: "2104921530025",
//       collegeName: "KCC Institute of technology and management",
//       accessCode: "baqhWc"
//     };

//     const response = await axios.post(`${BASE_URL}/register`, registerPayload);
//     console.log("Registration response:", response.data);

//     // Save or return credentials
//     res.json(response.data);

//   } catch (error) {
//     console.error("Registration failed:", error.response?.data || error.message);
//     res.status(500).send("Registration failed");
//   }
// });

// app.get('/get-token', async (req, res) => {
//   try {
//     const authPayload = {
//       email: "mashookhkhan7862@gmail.com",
//       name: "Mashookh Ahmed Khan",
//       rollNo: "2104921530025",
//       accessCode: "baqhWc",
//       clientID: "acb1bd38-cacb-440c-80e6-2075b81638b4",
//       clientSecret: "CPRKJxBJgVpBVUPE"
//     };

//     const response = await axios.post(`${BASE_URL}/auth`, authPayload);
//     console.log("Token response:", response.data);

//     res.json(response.data);
//   } catch (error) {
//     console.error("Token fetch failed:", error.response?.data || error.message);
//     res.status(500).send("Token fetch failed");
//   }
// });

// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

//CODE FOR AVERAGE CALCULATOR

const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;
const WINDON_SIZE = 10;
const windowState = [];

const sources ={
    p: 'http://20.244.56.144/evaluation-service/primes',
    f: 'http://20.244.56.144/evaluation-service/fibo',
    e: 'http://20.244.56.144/evaluation-service/even',
    r: 'http://20.244.56.144/evaluation-service/rand',
}

function getUniqueRecentNumbers(prevState , newNumbers){
    const my_nums = [...prevState , ...newNumbers]
    const seen = new Set()
    const unique = []

    for(let i = my_nums.length-1 ; i>=0 ;i--){
        if(!seen.has(my_nums[i])){
            unique.unshift(my_nums[i])
            seen.add(my_nums[i])
        }
    }

    return unique.slice(-WINDON_SIZE);
}

function calculateAverage(numbers){
    if (numbers.length == 0) return 0
    const sum = numbers.reduce((a,b)=> a+b, 0)
    return parseFloat((sum/numbers.length).toFixed(2));
}

app.get("/", (req,res)=>{
    console.log("server started")
    res.send("App is running")
})

app.listen(PORT , ()=>{
    `app is listening of port ${PORT}`
})


// {
// 	"token_type": "Bearer",
// 	"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ2Njg0NjcwLCJpYXQiOjE3NDY2ODQzNzAsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImFjYjFiZDM4LWNhY2ItNDQwYy04MGU2LTIwNzViODE2MzhiNCIsInN1YiI6Im1hc2hvb2toa2hhbjc4NjJAZ21haWwuY29tIn0sImVtYWlsIjoibWFzaG9va2hraGFuNzg2MkBnbWFpbC5jb20iLCJuYW1lIjoibWFzaG9va2ggYWhtZWQga2hhbiIsInJvbGxObyI6IjIxMDQ5MjE1MzAwMjUiLCJhY2Nlc3NDb2RlIjoiYmFxaFdjIiwiY2xpZW50SUQiOiJhY2IxYmQzOC1jYWNiLTQ0MGMtODBlNi0yMDc1YjgxNjM4YjQiLCJjbGllbnRTZWNyZXQiOiJDUFJLSnhCSmdWcEJWVVBFIn0._cmhPq5aETaRPfrjbefs8BMmK8k4evnfTs_tKzxozxA",
// 	"expires_in": 1746684670
// }