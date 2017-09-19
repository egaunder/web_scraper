const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const async = require('async');
const readLastLines = require('read-last-lines');

function getUserAgent() {
  const agents = [
    // Simulating Mozilla/5.0
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.71 Safari/537.36',
    // Internet Explorer 11
    'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko',
    // IE11 for the desktop on 64-bit Windows 8.1 Update
    'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; Touch; rv:11.0) like Gecko',
    // IE11 for the desktop on 64-bit Windows 8.1 Update with enterprise mode enabled
    'Mozilla/4.0 (compatible; MSIE 11.0; Windows NT 6.1; Trident/4.0; Tablet PC 2.0)',
    // Internet Explorer for Windows Phone 8.1 Update
    'Mozilla/5.0 (Mobile; Windows Phone 8.1; Android 4.0; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; NOKIA; Lumia 520) like iPhone OS 7_0_3 Mac OS X AppleWebKit/537 (KHTML, like Gecko) Mobile Safari/537',
    // IE on Xbox One
    'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0; Xbox; Xbox One)',
    // Chrome
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36',
    // Mozilla Firefox Ubuntu
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:42.0) Gecko/20100101 Firefox/42.0',
    // Chrome
    'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.1 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2226.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.4; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2225.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2225.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2224.3 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2214.93 Safari/537.36',
    // Lastest Mozilla
    'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0',
    // Lastest Chrome
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
    // Latest Edge
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393',
    // Latest Opera
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36 OPR/46.0.2597.32',     
    // Simulating Mozilla/5.0
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.71 Safari/537.36',
    // Internet Explorer 11
    'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko',
    // IE11 for the desktop on 64-bit Windows 8.1 Update 
    'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; Touch; rv:11.0) like Gecko',
    // IE11 for the desktop on 64-bit Windows 8.1 Update with enterprise mode enabled 
    'Mozilla/4.0 (compatible; MSIE 11.0; Windows NT 6.1; Trident/4.0; Tablet PC 2.0)',
    // Internet Explorer for Windows Phone 8.1 Update
    'Mozilla/5.0 (Mobile; Windows Phone 8.1; Android 4.0; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; NOKIA; Lumia 520) like iPhone OS 7_0_3 Mac OS X AppleWebKit/537 (KHTML, like Gecko) Mobile Safari/537',
    // IE on Xbox One
    'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0; Xbox; Xbox One)',
    // Chrome
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36',
    // Mozilla Firefox Ubuntu
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:42.0) Gecko/20100101 Firefox/42.0',
    // Chrome
    'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.1 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2226.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.4; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2225.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2225.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2224.3 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2214.93 Safari/537.36',
    // Lastest Mozilla
    'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0',
    // Lastest Chrome
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
    // Latest Edge
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393',
    // Latest Opera
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36 OPR/46.0.2597.32'
  ];

  return agents[Math.floor(Math.random() * 35)];
}

function getValidClass() {
  const validClassA = ['206', '34', '55', '54', '35', '52'];

  return validClassA[Math.floor(Math.random() * 6)];
}

function getIP() {
  let x1 = getValidClass();
  let x2 = Math.floor(Math.random() * 255 + 1);
  let x3 = Math.floor(Math.random() * 255 + 1);
  let x4 = Math.floor(Math.random() * 255 + 1);
  return `${x1}.${x2}.${x3}.${x4}`;
}

//let pageUrl = 'https://www2.cslb.ca.gov/OnlineServices/CheckLicenseII/NameSearch.aspx?NextName=A+%2b+FENCE+%26+GATES%27&NextLicNum=844576';

