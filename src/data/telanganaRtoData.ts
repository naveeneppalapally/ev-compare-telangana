import type { RTOInfo, TelanganaDistrict, RegionalZone } from '../types/ev';

export const TELANGANA_CURRENT_PETROL_PRICE = 109.66; // ₹/L in Hyderabad / Telangana
export const TELANGANA_AVG_ELECTRICITY_RATE = 7.50;  // ₹/kWh (TSSPDCL / TSNPDCL average domestic tariff)
export const TELANGANA_RATES_LAST_VERIFIED = "24 August 2026"; // Last manual verification of fuel & tariff figures

export const TSSPDCL_DOMESTIC_TARIFF_SLABS = [
  { slab: '0-100 units', ratePerKwh: 5.50 },
  { slab: '101-200 units', ratePerKwh: 7.20 },
  { slab: '>200 units (EV standard)', ratePerKwh: 8.50 },
  { slab: 'Weighted Average', ratePerKwh: 7.50 }
];

export const TELANGANA_EV_POLICY_HIGHLIGHTS = {
  policyName: "Telangana Electric Vehicle & Energy Storage Policy (2024–2026)",
  governmentOrder: "G.O. Ms No. 41 (Transport, Roads & Buildings Department)",
  validityPeriod: "Valid across Telangana through December 31, 2026",
  roadTaxExemption: "100% Exemption on Road Tax (Life Tax) for Electric 2-Wheelers",
  registrationFeeExemption: "100% Exemption on Registration and Smart Card Charges",
  savingsVsPetrol: "Saves ~₹12,000 to ₹48,000 directly at time of registration",
  discomTariff: "TSSPDCL / TSNPDCL Domestic Low-Tension LT-1 Slabs apply (~₹5.50 - ₹8.50/unit)",
  keyBenefits: [
    "Zero Road Tax (Normally 12% of invoice on petrol two-wheelers in Telangana)",
    "Zero Registration & Smart Card RC Fees across all 38 TG RTOs",
    "Universal quota removal: Universal 100% waiver for all EV buyers until Dec 31, 2026",
    "Permitted on all major Hyderabad flyovers and expressways without surcharges",
    "Rapid deployment of public EV charging hubs at Hyderabad Metro stations and TSRTC bus depots"
  ]
};

