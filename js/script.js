'use strict';
// window.addEventListener('load'); //когда загрузится вся страница

//когда загрузится структура страницы
window.addEventListener('DOMContentLoaded', function() {
    let tab = document.querySelectorAll('.info-header-tab'),
        info = document.querySelector('.info-header'),
        tabContent = document.querySelectorAll('.info-tabcontent');
    
    // скрыть все tabContent начиная с индекса "a"
    function hideTabContent(a) {
        for (let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
        }
    }   
    
    //скрыть все tabContent, начиная со второго
    hideTabContent(1);

    //Отобразить определённый tabContent с индексом "b"
    function showTabContent(b) {
/*         if (tabContent[b].classList.contains('hide')) {
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
        } */
        (tabContent[b].classList.contains('hide')) ? tabContent[b].classList.remove('hide') : tabContent[b].classList.add('show');
    }

    //обработка клика, скрытие всех tabContent и отображение одного tabContent согласно even
    info.addEventListener('click', function(even) {
        let target = event.target;
        if (target && target.classList.contains('info-header-tab')) {
            for (let i = 0; i < tab.length; i++) {
                if (target == tab[i]) {
                    hideTabContent(0);
                    showTabContent(i);
                    break;
                }
            }
        }
    });

    // timer
    let deadline = '2019-09-01';

    function getTimeRemaining(endtime) {
        let t = Date.parse(endtime) - Date.parse(new Date()),
            seconds = Math.floor((t/1000) % 60),
            minutes = Math.floor((t/1000/60) % 60),
            hours = Math.floor((t/(1000*60*60)));
        return {
            'total': t,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        }
    }

    function setClock(id, endtime) {
        let timer = document.getElementById(id),
            hours = timer.querySelector('.hours'),
            minutes = timer.querySelector('.minutes'),
            seconds = timer.querySelector('.seconds'),        
            timeInterval = setInterval(updateClock, 1000);
        
        function updateClock() {
            let t = getTimeRemaining(endtime);
            hours.textContent = t.hours;
            minutes.textContent = ("0" + t.minutes).slice(-2);
            seconds.textContent = ("0" + t.seconds).slice(-2);            

            if (t.total <= 0) {
                clearInterval(timeInterval);
                
                hours.textContent = "00";
                minutes.textContent = "00";
                seconds.textContent = "00"; 
            }
        }
    }

    setClock('timer', deadline);

    // Modal

    let more = document.querySelector('.more'),
        overlay = document.querySelector('.overlay'),
        close = document.querySelector('.popup-close');
    
    more.addEventListener('click', function() {
        overlay.style.display = 'block';
        this.classList.add('more-splash');
        document.body.style.overflow = 'hidden';
    });

    close.addEventListener('click', function() {
        overlay.style.display = 'none';
        more.classList.remove('more-splash');
        document.body.style.overflow = '';
    });

    // 1) Написать функцию вызова модального окна
    function showModalWindow(t) {
        overlay.style.display = 'block';
        t.classList.add('more-splash');
        document.body.style.overflow = 'hidden';
    }

    // 2) Привязать модальное окно к кнопкам “Узнать подробнее” в табах. Код не должен дублироваться.
    let descriptionBtn = document.querySelectorAll('.description-btn');

    for (let desc of descriptionBtn) {
        desc.addEventListener('click', function () {
            showModalWindow(this);
        });
    };

    // Задание 13
    // Form
    let message = {
        loading: 'Загрузка...',
        succes: 'Cпасибо! Скоро мы с вами свяжемся!',
        failure: 'Что-то пошло не так...'
    };

    //promise

    let form = document.getElementsByClassName('main-form')[0],
        formBottom = document.getElementById('form'),
        input = form.getElementsByTagName('input'),
        statusMessage = document.createElement('div');
        statusMessage.classList.add('status');

    function sendForm(elem) {
        elem.addEventListener('submit', function(e) {
            e.preventDefault();

            elem.appendChild(statusMessage);
            let formData = new FormData(elem);
            function postData(data) {

                return new Promise(function(resolve, reject) {
                    let request = new XMLHttpRequest();

                    request.open('POST', 'server.php');

                    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');

                    request.onreadystatechange = function() {
                        // console.log(request.readyState);
                        // console.log(request.status);
                        if (request.readyState < 4) {
                            resolve()
                        } else if (request.readyState === 4 && request.status == 200) {
                            resolve()
                        } else {
                            reject()
                        }
                    };

                    request.send(data);
                });
            } //End postData

            function clearInput(elem) {
                let input = elem.getElementsByTagName('input');
                for (let i = 0; i < input.length; i++) {
                    input[i].value = "";
                }
            }

            postData(formData)
                .then(() => statusMessage.innerHTML = message.loading)
                .then(() => {
                    // thanksModal.style.display = 'block';
                    // mainModal.style.display = 'none';
                    // statusMessage.innerHTML = '';
                    statusMessage.innerHTML = message.succes
                })
                .catch(() => statusMessage.innerHTML = message.failure)
                .finally(clearInput(elem));
        });
    }
    
    sendForm(form);
    sendForm(formBottom);
 
    // slider
    let slideIndex = 1,
        slides = document.querySelectorAll('.slider-item'),
        prev = document.querySelector('.prev'),
        next = document.querySelector('.next'),
        dotsWrap = document.querySelector('.slider-dots'),
        dots = document.querySelectorAll('.dot');
    
    showSlides(slideIndex);

    function showSlides(n) {
        
        if (n > slides.length) {
            slideIndex = 1;
        } else if (n < 1) {
            slideIndex = slides.length;
        }

        slides.forEach((item) => item.style.display = 'none');
        // for (let i =0; i < slides.length; i++) {
        //     slides[i].style.display = 'none';
        // }

        dots.forEach((item) => item.classList.remove('dot-active'));

        slides[slideIndex - 1].style.display = 'block';
        dots[slideIndex - 1].classList.add('dot-active');
    }

    function plusSlides(n) {
        showSlides(slideIndex += n);
    }
    
    function currentSlides(n) {
        showSlides(slideIndex = n);
    }
    
    prev.addEventListener('click', function() {
        plusSlides(-1);
    });

    next.addEventListener('click', function() {
        plusSlides(1);
    });

    dotsWrap.addEventListener('click', function(event) {
        for (let i = 0; i <= dots.length + 1; i++) {
            if (event.target.classList.contains('dot') && event.target == dots[i-1]) {
                currentSlides(i);
            }
        }
    });

    // calc

    let persons = document.querySelectorAll('.counter-block-input')[0],
        restDays = document.querySelectorAll('.counter-block-input')[1],
        place  = document.getElementById('select'),
        totalValue = document.getElementById('total'),
        personSum = 0,
        daysSum = 0,
        total = 0;

    totalValue.innerHTML = 0;

    // persons.addEventListener('change', function() {
    //     personSum = +this.value;
    //     total = (daysSum + personSum) * 4000;

    //     if  (restDays.value == '') {
    //         totalValue.innerHTML = 0;
    //     } else {
    //         totalValue.innerHTML = total;
    //     }
    // });

    // restDays.addEventListener('change', function() {
    //     daysSum = +this.value;
    //     total = (daysSum + personSum) * 4000;

    //     if  (persons.value == '') {
    //         totalValue.innerHTML = 0;
    //     } else {
    //         totalValue.innerHTML = total;
    //     }
    // });

    function cacl(personsP, restDaysP, placeP) {
        if (personsP.value == '' || restDaysP.value == '') {
            personSum = 0;
            daysSum = 0;
            total = 0;
            totalValue.innerHTML = total;
        } else {
            personSum = +personsP.value;
            daysSum = +restDaysP.value;
            total = (daysSum + personSum) * 4000;
            totalValue.innerHTML = total * placeP.options[placeP.selectedIndex].value;
        }
    }

    persons.addEventListener('change', function() {
        cacl(this, restDays, place);
    });

    restDays.addEventListener('change', function() {
        cacl(persons, this, place);
    });

    place.addEventListener('change', function() {
        cacl(persons, restDays, this);
    });


}); 


