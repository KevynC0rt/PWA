if(navigator.serviceWorker){
    navigator.serviceWorker.register("./sw.js")
  }
  if(window.caches){
    caches.open("uno");
    caches.open("dos");
  
   
        caches.keys().then(resp=>{
            console.log(resp);
        })
  }