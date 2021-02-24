let page = 1;

document.addEventListener('DOMContentLoaded', function() {
    initApp();
})

function initApp(){
    showServices();
    // Highlight the current DIV according to the tab that is pressed
    showSection();
    // Hide or show a section according to the tab that is pressed
    changeSection()
}

function showSection() {
    const currentSection = document.querySelector(`#step-${page}`);
    currentSection.classList.add('show-section');

    // Highlight the current tab
    const tab = document.querySelector(`[data-step="${page}"]`);
    tab.classList.add('current');
}

function changeSection() {
    const links = document.querySelectorAll('.tabs button');
    links.forEach( link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            page = parseInt(e.target.dataset.step);
            
            // Remove the show-section class from the previous section
            document.querySelector('.show-section').classList.remove('show-section');

            // Add show-section where we clicked
            const section = document.querySelector(`#step-${page}`);
            section.classList.add('show-section');

            // Delete the Current class in the previous tab
            document.querySelector('.tabs button.current').classList.remove('current');
            
            // Add the Current class in the new tab
            const tab = document.querySelector(`[data-step="${page}"]`);
            tab.classList.add('current');
        })
    })
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

            //Select a service for the appointment
            divService.onclick = selectedService;
            divService.dataset.idService = id; 

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
function selectedService(event) {
    let element;
    //Force the element we click to be the DIV
    if(event.target.tagName === 'P'){ 
        element = event.target.parentElement;
    } else {
        element = event.target;
    }
    if(element.classList.contains('selected')){
        element.classList.remove('selected');
    } else {
        element.classList.add('selected');
    }
}