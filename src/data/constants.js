export const districts = [
  'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam', 
  'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram', 
  'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
];

export const elevations = [
  { id: 'Lowland', nameEN: 'Lowland (Coastal/Plains)', nameML: 'താഴ്ന്ന പ്രദേശം (തീരദേശം/ഇടനാട്)' },
  { id: 'Midland', nameEN: 'Midland (Laterite hills)', nameML: 'ഇടനാട് (വെട്ടുകൽ പ്രദേശങ്ങൾ)' },
  { id: 'Highland', nameEN: 'Highland (Mountains)', nameML: 'മലനാട് (മലയോരപ്രദേശങ്ങൾ)' }
];

export const categories = [
  { id: 'All', en: 'All', ml: 'എല്ലാം' },
  { id: 'Cereal', en: 'Cereal', ml: 'ധാന്യം' },
  { id: 'Plantation', en: 'Plantation', ml: 'തോട്ടവിള' },
  { id: 'Spice', en: 'Spice', ml: 'മസാല' },
  { id: 'Fruit', en: 'Fruit', ml: 'ഫലം' },
  { id: 'Tuber', en: 'Tuber', ml: 'കിഴങ്ങ്' },
  { id: 'Vegetable', en: 'Vegetable', ml: 'പച്ചക്കറി' }
];

export const getSeason = () => {
  const month = new Date().getMonth() + 1; // 1-12
  if (month >= 3 && month <= 5) return 'Summer';
  if (month >= 6 && month <= 8) return 'SW Monsoon';
  if (month >= 9 && month <= 11) return 'NE Monsoon';
  return 'Winter';
};
