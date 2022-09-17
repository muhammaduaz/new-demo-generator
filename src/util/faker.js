const faker = require('faker');
import { toaster } from 'evergreen-ui';

const generatePhone = () => {
  let phone = faker.phone.phoneNumber();
  phone = phone.replace(/\D/g, '');
  phone = `${phone.substring(0,3)}-${phone.substring(3,6)}-${phone.substring(6,10)}`;
  return phone;
}

export const generateUsers = (numOfUsers) => {
  let users = [];
  for (let id=1; id <= numOfUsers; id++) {

    let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();
    let anonymousId = faker.datatype.uuid();
    let user_id = faker.datatype.uuid().split('-')[0];
    let unique_value = (Math.random() + 1).toString(36).substring(2);
    
    users.push({
        "first_name": firstName,
        "last_name": lastName,
        "email": `${firstName}.${lastName}.${unique_value}@gmailx.com`,
        "phone": generatePhone(),
        "anonymousId": anonymousId,
        "user_id": user_id
    });
  }
  return users 
}

export const generateGroups = (numOfGroups) => {
  let groups = [];
  for (let id=1; id <= numOfGroups; id++) {

    let company_name = faker.company.companyName();
    let group_id = generateRandomValue('#short_id')
    let city = faker.address.city();
    let zip_code = faker.address.zipCode();
    let address = faker.address.streetAddress();
    let state = faker.address.state();
    let company_size = generateRandomValue('#int_between#5#5000');
    let phone_number = generateRandomValue('#phone');
    let company_logo = faker.image.avatar();
    let company_description = faker.lorem.paragraph();

    groups.push({
      company_name : company_name,
      group_id: group_id,
      city: city,
      zip_code: zip_code,
      address: address,
      state: state,
      company_size: company_size,
      phone_number: phone_number,
      company_logo: company_logo,
      company_description: company_description
    });
  }
  return groups 
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const randomCurrencyFromInterval = (min, max) => { // min and max included 
  return parseFloat((Math.random() * (parseFloat(max) - parseFloat(min)) + parseFloat(min)).toFixed(2));
}

export const generateRandomValue = (string, user={}, timestamp) => {
  let value = "";

  if (!string.includes("#")) return string;

  // Return long ID
  if (string.trim() == "##") {
    value = faker.datatype.uuid();
    return value;
  }
  // Return short ID
  if (string.trim() == "#") {
    value = faker.datatype.uuid();
    value = value.split("-")[0];
    return value;
  } 
  
  // Split string and set type equal to string after #
  let type = string.split("#")[1];
  if (type === "id" || type === "short_id") {
    value = faker.datatype.uuid();
    if (type === "short_id") value = value.split("-")[0];
  }
  
  // Locations
  if (type === "city") value = faker.address.city();
  if (type === "zip") value = faker.address.zipCode();
  if (type === "address") value = faker.address.streetAddress();
  if (type === "country") value = faker.address.country();
  if (type === "state") value = faker.address.state();
  if (type === "latitude") value = faker.address.latitude();
  if (type === "longitude") value = faker.address.longitude();
  if (type === "ip") value = faker.internet.ip();
  if (type === "full_name") value = faker.name.firstName() + " " + faker.name.lastName();
  if (type === "first_name") value = faker.name.firstName();
  if (type === "name") value = faker.name.firstName();
  if (type === "last_name") value = faker.name.lastName();
    

  // Commerce
  if (type === "color") value = faker.commerce.color();
  if (type === "department") value = faker.commerce.department();
  if (type === "price") value = parseFloat(faker.commerce.price()/4.00.toFixed(2));
  if (type === "price_high") value = parseFloat(faker.commerce.price()).toFixed(2);
  if (type === "price_between") {
    if (string.split("#").length === 4) {
      let min = string.split("#")[2];
      let max = string.split("#")[3];
      value = randomCurrencyFromInterval(min, max);
    } else {
      toaster.danger(`Random Value Error - price_between`, {id: 'error-toast'});
    }
  } 
  if (type === "int_between") {
    if (string.split("#").length === 4) {
      let min = Math.ceil(string.split("#")[2]);
      let max = Math.floor(string.split("#")[3]);
      value = Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
      toaster.danger(`Random Value Error - price_between`, {id: 'error-toast'});
    }
  } 
  if (type === "material") value = faker.commerce.material();
  if (type === "product_description") value = faker.commerce.productDescription();

  // Company and People
  if (type === "company_name") value = faker.company.companyName();
  if (type === "role") value = faker.name.jobTitle();
  if (type === "gender") value = faker.name.gender();
  if (type === "title") value = faker.name.title();
  if (type === "job_type") value = faker.name.jobType();
  if (type === "phone") value = generatePhone();

  // dates
  if (type === "date_past") value = faker.date.past();
  if (type === "date_recent") value = faker.date.recent();
  if (type === "date_future") value = faker.date.soon();

  if (type === "date_past") value = faker.date.past();
  if (type === "date_recent") value = faker.date.recent();
  if (type === "date_future_event") value = faker.date.soon(7, timestamp);

  if (type.includes("date_between") ) {
    if (string.split("#").length === 4) {
      let start = string.split("#")[2];
      let end = string.split("#")[3];
      value = faker.date.between(start, end);
    } else {
      toaster.danger(`Random Value Error - date_between`, {id: 'error-toast'});
    }
  }
  if (type === "my_email") value = user.email;
  if (type === "my_phone") value = user.phone;
  if (type === "my_first_name") value = user.first_name;
  if (type === "my_last_name") value = user.last_name;
  if (type === "my_full_name") value = `${user.first_name} ${user.last_name}`;
  if (type === "my_anon_id") value = user.anonymousId;
  if (type === "my_user_id") value = user.user_id;

  if (value === "") {
    return string;
  }
  
  return value
}