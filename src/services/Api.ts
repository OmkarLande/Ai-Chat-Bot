import axios from "axios";

const BASE_URL=('https://bard-api-yl1n.onrender.com' + '/api/generate') 

const getBardApi=(userMsg: string)=>axios.get(BASE_URL+"?prompt="+userMsg);

export default{
    getBardApi
}