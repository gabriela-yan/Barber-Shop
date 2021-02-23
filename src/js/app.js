document.addEventListener('DOMContentLoaded', function() {
    initApp();
})

function initApp(){
    showServices();
}

async function showServices(){
    try {
        const result = await fetch('./servicios.json');
        const db = await result.json();
        const {servicios} = db;
        servicios.forEach( service => {
            const {id, nombre, precio} = service;
            // DOM Scripting

            // Generate name service
            const nameService = document.createElement('P');
            nameService.textContent = nombre;
            nameService.classList.add('name-service');

            // Generate price service
            const priceService = document.createElement('P');
            priceService.textContent = `$ ${precio}`;
            priceService.classList.add('price-service');

            // Generate content div
            const divService = document.createElement('DIV');
            divService.classList.add('service');

            // Inject price and name to divService
            divService.appendChild(nameService);
            divService.appendChild(priceService);
            
            //Inject service to HTML
            document.querySelector('#services').appendChild(divService);
        })
    } catch (error) {
        console.log(error);
    }
}