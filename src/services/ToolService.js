import {env} from "./constants";

export const getBaseurl =()=>{
    //let url = "127.0.0.1:8000";
    return env.url;
}

export const getRelativepath = (host,href) =>{
    let path = href.replace(host, '')
    path = path.replace("///","");
    path = path.replace("//","");
    let tab = path.split("http:");
    if(tab[1] != "")tab[1] = tab[1][0].toLowerCase() + tab[1].substring(1, tab[1].length);
    return tab[1];
}

export const orderByString = (tab,field) =>{
    tab.sort((a,b)=>a[field].localeCompare(b[field]));
}

export function isMobile() {
    if (/Mobi|Android|iPhone/i.test(navigator.userAgent))return true;
    return false;
}

export function getRandomNumber(n, max) {
    return Math.floor(Math.random() * n) + max;
}

export async function copyToClipboard(value, toalert=true) {
    let input = document.createElement("input");
    document.body.appendChild(input);
    input.value = value;
    input.focus();
    input.select();
    document.execCommand('copy');
    input.parentNode.removeChild(input);
    if(toalert == true)alert("Copié");
}

export function stopPropagation(e = null) {
    if(e != null){
      e.stopPropagation();
      e.preventDefault();
    }
}

//localstorage
export const setStorage =(key,value)=>{
    localStorage.setItem(key,value);
}

export const getStorage = (key)=>{
    return localStorage.getItem(key);
}

export const removeStorage =(key)=>{
    localStorage.removeItem(key);
}