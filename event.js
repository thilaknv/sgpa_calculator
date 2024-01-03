const container = document.querySelector('#container');
let web_page_state = 0;
let progress = null;

openForm1();

function openForm1() {
    web_page_state = 0;

    // using innerHTML
    container.innerHTML += `
    <form id="F1">
        <input type="number" id="sub_COUNT" placeholder="Total number of subjects" required
            min='1' max='10'>
        <button class='formButton'>Next</button>
    </form>
    `;

    // prevent default- prevents redirecting after submition of form
    const F1 = document.querySelector('#F1');
    F1.addEventListener('submit', (event) => {
        event.preventDefault();
        const count = document.querySelector('#sub_COUNT').value;

        if (count > 0 && count < 11) {
            F1.classList.add('hide');
            document.querySelector('.back').classList.remove('hide');

            openForm2(count);
        }
    });
}

function openForm2(count) {
    web_page_state = 1;

    const F2 = document.createElement('form');
    F2.id = 'F2';

    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.className = 'subjects';
        div.innerHTML = `
        <p style="width:30px">${i + 1}.</p>`;

        // grade input
        div.appendChild(get_G_Select_Inp('g' + i));
        div.appendChild(get_C_Select_Inp('c' + i));

        F2.appendChild(div);
    }
    F2.innerHTML += `<button class='formButton'>Calculate</button>`;
    container.appendChild(F2);

    // submit event listener for from 2
    F2.addEventListener('submit', event => {
        event.preventDefault();
        F2.classList.toggle('hide', true);

        calculate(count);
    })
}

function calculate(count) {
    web_page_state = 2;

    let total_credits = 0;
    let total_sum = 0;
    for (let i = 0; i < count; i++) {
        // string to number
        const grade = Number(document.querySelector('#g' + i).value);
        const credit = Number(document.querySelector('#c' + i).value);

        total_credits += credit;
        total_sum += (grade * credit);
    }

    let sgpa = total_sum / total_credits;
    // 2 decimal
    sgpa = Math.ceil(sgpa * 100);

    const resultDiv = document.createElement('div');
    resultDiv.className = 'resultDiv';
    resultDiv.onclick = () => animateResult(sgpa / 10);

    resultDiv.innerHTML = `
        <div class="result">
            <span id="sgpa"></span>
        </div>
        <h2>SGPA</h2>
    `;
    container.append(resultDiv);
    animateResult(sgpa / 10);
}

document.querySelector('.back').addEventListener('click', () => {

    if (web_page_state == 2) {
        document.querySelector('.resultDiv').remove();
        document.querySelector('#F2').classList.remove('hide');
    } else {
        document.querySelector('#F2').remove();
        document.querySelector('#F1').classList.remove('hide');
        document.querySelector('.back').classList.add('hide');
    }
    web_page_state--;
});

// other functions


function animateResult(sgpa) {
    clearInterval(progress);
    let x = 0, deg = 0;
    const result = document.querySelector('.result');
    const sgpa_span = document.querySelector('#sgpa');
    const speed = 3;
    const Interval = 50;

    progress = setInterval(() => {
        x += speed;
        deg = (x * 3.6);
        sgpa_span.innerText = (x / 10).toFixed(2);

        result.style.background = `conic-gradient(
            #4d5bf9 ${deg}deg, #cadcff ${deg}deg
        )`;

        if (x >= sgpa) {
            sgpa_span.innerText = (sgpa / 10).toFixed(2);
            clearInterval(progress);
        }
    }, Interval);
}

function get_G_Select_Inp(id) {
    const select = document.createElement('select');
    select.required = true;
    select.id = id;
    select.innerHTML = `
        <option value="10">S</option>
        <option value="9">A</option>
        <option value="8">B</option>
        <option value="7">C</option>
        <option value="5">D</option>
        <option value="4">E</option>
        <option value="0">F</option>
    `;
    return select;
}

function get_C_Select_Inp(id) {
    const select = document.createElement('select');
    select.required = true;
    select.id = id;

    for (let i = 10; i >= 0; i -= 0.5) {
        select.innerHTML += `
        <option value="${i}">${i}</option>`;
    }
    return select;
}