function scrapeProfile(licNums, index, lastName) {
  
  // Configure header
  let config = {
    headers: {
      'X_FORWARDED_FOR': getUserAgent(),
      'REMOTE_ADDR': getIP()
    }
  };
  let licNum = '';
  let businessName = address = city = state = postCode = phone = entity = issueDate = reIssueDate = expDate = licStatus = classifications = licConBonComp = bondNum = bondAmt = bndEffectiveDate = bndCancelDate = '';

  if (licNums && licNums.length > 0) {

    licNum = (index > 0) ? licNums[index] : licNums[0]; 

    // Throttle request to 2 seconds per request
    setTimeout(function() {
      let profileUrl = `https://www2.cslb.ca.gov/OnlineServices/CheckLicenseII/LicenseDetail.aspx?${licNum}`;
      axios.get(profileUrl, config)
        .then((response) => {
          if (response) {
            let $ = cheerio.load(response.data);
           // Extract Business info
            /*[ 'A + DRAPES &amp; BLINDS',
            '28816 PHOENIX WAY',
            'SUN CITY, CA 92586',
            'Business Phone Number:(951) 805-7796',
            '',
            '' ]*/
            let businessInfo = $('#ctl00_LeftColumnMiddle_BusInfo').html();
            if (businessInfo) {
              businessInfos = businessInfo.split('<br>');
            }
            
            if (businessInfos[0]) {
              businessName = businessInfos[0].replace(',', ' ');
            }
            
            if (businessInfos[1]) {
              address = businessInfos[1].replace(',', ' ');
            }
            
            if (businessInfos[2]) {
              city = businessInfos[2].split(',')[0];
            }
            
            if (businessInfos[2] && businessInfos[2].split(', ').length > 1) {
              state = businessInfos[2].split(', ')[1].substr(0, 2);
            }

            if (businessInfos[2] && businessInfos[2].split(',').length > 1) {
              postCode = businessInfos[2].split(', ')[1].substr(3);
            }

            if (businessInfos[3]) {
              phone = businessInfos[3].replace('Business Phone Number:', '').trim();
            }
            
            if ($('#ctl00_LeftColumnMiddle_Entity').text()) {
              entity = $('#ctl00_LeftColumnMiddle_Entity').text();
            }

            if ($('#ctl00_LeftColumnMiddle_IssDt').text()) {
              issueDate = $('#ctl00_LeftColumnMiddle_IssDt').text();
            }

            if ($('#ctl00_LeftColumnMiddle_ReIssueDt').text()) {
              reIssueDate = $('#ctl00_LeftColumnMiddle_ReIssueDt').text();
            }

            if ($('#ctl00_LeftColumnMiddle_ExpDt').text()) {
              expDate = $('#ctl00_LeftColumnMiddle_ExpDt').text();
            }

            // Extract License Status
            if ($('#ctl00_LeftColumnMiddle_Status').text()) {
              licStatus = $('#ctl00_LeftColumnMiddle_Status').text();
            }
            
            // Extract Classifications
            if ($('#ctl00_LeftColumnMiddle_ClassCellTable')) {
              if ($('#ctl00_LeftColumnMiddle_ClassCellTable').find('ul').length > 0) {
                // We have multiple classifications
                $('#ctl00_LeftColumnMiddle_ClassCellTable ul li').each(function() {
                  classifications +=  $(this).text().split(' - ')[0].trim() + ';';
                });
              } else {
                // We have one classification
                classifications = $('#ctl00_LeftColumnMiddle_ClassCellTable').text().split(' - ')[0].trim();
              }
            }

            // Extract Bond information
            if ($('#ctl00_LeftColumnMiddle_BondingCellTable blockquote p')) {
              let bondInfos = [];
              $('#ctl00_LeftColumnMiddle_BondingCellTable blockquote p').each(function() {
                bondInfos.push($(this).text());
              });

              // Bond layout
              /*[ 'This license filed a Contractor\'s Bond with  AMERICAN CONTRACTORS INDEMNITY COMPANY.',
              'Bond Number: 10125484',
              'Bond Amount: $12,500',
              'Effective Date: 01/01/2007',
              'Cancellation Date: 04/26/2013' ]*/
              
              if (bondInfos[0]) {
                licConBonComp = bondInfos[0].replace('This license filed a Contractor\'s Bond with  ', '').trim();
              }

              if (bondInfos[1]) {
                bondNum = bondInfos[1].replace('Bond Number: ', '').trim();
              }

              if (bondInfos[2]) {
                bondAmt = bondInfos[2].replace('Bond Amount: ', '').trim().replace(',', '');
              }

              if (bondInfos[3]) {
                bndEffectiveDate = bondInfos[3].replace('Effective Date: ', '').trim();
              }
            }

            // Write to file
            fs.appendFileSync('cslb.csv',`${businessName.trim()},${address.trim()},${city.trim()},${state.trim()},${postCode.trim()},${phone},${entity.trim()},${issueDate.trim()},${reIssueDate.trim()},${expDate.trim()},${licStatus.trim()},${classifications.trim()},${licConBonComp.trim()},${bondNum.trim()},${bondAmt.trim()},${bndEffectiveDate.trim()},${licNum.replace('LicNum=', '')}\n`);

            if ((index + 1) < licNums.length) {
              // We are still not at end of table, so continue scraping profiles
              scrapeProfile(licNums, (index + 1), lastName); 
            }

            if (index == (licNums.length - 1)) {
              // We are end of table page, so lets scrape new table page
              scrapeTable(licNums[licNums.length - 1], lastName);
            }
            
          }
        }); // Close of axios then
    }, 2000); // Close of setTimeout
  }
}

