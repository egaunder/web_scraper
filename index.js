const request = require('request');
const cheerio = require('cheerio');

const alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

let parentURL = ''
/*alphabets.forEach((letter) => {

}); */

request(`https://www2.cslb.ca.gov/OnlineServices/CheckLicenseII/NameSearch.aspx?NextName=a&NextLicNum=`, (err, res, body) => {
  if (!err && res.statusCode == 200) {
    let $ = cheerio.load(body);
    let licNums = [];
    
    $('td a', '#ctl00_LeftColumnMiddle_Table1').each(function() {
      licNums.push($(this).attr('href'));
    });

    licNums.forEach((license) => {
      
    });
  }
});