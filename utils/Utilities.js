import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { CustomIcon } from "core/icon";
import { getCookie } from "./cookie";
import { loadFromLocalStorage } from "./sessionStorage";

export const socketURL = "https://api.lesociety.com/";
export const apiURL = "https://api.lesociety.com/";

// export const socketURL = "https://staging-api.nsmatka.com/";
// export const apiURL = "https://staging-api.nsmatka.com";

/*export const socketURL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_SOCKET_URL
    : process.env.NEXT_PUBLIC_PROD_SOCKET_URL;
export const apiURL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PROD_API_URL
    : process.env.NEXT_PUBLIC_PROD_API_URL;
    */

// export const apiRequest = async (args = {}) => {
//   let token = "";
//   const authCookie = getCookie("auth");
//   // const authCookie = getSessionStorage("auth");
//   if (authCookie) {
//     token = JSON.parse(decodeURIComponent(authCookie))?.user?.token;
//   }
//   args.url = `${"https://staging-api.secrettime.com/api/v1"}/${args.url}`;
//   return axios({
//     ...args,
//     headers: {
//       Authorization: `Bearer ${token || ""}`,
//     },
//   });
// };

export const apiRequest = async (args = {}) => {
  let token = "";
  const authCookie = loadFromLocalStorage();
  if (authCookie) {
    token = authCookie.user?.token;
  }
  args.url = `${`${apiURL}/api/v1`}/${args.url}`;
  return axios({
    ...args,
    headers: {
      Authorization: `Bearer ${token || ""}`,
    },
  });
};

export const apiRequestChatHistory = async (url, data) => {
  let token = "";
  const authCookie = getCookie("auth");
  // const authCookie = getSessionStorage("auth");

  if (authCookie) {
    token = JSON.parse(decodeURIComponent(authCookie))?.user?.token;
  }
  args.url = `${"https://api.lesociety.com/api/v1"}/${args.url}`;
  return axios({
    method: "GET",
    url: `${url}`,
    headers: {
      Authorization: `Bearer ${token || ""}`,
    },
    data: data,
  });
};

export const imageUploader = async (files) => {
  if (files.length > 0) {
    const formData = new FormData();
    const image_url = [];
    let res = [];
    files.forEach((file) => {
      return file[0]?.name
        ? formData.append(`files`, file[0])
        : image_url.push({ url: file });
    });
    if (formData.getAll("files").length > 0) {
      res = await apiRequest({
        url: "files",
        method: "POST",
        data: formData,
      })
        .then((success) => {
          return success;
        })
        .catch((error) => {
          return false;
        });
    }
    if (res?.data) {
      return image_url.concat(res.data.data.files);
    } else {
      return image_url;
    }
  } else {
    return false;
  }
};

export const imageUploaderNew = async (files) => {
  if (files.length > 0) {
    const formData = new FormData();
    const image_url = files;
    let res = [];
    files.forEach((file, index) => {
      if (file?.url[0]?.name) {
        return formData.append(`files`, file?.url[0]);
      }
    });
    if (formData.getAll("files").length > 0) {
      res = await apiRequest({
        url: "files",
        method: "POST",
        data: formData,
      })
        .then((success) => {
          return success;
        })
        .catch((error) => {
          return false;
        });
    }
    console.log("res", res);
    if (res?.data) {
      res.data.data?.files?.forEach((file, index) => {
        // find index of file in image_url array
        const indexId = image_url.findIndex(
          (item) => item?.url[0]?.name === file?.fileName
        );
        //  then replace the file in image_url array
        if (indexId > -1) {
          image_url[indexId] = { url: file?.url };
        }
      });
      return image_url;
    } else {
      return image_url;
    }
  } else {
    return false;
  }
};

export const showToast = (message, type) => {
  if (type === "error") {
    toast.error(message);
  }
  if (type === "success") {
    toast.success(message);
  }
};

export const redirect = (route) => {
  const router = useRouter();
  router.push(route);
};

