const axios = require('axios');
const cheerio = require('cheerio');
const url = require('url');

const URL = 'https://www.people-search.org/name/adam-smith';

axios.get(URL)
    .then(response => {
        getData(response.data);
    })
    .catch(error => {
        console.log('error');
    })

const getData = html => {
    let data = [];
    const $ = cheerio.load(html);
    
    $('.card-body[itemprop="person"]').each((i, elem) => {
        const obj = {
            id: '',
            fullName: '',
            firstName: '',
            middleName: '',
            lastName: '',
            state: '',
            city: '',
            address: '',
            age: '',
            phone: '',
            url: ''
        };

        // add id
        let link = $(elem).find('p>a').attr('href');  
        let idUser = String(link).replace("https://www.people-search.org/removal-request/", "");
        obj.id = idUser;

        //add name
        let names = $(elem).find('[itemprop="givenName"]').text();
        obj.lastName = $(elem).find('[itemprop="familyName"]').text();
        obj.fullName = names + ' ' + obj.lastName;
        let fullNameArr = obj.fullName.split(' ');
        obj.firstName = fullNameArr[0];
        obj.middleName = fullNameArr[1];

        //add state and city
        obj.state = $(elem).find('.st').text();
        obj.city = $(elem).find('.ct').text();
        
        //add address
        let getAddress = $(elem).find('[itemprop="streetAddress"]').html();
        let address = String(getAddress);
        obj.address = address;

        //add number
        let phoneNumber = Number($(elem).find('.blt').text().replace(/[-\s]/g,""));
        obj.url = URL;
        
        //add age
        let getAge = $(elem).find('.card-subtitle').text();
        let age = parseInt(getAge.replace(/\D+/g,""));

        function checkNumber(number) {
            if (number != 0) {
                return obj.phone = number;
            } else {
                return obj.phone = 'no number';
            }
        }

        function checkAge(age) {
            if (!isNaN(age)) {
                return obj.age = age;
            } else {
                return obj.age = 'no information';
            }
        }

        checkNumber(phoneNumber);
        checkAge(age);
        data.push(obj);
    });

    const json = JSON.stringify(data);
    console.log(data);
}