function scrapeTable(licNum = '', lastName = '', letter) {
  // Configure header
  let config = {
    headers: {
      'X_FORWARDED_FOR': getUserAgent(),
      'REMOTE_ADDR': getIP()
    }
  };
  let pageUrl = '';

  // Either load initial page or next page
  if (licNum !== '' && lastName !== '') {
    licNum = licNum.replace('LicNum=', '');
    lastName = encodeURIComponent(lastName).replace(/\%20/g, '+') + '%27';
    pageUrl = `https://www2.cslb.ca.gov/OnlineServices/CheckLicenseII/NameSearch.aspx?NextName=${lastName}&NextLicNum=${licNum}`;

    // Track last table page
    fs.appendFileSync('lastURL.txt', pageUrl + '\n');
  } else {
    if (lastUrlUsed === '') {
      pageUrl = `https://www2.cslb.ca.gov/OnlineServices/CheckLicenseII/NameSearch.aspx?NextName=${letter}&NextLicNum=`;
    } else {
      pageUrl = lastUrlUsed;
    }
    
  }

  axios.get(pageUrl, config)
  .then((response) => {
    let $ = cheerio.load(response.data);
    var licNums = [];
    var names = [];
    // Scrape all license numbers from table page
    $('td a', '#ctl00_LeftColumnMiddle_Table1').each(function() {
      licNums.push($(this).attr('href').replace('LicenseDetail.aspx?', ''));
    }); 
    // Scrape all names from page
    $('tbody tr td table tbody tr:first-child','#ctl00_LeftColumnMiddle_Table1').each(function() {
      names.push($(this).text().replace('Contractor Name', '').trim());
    });

    // We know table page exist so go ahead and scrape profile pages
    scrapeProfile(licNums, 0, names[names.length - 1]);
    
  })
  .catch(error => {
    if (error.response) {
      // Request was made but server responded with status code outside of 2xx
      // We are done scraping letter, go to next letter
      callback();
    } else if (error.request) {
      // Request was made but no response was made
      // We are done scraping letter, go to next letter
      callback();
    }
  }); // Close of axios
}

function determineWhichLetter(alphabets, lastUrlUsed) {
  if (lastUrlUsed !== '') {
    // https://www2.cslb.ca.gov/OnlineServices/CheckLicenseII/NameSearch.aspx?NextName=${lastName}&NextLicNum=${licNum}
    let pos = lastUrlUsed.indexOf('=');
    let letter = lastUrlUsed[pos + 1].toLocaleUpperCase();

    let letterPosition = alphabets.indexOf(letter);
    return alphabets.slice(letterPosition);
  } else {
    return alphabets;
  }
}

let lastUrlUsed = '';
let alphabets = ['c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
// Check to see if file alrady exist
readLastLines.read('cslb.csv', 1)
  .then(line => {
    // File exist, do nothing   
  })
  .catch(error => {
    if (error) {
      // File does not exist, create new one and add header
      const header = 'bussiness_name,address,city,state,postcode,phone,entity,issue_date,reissue_date,expiration_date,license_status,classifications,contractor_bonds,bond_number,bond_amount,bnd_effective_date\n';
    
      // We already added a header so comment out
      fs.appendFileSync('cslb.csv', header);
    }
  });

readLastLines.read('lastURL.txt',1)
  .then(line => {
    // this process was started already, use last url to start with
    lastUrlUsed = line;
    alphabets = determineWhichLetter(alphabets, lastUrlUsed);
    // Launch each letter in series
    async.eachOfSeries(alphabets, (letter, index, callback) => {
      scrapeTable('','', letter);
    });
  })
  .catch(error => {
    if (error) {
      // First time running
      alphabets = determineWhichLetter(alphabets, lastUrlUsed);
      // Launch each letter in series
      async.eachOfSeries(alphabets, (letter, index, callback) => {
        scrapeTable('','', letter);
      });
    }
  });