export const dateCategory = [
  {
    label: "Morning Date",
    id: "MorningBeverage",
    iconName: "CustomIcon.Sun",
    icon: <CustomIcon.Sun color={"white"} size={20} />,
    category: "standard_class_date",
  },
  {
    label: "Outdoor Adventure",
    id: "OutdoorAdventure",
    icon: <CustomIcon.OutdoorAdventure color={"white"} size={20} />,
    iconName: "CustomIcon.OutdoorAdventure",
    category: "standard_class_date",
  },
  {
    label: "Evening Date",
    id: "EveningDate",
    icon: <CustomIcon.Moon color={"white"} size={20} />,
    iconName: "CustomIcon.Moon",
    category: "standard_class_date",
  },
  {
    label: "Take A Class",
    id: "TakeClass",
    icon: <CustomIcon.TakeClass color={"white"} size={20} />,
    iconName: "CustomIcon.TakeClass",
    category: "middle_class_date",
  },
  {
    label: "Entertainment & Sports ",
    id: "Entertainmentsports",
    icon: <CustomIcon.EntertainmentSports color={"white"} size={20} />,
    iconName: "CustomIcon.EntertainmentSports",
    category: "middle_class_date",
  },
  {
    label: "Wine & Dine ",
    id: "WineDine",
    icon: <CustomIcon.WineDine color={"white"} size={20} />,
    iconName: "CustomIcon.WineDine",
    category: "middle_class_date",
    class: "test1",
  },
  {
    label: "Casino & Drinks",
    id: "CasinoDrinks",
    icon: <CustomIcon.CasinoDrinks color={"white"} size={20} />,
    iconName: "CustomIcon.CasinoDrinks",
    category: "executive_class_date",
  },
  {
    label: "Champaign & Caviar",
    id: "ChampaignCaviar",
    icon: <CustomIcon.ChampaignCaviar color={"white"} size={20} />,
    iconName: "CustomIcon.ChampaignCaviar",
    category: "executive_class_date",
  },
  {
    label: "Bottles & Dance",
    id: "BottlesDance",
    icon: <CustomIcon.BottlesDance color={"white"} size={20} />,
    iconName: "CustomIcon.BottlesDance",
    category: "executive_class_date",
  },
  {
    label: "Get Sporty",
    id: "GetSporty",
    icon: <CustomIcon.Sporty color={"white"} size={20} />,
    iconName: "CustomIcon.GetSporty",
    category: "middle_class_dates",
  },
  {
    label: "Brunch Date",
    id: "MorningBeverage",
    iconName: "CustomIcon.Sun",
    icon: <CustomIcon.Sun color={"white"} size={20} />,
    category: "standard_class_date",
  },
];

