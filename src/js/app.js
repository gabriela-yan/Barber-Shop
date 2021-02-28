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
    // Stores the name of the appointment in the object
    nameAppointment();
    // Stores the date of the appointment in the object
    dateAppointment();
    // Disable days past
    disableDatePast();
    // Stores the appointment time in the object
    hourAppointment();
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
        pagerButtons();
    });
}

function previousPage(){
    const previousPage = document.querySelector('#previous');
    previousPage.addEventListener('click', () => {
        page--;
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
        showResume();
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

    //Clean previous HTML
    // divSummary.innerHTML = '';
    while(divSummary.firstChild) {
        divSummary.removeChild(divSummary.firstChild);
    }

    // Validate object
    if(Object.values(appointment).includes('')){
        const noServices = document.createElement('P');
        noServices.textContent = 'Faltan datos de servicios, hora, fecha o nombre';
        noServices.classList.add('invalidate-appointment');

        // Add to divSummary
        divSummary.appendChild(noServices);
        return;
    } 

    const headingAppointment = document.createElement('H3');
    headingAppointment.textContent = 'Resumen de cita';

    // Show summary
    const nameAppointment = document.createElement('P');
    nameAppointment.innerHTML = `<span>Nombre:</span> ${name}`;

    const dateAppointment = document.createElement('P');
    dateAppointment.innerHTML = `<span>Fecha:</span> ${date}`;

    const hourAppointment = document.createElement('P');
    hourAppointment.innerHTML = `<span>Hora:</span> ${hour}`;

    const servicesAppointment = document.createElement('DIV');
    servicesAppointment.classList.add('summary-services');

    const headingServices = document.createElement('H3');
    headingServices.textContent = 'Resumen de servicios';
    servicesAppointment.appendChild(headingServices);

    let quantity = 0;

    // Iterate over the service arrangement
    services.forEach( service => {
        const { nombre, precio } = service;
        const serviceContainer = document.createElement('DIV');
        serviceContainer.classList.add('container-service');

        const serviceTxt = document.createElement('P');
        serviceTxt.textContent = nombre;

        const servicePrice = document.createElement('P');
        servicePrice.textContent = precio;
        servicePrice.classList.add('price');

        const serviceTotal = precio.split('$'); 
        quantity += parseInt(serviceTotal[1].trim());

        // Place price and text in the DIV
        serviceContainer.appendChild(serviceTxt);
        serviceContainer.appendChild(servicePrice);

        servicesAppointment.appendChild(serviceContainer);
    });

    divSummary.appendChild(headingAppointment);
    divSummary.appendChild(nameAppointment);
    divSummary.appendChild(dateAppointment);
    divSummary.appendChild(hourAppointment);

    divSummary.appendChild(servicesAppointment);

    const amountToPay = document.createElement('P');
    amountToPay.classList.add('total');
    amountToPay.innerHTML = `<span>Total a pagar: </span>$ ${quantity}`;

    divSummary.appendChild(amountToPay);
}

function nameAppointment() {
    const nameInput = document.querySelector('#name');

    nameInput.addEventListener('input', event => {
        const nameTxt = event.target.value.trim();
        // Validation
        if(nameTxt === '' || nameTxt.length < 3) {
            showAlert('Nombre no válido', 'error');
        } else {
            const alert = document.querySelector('.alert');
            if(alert) {
                alert.remove();
            }
            appointment.name = nameTxt;
        }
    })
}

function showAlert(message, type) {
    // If there is a previous alert, then do not create another
    const previousAlert = document.querySelector('.alert');
    if(previousAlert) {
        return;
    }

    const alert = document.createElement('DIV');
    alert.textContent = message;
    alert.classList.add('alert');
    if(type === 'error') {
        alert.classList.add('error');
    }

    // Insert HTML
    const form = document.querySelector('.form');
    form.appendChild(alert);

    // Delete alert after 3 seconds
    setTimeout(() => {
        alert.remove();
    },3000)
}

function dateAppointment() {
    const dateInput = document.querySelector('#date');
    dateInput.addEventListener('input', event => {
        
        const day = new Date(event.target.value).getUTCDay();
        if([0, 6].includes(day)){
            event.preventDefault();
            dateInput.value = '';
            showAlert('Fines de semana no laborales', 'error');
        } else {
            appointment.date = dateInput.value;
            console.log(appointment);
        }
        // const options = {
        //     weekday: 'long',
        //     year: 'numeric',
        //     month: 'long'
        // }
        // console.log(day.toLocaleDateString('es-ES', options));
    })
}

function disableDatePast() {
    const dateInput = document.querySelector('#date');
    const dateNow = new Date();
    const year = dateNow.getFullYear();
    let month = dateNow.getMonth()+1;
    const day = dateNow.getDate();

    // Desired format YYYY-MM-DD
    if(month < 10) {
        month = `0${month}`;
    } 

    if(day < 10) {
        day = `0${day}`;
    }

    const disableDate = `${year}-${month}-${day}`;

    dateInput.min = disableDate; 
}

function hourAppointment() {
    const hourInput = document.querySelector('#hour');
    hourInput.addEventListener('input', event => {
        const hourAppointment = event.target.value;
        const hour = hourAppointment.split(':');
        if(hour[0] < 10 || hour[0] > 18){
            showAlert('No se aceptan citas en ese horario','error');
            setTimeout(()=>{
                hourInput.value = '';
            },3000);
        } else {
            appointment.hour = hourAppointment;
        }
    })
}