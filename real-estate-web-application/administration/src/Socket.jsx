import io from 'socket.io-client';  
let socket = io('http://localhost:9001/');  
export default socket;