export const countriesCode = {
  Andorra: "AD",
  "United Arab Emirates (the)": "AE",
  Afghanistan: "AF",
  "Antigua and Barbuda": "AG",
  Anguilla: "AI",
  Albania: "AL",
  Armenia: "AM",
  Angola: "AO",
  Antarctica: "AQ",
  Argentina: "AR",
  "American Samoa": "AS",
  Austria: "AT",
  Australia: "AU",
  Aruba: "AW",
  "Aland Islands": "AX",
  Azerbaijan: "AZ",
  "Bosnia and Herzegovina": "BA",
  Barbados: "BB",
  Bangladesh: "BD",
  Belgium: "BE",
  "Burkina Faso": "BF",
  Bulgaria: "BG",
  Bahrain: "BH",
  Burundi: "BI",
  Benin: "BJ",
  "Saint Barthelemy": "BL",
  Bermuda: "BM",
  "Brunei Darussalam": "BN",
  "Bolivia (Plurinational State of)": "BO",
  "Bonaire, Sint Eustatius and Saba": "BQ",
  Brazil: "BR",
  "Bahamas (the)": "BS",
  Bhutan: "BT",
  "Bouvet Island": "BV",
  Botswana: "BW",
  Belarus: "BY",
  Belize: "BZ",
  Canada: "CA",
  canada: "CA",
  "Cocos (Keeling) Islands (the)": "CC",
  "Congo (the Democratic Republic of the)": "CD",
  "Central African Republic (the)": "CF",
  "Congo (the)": "CG",
  Switzerland: "CH",
  "Cote d'Ivoire": "CI",
  "Cook Islands (the)": "CK",
  Chile: "CL",
  Cameroon: "CM",
  China: "CN",
  Colombia: "CO",
  "Costa Rica": "CR",
  Cuba: "CU",
  "Cabo Verde": "CV",
  Curacao: "CW",
  "Christmas Island": "CX",
  Cyprus: "CY",
  Czechia: "CZ",
  Germany: "DE",
  Djibouti: "DJ",
  Denmark: "DK",
  Dominica: "DM",
  "Dominican Republic (the)": "DO",
  Algeria: "DZ",
  Ecuador: "EC",
  Estonia: "EE",
  Egypt: "EG",
  "Western Sahara*": "EH",
  Eritrea: "ER",
  Spain: "ES",
  Ethiopia: "ET",
  Finland: "FI",
  Fiji: "FJ",
  "Falkland Islands (the) [Malvinas]": "FK",
  "Micronesia (Federated States of)": "FM",
  "Faroe Islands (the)": "FO",
  France: "FR",
  Gabon: "GA",
  "United Kingdom of Great Britain and Northern Ireland (the)": "GB",
  Grenada: "GD",
  Georgia: "GE",
  "French Guiana": "GF",
  Guernsey: "GG",
  Ghana: "GH",
  Gibraltar: "GI",
  Greenland: "GL",
  "Gambia (the)": "GM",
  Guinea: "GN",
  Guadeloupe: "GP",
  "Equatorial Guinea": "GQ",
  Greece: "GR",
  "South Georgia and the South Sandwich Islands": "GS",
  Guatemala: "GT",
  Guam: "GU",
  "Guinea-Bissau": "GW",
  Guyana: "GY",
  "HONG KONG": "HK",
  "Heard Island and McDonald Islands": "HM",
  Honduras: "HN",
  Croatia: "HR",
  Haiti: "HT",
  Hungary: "HU",
  Indonesia: "ID",
  Ireland: "IE",
  Israel: "IL",
  "Isle of Man": "IM",
  India: "IN",
  india: "IN",
  "British Indian Ocean Territory (the)": "IO",
  Iraq: "IQ",
  "Iran (Islamic Republic of)": "IR",
  Iceland: "IS",
  Italy: "IT",
  Jersey: "JE",
  Jamaica: "JM",
  Jordan: "JO",
  Japan: "JP",
  Kenya: "KE",
  Kyrgyzstan: "KG",
  Cambodia: "KH",
  Kiribati: "KI",
  "Comoros (the)": "KM",
  "Saint Kitts and Nevis": "KN",
  "Korea (the Democratic People's Republic of)": "KP",
  " Korea (the Republic of)": "KR",
  Kuwait: "KW",
  "Cayman Islands (the)": "KY",
  Kazakhstan: "KZ",
  "Lao People's Democratic Republic (the)": "LA",
  Lebanon: "LB",
  "Saint Lucia": "LC",
  Liechtenstein: "LI",
  "Sri Lanka": "LK",
  Liberia: "LR",
  Lesotho: "LS",
  Lithuania: "LT",
  Luxembourg: "LU",
  Latvia: "LV",
  Libya: "LY",
  Morocco: "MA",
  Monaco: "MC",
  "Moldova (the Republic of)": "MD",
  Montenegro: "ME",
  "Saint Martin (French part)": "MF",
  Madagascar: "MG",
  "Marshall Islands (the)": "MH",
  "North Macedonia": "MK",
  Mali: "ML",
  Myanmar: "MM",
  Mongolia: "MN",
  Macao: "MO",
  "Northern Mariana Islands (the)": "MP",
  Martinique: "MQ",
  Mauritania: "MR",
  Montserrat: "MS",
  Malta: "MT",
  Mauritius: "MU",
  Maldives: "MV",
  Malawi: "MW",
  Mexico: "MX",
  Malaysia: "MY",
  Mozambique: "MZ",
  Namibia: "NA",
  "New Caledonia": "NC",
  "Niger (the)": "NE",
  "Norfolk Island": "NF",
  Nigeria: "NG",
  Nicaragua: "NI",
  "Netherlands (the)": "NL",
  Norway: "NO",
  Nepal: "NP",
  nepal: "NP",
  Nauru: "NR",
  Niue: "NU",
  "New Zealand": "NZ",
  Oman: "OM",
  Panama: "PA",
  Peru: "PE",
  "French Polynesia": "PF",
  "Papua New Guinea": "PG",
  "Philippines (the)": "PH",
  Pakistan: "PK",
  pakistan: "PK",
  Poland: "PL",
  "Saint Pierre and Miquelon": "PM",
  Pitcairn: "PN",
  "Puerto Rico": "PR",
  "Palestine, State of": "PS",
  Portugal: "PT",
  Palau: "PW",
  Paraguay: "PY",
  Qatar: "QA",
  Reunion: "RE",
  Romania: "RO",
  Serbia: "RS",
  "Russian Federation (the)": "RU",
  Rwanda: "RW",
  "Saudi Arabia": "SA",
  "Solomon Islands": "SB",
  Seychelles: "SC",
  "Sudan (the)": "SD",
  Sweden: "SE",
  Singapore: "SG",
  "Saint Helena, Ascension and Tristan da Cunha": "SH",
  Slovenia: "SI",
  "Svalbard and Jan Mayen": "SJ",
  Slovakia: "SK",
  "Sierra Leone": "SL",
  "San Marino": "SM",
  Senegal: "SN",
  Somalia: "SO",
  Suriname: "SR",
  "South Sudan": "SS",
  "Sao Tome and Principe": "ST",
  "El Salvador": "SV",
  "Sint Maarten (Dutch part)": "SX",
  "Syrian Arab Republic (the)": "SY",
  Eswatini: "SZ",
  "Turks and Caicos Islands (the)": "TC",
  Chad: "TD",
  "French Southern Territories (the)": "TF",
  Togo: "TG",
  Thailand: "TH",
  Tajikistan: "TJ",
  Tokelau: "TK",
  "Timor-Leste": "TL",
  Turkmenistan: "TM",
  Tunisia: "TN",
  Tonga: "TO",
  Turkey: "TR",
  "Trinidad and Tobago": "TT",
  Tuvalu: "TV",
  "Taiwan (Province of China)": "TW",
  "Tanzania, the United Republic of": "TZ",
  Ukraine: "UA",
  Uganda: "UG",
  "United States Minor Outlying Islands (the)": "UM",
  "United States of America (the)": "US",
  "United arab emirates (the)": "AE",
  Uruguay: "UY",
  Uzbekistan: "UZ",
  "Holy See (the)": "VA",
  "Saint Vincent and the Grenadines": "VC",
  "Venezuela (Bolivarian Republic of)": "VE",
  "Virgin Islands (British)": "VG",
  "Virgin Islands (U.S.)": "VI",
  "Viet Nam": "VN",
  Vanuatu: "VU",
  "Wallis and Futuna": "WF",
  Samoa: "WS",
  Yemen: "YE",
  Mayotte: "YT",
  "South Africa": "ZA",
  Zambia: "ZM",
  Zimbabwe: "ZW",
};

