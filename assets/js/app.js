//variables
const carrito = document.querySelector('#carrito');
const cartContainer = document.querySelector('#shopping-list tbody');
const emptyCartBtn = document.querySelector('#empty-cart');
const courseList = document.querySelector('#course-list');
let articlesInCart = [];

loadEventListeners();
function loadEventListeners(){
    //Cuando agragas un curso presionando "Agregar al Carrito"
    courseList.addEventListener('click',courseAdd);

    //Eliminando cursos del carrito
    carrito.addEventListener('click',deleteCourse);

    //Muestra los cursos de Local Storage si no hay nada, no muestra nada. El evento es cuando la pagina se cargo completamente
    document.addEventListener('DOMContentLoaded',()=>{
        articlesInCart = JSON.parse(localStorage.getItem('articlesInCart')) || [];
        cartHTML();
    })

    //Vaciar el carrito
    emptyCartBtn.addEventListener('click', ()=>{
        articlesInCart = [];
        cleanCartHTML();
    })
}

function courseAdd(e){

    // console.log(e.target);
    if( e.target.classList.contains('add-course')){
        const selectedCourse = e.target.parentElement.parentElement;
        readCourseInfo( selectedCourse );
    }
}

//Elimina un curso del carrito
function deleteCourse(e) {
    if(e.target.classList.contains('delete-course')){
        const courseId = e.target.getAttribute('data-id');
        const courseAux = articlesInCart.find(course => course.id === courseId);
        if( courseAux.amount > 1){
            const courseIndex = articlesInCart.findIndex(course => course.id === courseId);
            articlesInCart[courseIndex].amount =  courseAux.amount -1;
            // console.log( articlesInCart[courseIndex]);
        }else{
            //Elimina del arreglo de articlesInCart por el data-id
            //creara un nuevo array, cogiendo todos aquellos elementos que no coincida con lo indicado en el filter
            articlesInCart = articlesInCart.filter( course => course.id !== courseId);
        }
        cartHTML();
    }
}

//Lee el contenido del HTML al que le dimos click y extrae la informacion del curso
function readCourseInfo( course) {
    const infoCourse = {
        image: course.querySelector('img').src,
        name: course.querySelector('h2').textContent,
        price: course.querySelector('.second-span').textContent,
        id: course.querySelector('button').getAttribute('data-id'),
        amount: 1
    }
    //Revisa si un elemento ya existe en el carrito
    //some permite iterar sobre un arreglo de objetos y verificar si un objeto existe en el
    const existe = articlesInCart.some( course => course.id === infoCourse.id );
    if( existe ){
        //Actualizamos la cantidad
        //map crea un nuevo arreglo, itera sobre los elementos del array y cuando coincida con el que vamos agregar en este caso
        const courses = articlesInCart.map( course =>{
            if(course.id === infoCourse.id) {
                course.amount++;
                return course; //retorna el objeto actualiado
            }else{
                return course //retorna el resto de objetos para no perderlos
            }
        });
        articlesInCart = [...courses];
    }else {
        //Agregamos elementos al arreglo de carrito, respetando los elementos existentes
        articlesInCart = [...articlesInCart, infoCourse];
    }

    

    console.log(articlesInCart);

    cartHTML();
}

//Muestra el Carro de compras en el HTML

function cartHTML(){
    //Limpiar HTML
    cleanCartHTML();

    //Recorre el carrrito y genera el HTML
    articlesInCart.forEach( course => {
        const { image, name, price, id, amount} = course;
        const row = document.createElement('tr');
        row.innerHTML= `
            <td>
                <img src ="${image}" width="80">
            </td>
            <td class="course-price">
                ${name}
            </td>
            <td >
                ${price}
            </td>
            <td class="course-amount">
                ${amount}
            </td>
            <td>
                <a href="#" class= "delete-course" data-id="${id}"> X </a>
        `
        //Agrega el HTML del carrito en el tbody
        cartContainer.appendChild(row);

    });

    //Agregar el carrito de compras al Storage
    sincronizarStorage();
}

function sincronizarStorage(){
    localStorage.setItem('articlesInCart',JSON.stringify(articlesInCart));
}
//Elimina los cursos del tbody
function cleanCartHTML(){
    //Si existe el primer elemento, ejecutara el codigo
    while(cartContainer.firstChild){
        cartContainer.removeChild(cartContainer.firstChild)
    }
}
