(()=>{'use strict';
if('serviceWorker' in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('/sw.js').catch(()=>{});
let pending;const button=document.getElementById('install-app');
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();pending=event;button.hidden=false;});
window.addEventListener('appinstalled',()=>{pending=null;button.hidden=true;});
button.addEventListener('click',async()=>{if(pending){await pending.prompt();const result=await pending.userChoice;pending=null;if(result.outcome==='accepted')button.hidden=true;}else{document.getElementById('install-dialog').showModal();}});
document.getElementById('install-close').onclick=()=>document.getElementById('install-dialog').close();
if(window.matchMedia('(display-mode: standalone)').matches)button.hidden=true;
})();