export const bodyType = [
  {
    id: "Slim",
    name: "Slim",
  },
  {
    id: "Fit",
    name: "Fit",
  },
  {
    id: "Average",
    name: "Average",
  },
  {
    id: "Curvy",
    name: "Curvy",
  },
  {
    id: "Full Figured",
    name: "Full Figured",
  },
];
export const femaleBodyType = [
  {
    id: "Petite",
    name: "Petite",
  },
  {
    id: "Fit",
    name: "Fit",
  },
  {
    id: "Slender",
    name: "Slender",
  },
  {
    id: "Athletic",
    name: "Athletic",
  },
  {
    id: "Voluptuous",
    name: "Voluptuous",
  },
  {
    id: "Plus",
    name: "Plus",
  },
  {
    id: "Average",
    name: "Average",
  },
];

export const maleBodyType = [
  {
    id: "Thin",
    name: "Thin",
  },
  {
    id: "Average",
    name: "Average",
  },
  {
    id: "Ripped",
    name: "Ripped",
  },
  {
    id: "Heavyset",
    name: "Heavyset",
  },
  {
    id: "Jacked",
    name: "Jacked",
  },
  {
    id: "Towering",
    name: "Towering",
  },
];

export const Ethnicity = [
  {
    id: "White",
    name: "White",
  },
  {
    id: "Black",
    name: "Black",
  },
  {
    id: "Hispanic",
    name: "Hispanic",
  },
  {
    id: "Asian",
    name: "Asian",
  },
  {
    id: "Middle Eastern",
    name: "Middle Eastern",
  },
  {
    id: "East Indian",
    name: "East Indian",
  },
  {
    id: "Other",
    name: "Other",
  },
];
