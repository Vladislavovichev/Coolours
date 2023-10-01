const cols = document.querySelectorAll('.col')

document.addEventListener('keydown', event => {      //при нажатии на пробел меняем цвета
    event.preventDefault()   //отменяем чтобы после нажатия на замок он не менялся по пробелу
    if (event.code.toLocaleLowerCase() === 'space') {
        setRandomColors ();
    }
})

document.addEventListener('click', event =>{   //по клику меняем открытый замок на закрытый и запрещаем менять цвет         
    const type = event.target.dataset.type  //переменная с data-type выбранного элемента

    if (type === 'lock') {
        const node = event.target.tagName.toLowerCase() === 'i' //event.target.tagName выдает название тега по которому кликнули в верхнем регистре
        ? event.target               //кликнули на i получили i
        : event.target.children[0]  // кликнули не на i(а на button), получили ребенка button - а это i

        node.classList.toggle('fa-lock-open')
        node.classList.toggle('fa-lock')
    } else if (type === 'copy') {        //если кликнули на текст, скопировали текст
        copyToClickBoard(event.target.textContent)
    }        
//Проще скачать картинку, вставить в button, повесить слушатель и переключать класс через toggle.
//Но оставлю эту реализацию через иконки font-awesome как пример использования data-type и event.target.dataset.type
})

function generateRandomColor() {         //создаем случайный цвет
    const hexCodes = '0123456789ABCDEF'          //возможные значения цвета
    let color = ''
    for (let i = 0; i < 6; i++) {                //6 раз добавляем в color случайны цвет из возможных значений цвета
        color+=hexCodes[Math.floor(Math.random() * hexCodes.length)]
    }
    return '#' + color
}

function copyToClickBoard(text) {       //копируем при клике текст
    return navigator.clipboard.writeText(text)
}

function setRandomColors(isInitial) {          //присваиваем случайный цвет каждой колонке
    const colors = isInitial ? getColorsFromHash() : []  //если первоначальная загрузка то берем из хеша иначе пустой массив цветов
    cols.forEach((col, index) => {
        const isLocked = col.querySelector('i').classList.contains('fa-lock') //содержит ли fa-lock i у col -  true/false
        const text = col.querySelector('h2') //выбираем h2
        const button = col.querySelector('button') //выбираем кнопку
        const message = col.querySelector('h4') //выбираем h4

        if(isLocked){      //если isLocked =true то заканчиваем функцию
            colors.push(text.textContent)
            return
        }

        const color = isInitial //Если первоначальная загрузка то берем из colors, иначе генерируем случайный
        ? colors[index]             //если colors существует,  
            ?  colors[index]        //то берем colors[index],
            : generateRandomColor() //иначе генерируем новый цвет
        : generateRandomColor()  

        if (!isInitial) {            //добавляем цвет в массив только если это не первоначальная загрузка
            colors.push(color)
        }



        text.textContent = color           // прописываем цвет в тексте h2
        col.style.background = color       // устанавливаем инлайн стиль background и присваиваем ему случайный цвет
        
        setTextColor(text, color)           // устанавливаем цвет текста h2 в контраст фону
        setTextColor(button, color)         // устанавливаем цвет кнопки в контраст фону
        if (col.contains(message)) {        // если присутствует h4 то делаем цвет текста h4 в контраст фону
            setTextColor(message, color)
        }
    })



    updateColorsHash(colors)           //сохраняем в хеш массив цветов
}

function setTextColor(text, color) {        //устанавливаем цвет текста h2 в контраст фону через библиотеку chroma
    const luminance = chroma(color).luminance()            //определяем яркость цвета через метод luminance() библиотеки chroma
    text.style.color = luminance > 0.5 ? 'black' : 'white' //если яркость цвета >0.5 то черный иначе белый
}

function updateColorsHash(colors = []) {      //сохраняем в хеш массив цветов
    document.location.hash = colors.map(col => col.toString().substring(1))       //удаляем первый символ в каждом цвете (это #)
    .join('-') //соединяем через дефис
}

function getColorsFromHash() {  //функция получения цветов из хеша
    if (document.location.hash.length > 1) { //если есть хеш
        return document.location.hash   
        .substring(1)    //удаляем первый символ в начале строки(#)
        .split('-')      //приводим строку к массиву
        .map(color => '#' + color) //добавляем в начале каждого цвета #
    }
    return []
}

setRandomColors (true); //присваиваем цвета при загрузке