import React from "react";
import _ from "lodash";
import rest from "./rest";
import config from "../config";
import CryptoJS from "crypto-js";
import moment from "moment";
import numeral from "numeral"

numeral.register('locale', 'id', {
  delimiters: {
      thousands: '.',
      decimal: ','
  },
  abbreviations: {
      thousand: 'K',
      million: 'Jt',
      billion: 'M',
      trillion: 'T'
  },
  currency: {
      symbol: 'Rp'
  }
});

numeral.locale('id')

export const setAuthToken = token => {
  if (token) {
    // Apply to every request
    rest().defaults.headers.common["Authorization"] = "bearer " + token;
  } else {
    // Delete auth header
    delete rest().defaults.headers.common["Authorization"];
  }
};

export const capitalizeFirstLetter = string =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const encrypt = text => {
  if (_.isObject(text)) {
    return CryptoJS.AES.encrypt(JSON.stringify(text), config.cipher_crypt);
  } else {
    return CryptoJS.AES.encrypt(text, config.cipher_crypt);
  }
};

export const decryptObject = crypted => {
  const bytes = CryptoJS.AES.decrypt(crypted.toString(), config.cipher_crypt);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

  return decryptedData;
};

export const decrypt = crypted => {
  const bytes = CryptoJS.AES.decrypt(crypted.toString(), config.cipher_crypt);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

  return decryptedData;
}

export const cacheStore = (type = "local") => {
    if (type === "local") {
      return localStorage;
    } else if (type === "session") {
      return sessionStorage;
    }
  };
  
export const dateTime = {
  getDateNow:()=>{
    return moment().format("YYYY-MM-DD").toString()
  },
  convertToDate:(date)=>{
    return moment(date).format("YYYY-MM-DD")
  },
  displayHumanDate:(date)=> {
    return moment(date, "YYYY-MM-DD").format("ll")
  }
}

export const currency = {
  short:(number)=>{
    return numeral(number).format('0.[0]a')
  },
  digit:(number)=>{
    return numeral(number).format('0,0')
  },
  parse:(str)=>{
    return numeral(str).value()
  }
}