

const CACHE_STATIC_NAME="Pwa_static_v3";
const CACHE_DYNAMIC_NAME="Pwa_dynamic_v1";
const CACHE_INMUTABLE_NAME="Pwa_inmutable_v1";

function limpiarCache(nombreCache,numeroItems){
    cache.open(nombreCache).then(cache=>{
        return cache.keys().then(llave=>{
            if(llave.length>=numeroItems){
                cache.delete(llave[0])
                    .then(limpiarCache(nombreCache,numeroItems));
            }
        });
    });

}

self.addEventListener("install",event=>{
    const repuesta= caches.open(CACHE_STATIC_NAME)
        .then(cache=>{
            return cache.addAll([
                "/",
                "/Index.html",
                "/style/base.css",
                "/js/app.js",
                "/js/base.js",
                "/js/main.js",
                "/js/module.js",
                "/js/pouchdb-nightly.js",
                "/js/push.min.js",
                "/pages/asincrono.html",
                "/pages/localizacion.html",
                "/pages/notificacion.html"
            ]);
        });
     const respuestaInmutable=caches.open(CACHE_INMUTABLE_NAME)
    .then(cache=>{
        return cache.add("https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css")
    })   
    event.waitUntil(Promise.all([repuesta,respuestaInmutable]));
});


self.addEventListener("activate",event=>{

    const respuesta= caches.keys().then(llaves=>{
        llaves.forEach(llave=>{
            if(llave.includes("static") && llave!==CACHE_STATIC_NAME){
                return caches.delete(llave);
            }
        });
    });
    event.waintUntil(respuesta);
});

self.addEventListener("fetch",event=>{

    const respuesta=new Promise((resolve,reject)=>{
        let bandera=false;
        const fallo=()=>{
            if(bandera){
                //no existe en caches
                if(/\.(png|jpg)$/i.test(event.request.url)){
                    resolve(caches.match("img/descarga.jpg"));
                }else{
                    reject("No encontramos respuesta");
                }

            }else{
                bandera=true;        
            }
        }

        fetch(event.request).then(resp=>{
            if(resp.ok){
                resolve(resp);
            }else{
                fallo();
            }
        })
        .catch(()=>{
            fallo();
        });

        caches.match( event.request ).then( resp => {
            resp ? resolve(resp): fallo();
        }).catch( fallo );
    });
    event.respondWith(respuesta);
   
})

