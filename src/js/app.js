let page = 1;

const appointment = {
    name: '',
    date: '',
    hour: '',
    services: []
}

document.addEventListener('DOMContentLoaded', function() {
    initApp();
})

function initApp(){
    // Query the services.json file through fetch and display it in the HTML
    showServices();
    // Highlight the current DIV according to the tab that is pressed
    showSection();
    // Hide or show a section according to the tab that is pressed
    changeSection()
    // Next and previous page
    nextPage();
    previousPage();
    // Check current page to hide or show pagination
    pagerButtons();
    // It shows the summary of the appointment (or message in case of not passing the validation)
    showResume();
}

function showSection() {
    // Remove the show-section class from the previous section
    const nextSection = document.querySelector('.show-section');
    if(nextSection) {
        nextSection.classList.remove('show-section');
    }
    
    const currentSection = document.querySelector(`#step-${page}`);
    currentSection.classList.add('show-section');

    // Delete the Current class in the previous tab
    const currentTab = document.querySelector('.tabs button.current');
    if(currentTab) {
        currentTab.classList.remove('current');
    }
    
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
            
            // Call showSection function
            showSection();

            pagerButtons();
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

        const id = parseInt(element.dataset.idService);

        deleteService(id);
    } else {
        element.classList.add('selected');

        const serviceObj = {
            id: parseInt(element.dataset.idService),
            nombre: element.firstElementChild.textContent,
            precio: element.firstElementChild.nextElementSibling.textContent
        }
    
        addService(serviceObj);
    }
}

function deleteService(id) {
    const { services } = appointment;
    appointment.services = services.filter(service => service.id !== id);

    console.log(appointment);
}

function addService(serviceObj) {
    const { services } = appointment;
    appointment.services = [...services, serviceObj];
    console.log(appointment);
}

function nextPage(){
    const nextPage = document.querySelector('#next');
    nextPage.addEventListener('click', () => {
        page++;
        console.log(page);
        pagerButtons();
    });
}

function previousPage(){
    const previousPage = document.querySelector('#previous');
    previousPage.addEventListener('click', () => {
        page--;
        console.log(page);
        pagerButtons();
    });
}

function pagerButtons() {
    const nextPage = document.querySelector('#next');
    const previousPage = document.querySelector('#previous');
    if(page === 1) {
        previousPage.classList.add('hide');
        nextPage.classList.remove('hide');
    } else if(page === 3) {
        nextPage.classList.add('hide');
        previousPage.classList.remove('hide');
    } else {
        previousPage.classList.remove('hide');
        nextPage.classList.remove('hide');
    }
    showSection();
}

function showResume() {
    // Destructuring
    const { name, date, hour, services } = appointment;

    // Selected summary
    const divSummary =document.querySelector('.content-summary');

    // Validate object
    if(Object.values(appointment).includes('')){
        const noServices = document.createElement('P');
        noServices.textContent = 'Faltan datos de servicios, hora, fecha o nombre';
        noServices.classList.add('invalidate-appointment');

        // Add to divSummary
        divSummary.appendChild(noServices);
    }
}