export const TELANGANA_RTOS: RTOInfo[] = [
  { rtoCode: 'TG-01', legacyCode: 'TS-01', seriesNumber: 1, districtId: 'adilabad', districtName: 'Adilabad', officeLocation: 'Adilabad', zone: 'North Telangana', majorLocalities: ['Adilabad Town', 'Mavala', 'Bela', 'Jainath', 'Gudihathnoor'], trafficProfile: 'Rural/Inter-district' },
  { rtoCode: 'TG-02', legacyCode: 'TS-02', seriesNumber: 2, districtId: 'karimnagar', districtName: 'Karimnagar', officeLocation: 'Karimnagar', zone: 'North-Central', majorLocalities: ['Karimnagar Urban', 'Choppadandi', 'Manakondur', 'Huzurabad'], trafficProfile: 'Tier-2 City' },
  { rtoCode: 'TG-03', legacyCode: 'TS-03', seriesNumber: 3, districtId: 'hanamkonda', districtName: 'Hanamkonda (Warangal Urban)', officeLocation: 'Hanamkonda', zone: 'Eastern Telangana', majorLocalities: ['Hanamkonda', 'Kazipet', 'Subedari', 'Hasanparthy'], trafficProfile: 'Tier-2 City' },
  { rtoCode: 'TG-04', legacyCode: 'TS-04', seriesNumber: 4, districtId: 'khammam', districtName: 'Khammam', officeLocation: 'Khammam', zone: 'South-East', majorLocalities: ['Khammam City', 'Wyra', 'Madhira', 'Kallur', 'Sattupalli'], trafficProfile: 'Tier-2 City' },
  { rtoCode: 'TG-05', legacyCode: 'TS-05', seriesNumber: 5, districtId: 'nalgonda', districtName: 'Nalgonda', officeLocation: 'Nalgonda', zone: 'South Telangana', majorLocalities: ['Nalgonda Town', 'Miryalaguda', 'Devarakonda', 'Nakrekal'], trafficProfile: 'Rural/Inter-district' },
  { rtoCode: 'TG-06', legacyCode: 'TS-06', seriesNumber: 6, districtId: 'mahabubnagar', districtName: 'Mahabubnagar', officeLocation: 'Mahabubnagar', zone: 'South Telangana', majorLocalities: ['Mahabubnagar Town', 'Jadcherla', 'Bhoothpur', 'Devarkadra'], trafficProfile: 'Tier-2 City' },
  { rtoCode: 'TG-07', legacyCode: 'TS-07', seriesNumber: 7, districtId: 'rangareddy', districtName: 'Ranga Reddy (Attapur / Shamshabad)', officeLocation: 'Attapur / Shamshabad', zone: 'Hyderabad Peripheral', majorLocalities: ['Attapur', 'Rajendranagar', 'Shamshabad', 'Ibrahimpatnam', 'Shadnagar', 'Gachibowli Outer'], trafficProfile: 'Mixed Highway' },
  { rtoCode: 'TG-08', legacyCode: 'TS-08', seriesNumber: 8, districtId: 'medchal-malkajgiri', districtName: 'Medchal-Malkajgiri (Kukatpally / Medchal)', officeLocation: 'Medchal / Keesara', zone: 'Hyderabad Peripheral', majorLocalities: ['Malkajgiri', 'Kukatpally', 'Kompally', 'Alwal', 'Quthbullapur', 'Medchal', 'Keesara'], trafficProfile: 'Heavy Urban' },
  { rtoCode: 'TG-09', legacyCode: 'TS-09', seriesNumber: 9, districtId: 'hyderabad-central', districtName: 'Hyderabad Central (Khairatabad)', officeLocation: 'Khairatabad', zone: 'Hyderabad Metro', majorLocalities: ['Khairatabad', 'Banjara Hills', 'Jubilee Hills', 'Somajiguda', 'Punjagutta', 'Ameerpet'], trafficProfile: 'Heavy Urban' },
  { rtoCode: 'TG-10', legacyCode: 'TS-10', seriesNumber: 10, districtId: 'hyderabad-north', districtName: 'Hyderabad North (Secunderabad)', officeLocation: 'Secunderabad', zone: 'Hyderabad Metro', majorLocalities: ['Secunderabad', 'Marredpally', 'Begumpet', 'Trimulgherry', 'Bowenpally'], trafficProfile: 'Heavy Urban' },
  { rtoCode: 'TG-11', legacyCode: 'TS-11', seriesNumber: 11, districtId: 'hyderabad-east', districtName: 'Hyderabad East (Malakpet)', officeLocation: 'Malakpet', zone: 'Hyderabad Metro', majorLocalities: ['Malakpet', 'Dilsukhnagar', 'Amberpet', 'Koti', 'Saidabad', 'Chaderghat'], trafficProfile: 'Heavy Urban' },
  { rtoCode: 'TG-12', legacyCode: 'TS-12', seriesNumber: 12, districtId: 'hyderabad-south', districtName: 'Hyderabad South (Bahadurpura)', officeLocation: 'Bahadurpura', zone: 'Hyderabad Metro', majorLocalities: ['Old City', 'Charminar', 'Falaknuma', 'Bahadurpura', 'Chandrayangutta', 'Kishanbagh'], trafficProfile: 'Heavy Urban' },
  { rtoCode: 'TG-13', legacyCode: 'TS-13', seriesNumber: 13, districtId: 'hyderabad-west', districtName: 'Hyderabad West (Tolichowki / Mehdipatnam)', officeLocation: 'Tolichowki', zone: 'Hyderabad Metro', majorLocalities: ['Tolichowki', 'Mehdipatnam', 'Golconda', 'Langar Houz', 'Gachibowli Inner', 'Shaikpet'], trafficProfile: 'Heavy Urban' },
  { rtoCode: 'TG-14', legacyCode: 'TS-14', seriesNumber: 14, districtId: 'hyderabad-east-uppal', districtName: 'Hyderabad East (Uppal / LB Nagar)', officeLocation: 'Uppal', zone: 'Hyderabad Metro', majorLocalities: ['Uppal', 'LB Nagar', 'Habsiguda', 'Ramanthapur', 'Nagole', 'Hayathnagar'], trafficProfile: 'Heavy Urban' },
  { rtoCode: 'TG-15', legacyCode: 'TS-15', seriesNumber: 15, districtId: 'sangareddy', districtName: 'Sangareddy (Patancheru / BHEL)', officeLocation: 'Sangareddy', zone: 'West Telangana', majorLocalities: ['Sangareddy Town', 'Patancheru', 'BHEL', 'RC Puram', 'Zaheerabad', 'Kandi'], trafficProfile: 'Mixed Highway' },
  { rtoCode: 'TG-16', legacyCode: 'TS-16', seriesNumber: 16, districtId: 'nizamabad', districtName: 'Nizamabad', officeLocation: 'Nizamabad', zone: 'North-West', majorLocalities: ['Nizamabad City', 'Armoor', 'Bodhan', 'Bheemgal', 'Dichpally'], trafficProfile: 'Tier-2 City' },
  { rtoCode: 'TG-17', legacyCode: 'TS-17', seriesNumber: 17, districtId: 'kamareddy', districtName: 'Kamareddy', officeLocation: 'Kamareddy', zone: 'North-West', majorLocalities: ['Kamareddy Town', 'Banswada', 'Yellareddy', 'Domakonda'], trafficProfile: 'Rural/Inter-district' },
  { rtoCode: 'TG-18', legacyCode: 'TS-18', seriesNumber: 18, districtId: 'nirmal', districtName: 'Nirmal', officeLocation: 'Nirmal', zone: 'North Telangana', majorLocalities: ['Nirmal Town', 'Bhainsa', 'Khanapur', 'Mudhole'], trafficProfile: 'Rural/Inter-district' },
  { rtoCode: 'TG-19', legacyCode: 'TS-19', seriesNumber: 19, districtId: 'mancherial', districtName: 'Mancherial', officeLocation: 'Mancherial', zone: 'North Telangana', majorLocalities: ['Mancherial Town', 'Bellampalli', 'Mandamarri', 'Chennur', 'Luxettipet'], trafficProfile: 'Rural/Inter-district' },
  { rtoCode: 'TG-20', legacyCode: 'TS-20', seriesNumber: 20, districtId: 'kumuram-bheem-asifabad', districtName: 'Kumuram Bheem Asifabad', officeLocation: 'Asifabad', zone: 'North Telangana', majorLocalities: ['Asifabad', 'Kagaznagar', 'Sirpur', 'Rebbena', 'Wankidi'], trafficProfile: 'Rural/Inter-district' },
  { rtoCode: 'TG-21', legacyCode: 'TS-21', seriesNumber: 21, districtId: 'jagtial', districtName: 'Jagtial', officeLocation: 'Jagtial', zone: 'North-Central', majorLocalities: ['Jagtial Town', 'Korutla', 'Metpally', 'Raikal', 'Dharmapuri'], trafficProfile: 'Rural/Inter-district' },
  { rtoCode: 'TG-22', legacyCode: 'TS-22', seriesNumber: 22, districtId: 'peddapalli', districtName: 'Peddapalli (Ramagundam)', officeLocation: 'Peddapalli', zone: 'North Telangana', majorLocalities: ['Ramagundam Coal City', 'Godavarikhani', 'Peddapalli Town', 'Sultanabad'], trafficProfile: 'Tier-2 City' },
  { rtoCode: 'TG-23', legacyCode: 'TS-23', seriesNumber: 23, districtId: 'rajanna-sircilla', districtName: 'Rajanna Sircilla', officeLocation: 'Sircilla', zone: 'North-Central', majorLocalities: ['Sircilla Textile Town', 'Vemulawada Temple Town', 'Yellareddypet'], trafficProfile: 'Rural/Inter-district' },
  { rtoCode: 'TG-24', legacyCode: 'TS-24', seriesNumber: 24, districtId: 'warangal-rural', districtName: 'Warangal (Rural) / Geesugonda', officeLocation: 'Geesugonda / Warangal', zone: 'Eastern Telangana', majorLocalities: ['Warangal Fort', 'Narsampet', 'Wardhannapet', 'Parkal', 'Geesugonda'], trafficProfile: 'Rural/Inter-district' },
  { rtoCode: 'TG-25', legacyCode: 'TS-25', seriesNumber: 25, districtId: 'jayashankar-bhupalpally', districtName: 'Jayashankar Bhupalpally', officeLocation: 'Bhupalpally', zone: 'Eastern Telangana', majorLocalities: ['Bhupalpally Coal Belt', 'Chityal', 'Regonda', 'Kataram'], trafficProfile: 'Rural/Inter-district' },
  { rtoCode: 'TG-26', legacyCode: 'TS-26', seriesNumber: 26, districtId: 'mahabubabad', districtName: 'Mahabubabad', officeLocation: 'Mahabubabad', zone: 'Eastern Telangana', majorLocalities: ['Mahabubabad Town', 'Thorrur', 'Kesamudram', 'Maripeda'], trafficProfile: 'Rural/Inter-district' },
  { rtoCode: 'TG-27', legacyCode: 'TS-27', seriesNumber: 27, districtId: 'jangaon', districtName: 'Jangaon', officeLocation: 'Jangaon', zone: 'Eastern Telangana', majorLocalities: ['Jangaon Town', 'Station Ghanpur', 'Palakurthi', 'Bachannapet'], trafficProfile: 'Rural/Inter-district' },
  { rtoCode: 'TG-28', legacyCode: 'TS-28', seriesNumber: 28, districtId: 'bhadradri-kothagudem', districtName: 'Bhadradri Kothagudem', officeLocation: 'Kothagudem', zone: 'South-East', majorLocalities: ['Kothagudem', 'Palwancha', 'Bhadrachalam', 'Yellandu', 'Manuguru'], trafficProfile: 'Rural/Inter-district' },
  { rtoCode: 'TG-29', legacyCode: 'TS-29', seriesNumber: 29, districtId: 'suryapet', districtName: 'Suryapet', officeLocation: 'Suryapet', zone: 'South Telangana', majorLocalities: ['Suryapet City', 'Kodad', 'Huzurnagar', 'Thungathurthi'], trafficProfile: 'Tier-2 City' },
  { rtoCode: 'TG-30', legacyCode: 'TS-30', seriesNumber: 30, districtId: 'yadadri-bhuvanagiri', districtName: 'Yadadri Bhuvanagiri (Bhongir)', officeLocation: 'Bhongir', zone: 'Eastern Telangana', majorLocalities: ['Bhongir Town', 'Yadagirigutta Temple City', 'Alair', 'Choutuppal'], trafficProfile: 'Rural/Inter-district' },
  { rtoCode: 'TG-31', legacyCode: 'TS-31', seriesNumber: 31, districtId: 'nagarkurnool', districtName: 'Nagarkurnool', officeLocation: 'Nagarkurnool', zone: 'South Telangana', majorLocalities: ['Nagarkurnool Town', 'Kalwakurthy', 'Achampet', 'Kollapur'], trafficProfile: 'Rural/Inter-district' },
  { rtoCode: 'TG-32', legacyCode: 'TS-32', seriesNumber: 32, districtId: 'wanaparthy', districtName: 'Wanaparthy', officeLocation: 'Wanaparthy', zone: 'South Telangana', majorLocalities: ['Wanaparthy Town', 'Kothakota', 'Pebbair', 'Gopalpeta'], trafficProfile: 'Rural/Inter-district' },
  { rtoCode: 'TG-33', legacyCode: 'TS-33', seriesNumber: 33, districtId: 'jogulamba-gadwal', districtName: 'Jogulamba Gadwal', officeLocation: 'Gadwal', zone: 'South Telangana', majorLocalities: ['Gadwal Town', 'Alampur', 'Ieeja', 'Maldakal', 'Dharur'], trafficProfile: 'Rural/Inter-district' },
  { rtoCode: 'TG-34', legacyCode: 'TS-34', seriesNumber: 34, districtId: 'vikarabad', districtName: 'Vikarabad', officeLocation: 'Vikarabad', zone: 'West Telangana', majorLocalities: ['Vikarabad Town', 'Tandur Stone Belt', 'Parigi', 'Kodangal'], trafficProfile: 'Rural/Inter-district' },
  { rtoCode: 'TG-35', legacyCode: 'TS-35', seriesNumber: 35, districtId: 'medak', districtName: 'Medak', officeLocation: 'Medak', zone: 'North-West', majorLocalities: ['Medak Town', 'Narsapur', 'Ramayampet', 'Alladurg'], trafficProfile: 'Rural/Inter-district' },
  { rtoCode: 'TG-36', legacyCode: 'TS-36', seriesNumber: 36, districtId: 'siddipet', districtName: 'Siddipet', officeLocation: 'Siddipet', zone: 'North-Central', majorLocalities: ['Siddipet City', 'Gajwel', 'Dubbak', 'Husnabad'], trafficProfile: 'Tier-2 City' },
  { rtoCode: 'TG-37', legacyCode: 'TS-37', seriesNumber: 37, districtId: 'mulugu', districtName: 'Mulugu', officeLocation: 'Mulugu', zone: 'Eastern Telangana', majorLocalities: ['Mulugu Town', 'Eturnagaram', 'Govindaraopet', 'Venkatapur'], trafficProfile: 'Rural/Inter-district' },
  { rtoCode: 'TG-38', legacyCode: 'TS-38', seriesNumber: 38, districtId: 'narayanpet', districtName: 'Narayanpet', officeLocation: 'Narayanpet', zone: 'South Telangana', majorLocalities: ['Narayanpet Town', 'Makthal', 'Kosgi', 'Damaragidda'], trafficProfile: 'Rural/Inter-district' }
];

export const TELANGANA_DISTRICTS: TelanganaDistrict[] = [
  { id: 'hyderabad-central', name: 'Hyderabad Central (Khairatabad / Banjara Hills)', rtoCode: 'TG-09', legacyCode: 'TS-09', zone: 'Hyderabad Metro', headquarters: 'Khairatabad', rtoCodes: ['TG-09', 'TG-10', 'TG-11', 'TG-12', 'TG-13', 'TG-14'] },
  { id: 'hyderabad-north', name: 'Hyderabad North (Secunderabad / Trimulgherry)', rtoCode: 'TG-10', legacyCode: 'TS-10', zone: 'Hyderabad Metro', headquarters: 'Secunderabad', rtoCodes: ['TG-10'] },
  { id: 'hyderabad-east', name: 'Hyderabad East (Malakpet / Dilsukhnagar)', rtoCode: 'TG-11', legacyCode: 'TS-11', zone: 'Hyderabad Metro', headquarters: 'Malakpet', rtoCodes: ['TG-11'] },
  { id: 'hyderabad-south', name: 'Hyderabad South (Charminar / Old City)', rtoCode: 'TG-12', legacyCode: 'TS-12', zone: 'Hyderabad Metro', headquarters: 'Bahadurpura', rtoCodes: ['TG-12'] },
  { id: 'hyderabad-west', name: 'Hyderabad West (Tolichowki / Mehdipatnam / Shaikpet)', rtoCode: 'TG-13', legacyCode: 'TS-13', zone: 'Hyderabad Metro', headquarters: 'Tolichowki', rtoCodes: ['TG-13'] },
  { id: 'hyderabad-east-uppal', name: 'Hyderabad East / Uppal (Uppal / LB Nagar)', rtoCode: 'TG-14', legacyCode: 'TS-14', zone: 'Hyderabad Metro', headquarters: 'Uppal', rtoCodes: ['TG-14'] },
  { id: 'rangareddy', name: 'Ranga Reddy (Attapur / Shamshabad / Rajendranagar)', rtoCode: 'TG-07', legacyCode: 'TS-07', zone: 'Hyderabad Peripheral', headquarters: 'Shamshabad', rtoCodes: ['TG-07'] },
  { id: 'medchal-malkajgiri', name: 'Medchal-Malkajgiri (Kukatpally / Kompally / Medchal)', rtoCode: 'TG-08', legacyCode: 'TS-08', zone: 'Hyderabad Peripheral', headquarters: 'Medchal', rtoCodes: ['TG-08'] },
  { id: 'sangareddy', name: 'Sangareddy (Patancheru / BHEL / Zaheerabad)', rtoCode: 'TG-15', legacyCode: 'TS-15', zone: 'West Telangana', headquarters: 'Sangareddy', rtoCodes: ['TG-15'] },
  { id: 'hanamkonda', name: 'Hanamkonda / Warangal Urban (Kazipet / Subedari)', rtoCode: 'TG-03', legacyCode: 'TS-03', zone: 'Eastern Telangana', headquarters: 'Hanamkonda', rtoCodes: ['TG-03'] },
  { id: 'warangal-rural', name: 'Warangal (Rural) / Geesugonda', rtoCode: 'TG-24', legacyCode: 'TS-24', zone: 'Eastern Telangana', headquarters: 'Geesugonda', rtoCodes: ['TG-24'] },
  { id: 'karimnagar', name: 'Karimnagar (Huzurabad / Choppadandi)', rtoCode: 'TG-02', legacyCode: 'TS-02', zone: 'North-Central', headquarters: 'Karimnagar', rtoCodes: ['TG-02'] },
  { id: 'khammam', name: 'Khammam (Wyra / Madhira / Sattupalli)', rtoCode: 'TG-04', legacyCode: 'TS-04', zone: 'South-East', headquarters: 'Khammam', rtoCodes: ['TG-04'] },
  { id: 'nizamabad', name: 'Nizamabad (Armoor / Bodhan / Bheemgal)', rtoCode: 'TG-16', legacyCode: 'TS-16', zone: 'North-West', headquarters: 'Nizamabad', rtoCodes: ['TG-16'] },
  { id: 'kamareddy', name: 'Kamareddy (Banswada / Yellareddy)', rtoCode: 'TG-17', legacyCode: 'TS-17', zone: 'North-West', headquarters: 'Kamareddy', rtoCodes: ['TG-17'] },
  { id: 'nalgonda', name: 'Nalgonda (Miryalaguda / Devarakonda)', rtoCode: 'TG-05', legacyCode: 'TS-05', zone: 'South Telangana', headquarters: 'Nalgonda', rtoCodes: ['TG-05'] },
  { id: 'suryapet', name: 'Suryapet (Kodad / Huzurnagar)', rtoCode: 'TG-29', legacyCode: 'TS-29', zone: 'South Telangana', headquarters: 'Suryapet', rtoCodes: ['TG-29'] },
  { id: 'yadadri-bhuvanagiri', name: 'Yadadri Bhuvanagiri (Bhongir / Yadagirigutta)', rtoCode: 'TG-30', legacyCode: 'TS-30', zone: 'Eastern Telangana', headquarters: 'Bhongir', rtoCodes: ['TG-30'] },
  { id: 'mahabubnagar', name: 'Mahabubnagar (Jadcherla / Bhoothpur)', rtoCode: 'TG-06', legacyCode: 'TS-06', zone: 'South Telangana', headquarters: 'Mahabubnagar', rtoCodes: ['TG-06'] },
  { id: 'nagarkurnool', name: 'Nagarkurnool (Kalwakurthy / Achampet)', rtoCode: 'TG-31', legacyCode: 'TS-31', zone: 'South Telangana', headquarters: 'Nagarkurnool', rtoCodes: ['TG-31'] },
  { id: 'wanaparthy', name: 'Wanaparthy (Kothakota / Pebbair)', rtoCode: 'TG-32', legacyCode: 'TS-32', zone: 'South Telangana', headquarters: 'Wanaparthy', rtoCodes: ['TG-32'] },
  { id: 'jogulamba-gadwal', name: 'Jogulamba Gadwal (Alampur / Ieeja)', rtoCode: 'TG-33', legacyCode: 'TS-33', zone: 'South Telangana', headquarters: 'Gadwal', rtoCodes: ['TG-33'] },
  { id: 'narayanpet', name: 'Narayanpet (Makthal / Kosgi)', rtoCode: 'TG-38', legacyCode: 'TS-38', zone: 'South Telangana', headquarters: 'Narayanpet', rtoCodes: ['TG-38'] },
  { id: 'siddipet', name: 'Siddipet (Gajwel / Dubbak)', rtoCode: 'TG-36', legacyCode: 'TS-36', zone: 'North-Central', headquarters: 'Siddipet', rtoCodes: ['TG-36'] },
  { id: 'rajanna-sircilla', name: 'Rajanna Sircilla (Vemulawada / Sircilla)', rtoCode: 'TG-23', legacyCode: 'TS-23', zone: 'North-Central', headquarters: 'Sircilla', rtoCodes: ['TG-23'] },
  { id: 'jagtial', name: 'Jagtial (Korutla / Metpally)', rtoCode: 'TG-21', legacyCode: 'TS-21', zone: 'North-Central', headquarters: 'Jagtial', rtoCodes: ['TG-21'] },
  { id: 'peddapalli', name: 'Peddapalli (Ramagundam / Godavarikhani)', rtoCode: 'TG-22', legacyCode: 'TS-22', zone: 'North Telangana', headquarters: 'Peddapalli', rtoCodes: ['TG-22'] },
  { id: 'mancherial', name: 'Mancherial (Bellampalli / Mandamarri)', rtoCode: 'TG-19', legacyCode: 'TS-19', zone: 'North Telangana', headquarters: 'Mancherial', rtoCodes: ['TG-19'] },
  { id: 'nirmal', name: 'Nirmal (Bhainsa / Khanapur)', rtoCode: 'TG-18', legacyCode: 'TS-18', zone: 'North Telangana', headquarters: 'Nirmal', rtoCodes: ['TG-18'] },
  { id: 'adilabad', name: 'Adilabad (Mavala / Bela / Jainath)', rtoCode: 'TG-01', legacyCode: 'TS-01', zone: 'North Telangana', headquarters: 'Adilabad', rtoCodes: ['TG-01'] },
  { id: 'kumuram-bheem-asifabad', name: 'Kumuram Bheem Asifabad (Kagaznagar / Sirpur)', rtoCode: 'TG-20', legacyCode: 'TS-20', zone: 'North Telangana', headquarters: 'Asifabad', rtoCodes: ['TG-20'] },
  { id: 'bhadradri-kothagudem', name: 'Bhadradri Kothagudem (Bhadrachalam / Palwancha)', rtoCode: 'TG-28', legacyCode: 'TS-28', zone: 'South-East', headquarters: 'Kothagudem', rtoCodes: ['TG-28'] },
  { id: 'mahabubabad', name: 'Mahabubabad (Thorrur / Kesamudram)', rtoCode: 'TG-26', legacyCode: 'TS-26', zone: 'Eastern Telangana', headquarters: 'Mahabubabad', rtoCodes: ['TG-26'] },
  { id: 'jangaon', name: 'Jangaon (Station Ghanpur / Palakurthi)', rtoCode: 'TG-27', legacyCode: 'TS-27', zone: 'Eastern Telangana', headquarters: 'Jangaon', rtoCodes: ['TG-27'] },
  { id: 'jayashankar-bhupalpally', name: 'Jayashankar Bhupalpally (Chityal / Regonda)', rtoCode: 'TG-25', legacyCode: 'TS-25', zone: 'Eastern Telangana', headquarters: 'Bhupalpally', rtoCodes: ['TG-25'] },
  { id: 'mulugu', name: 'Mulugu (Eturnagaram / Venkatapur)', rtoCode: 'TG-37', legacyCode: 'TS-37', zone: 'Eastern Telangana', headquarters: 'Mulugu', rtoCodes: ['TG-37'] },
  { id: 'medak', name: 'Medak (Narsapur / Ramayampet)', rtoCode: 'TG-35', legacyCode: 'TS-35', zone: 'North-West', headquarters: 'Medak', rtoCodes: ['TG-35'] },
  { id: 'vikarabad', name: 'Vikarabad (Tandur / Parigi / Kodangal)', rtoCode: 'TG-34', legacyCode: 'TS-34', zone: 'West Telangana', headquarters: 'Vikarabad', rtoCodes: ['TG-34'] }
];

export function getRtoByCode(code: string): RTOInfo | undefined {
  if (!code) return undefined;
  const normalized = code.trim().toUpperCase().replace('TS-', 'TG-');
  return TELANGANA_RTOS.find(r => r.rtoCode === normalized || r.legacyCode === code.trim().toUpperCase());
}

export function getDistrictById(districtId: string): TelanganaDistrict | undefined {
  if (!districtId) return undefined;
  return TELANGANA_DISTRICTS.find(d => d.id === districtId);
}

export function getRtosByDistrict(districtId: string): RTOInfo[] {
  return TELANGANA_RTOS.filter(r => r.districtId === districtId);
}

export function getRtosByZone(zone: RegionalZone): RTOInfo[] {
  return TELANGANA_RTOS.filter(r => r.zone === zone);
}

export function getTelanganaDistricts(): TelanganaDistrict[] {
  return TELANGANA_DISTRICTS;
}

export function getAllRtos(): RTOInfo[] {
  return TELANGANA_RTOS;
}
