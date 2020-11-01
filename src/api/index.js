import axios from 'axios';

export default class APIClient {
  async getIP() {
    try {
      let result = await axios.get('https://icanhazip.com');
      if (result.status === 200) {
        return {ip : result.data};
      } else {
        return null;
      }
    } catch (err) {
      console.log('[function: getIP]:',err);
    }
  }

  async getGeolocationFromIP(ip) {
    try {
      let result = await axios.get(`https://www.iplocate.io/api/lookup/${ip}`);
      if (result.status === 200) {
        /* 
        return format : {country, city, latitude, longitude}
        */
        return {
          country : result.data.country ? result.data.country : 'N/A',
          city :  result.data.city ? result.data.city : 'N/A',
          latitude : result.data.latitude ? result.data.latitude : 'N/A',
          longitude : result.data.longitude ? result.data.longitude : 'N/A'
        };
      } else {
        return null;
      }
    } catch (err) {
      console.log('[function: getGeolocationFromIP]:',err);
    }
  }

  async getPrayTime(latitude,longitude) {
    try {
      let result = await axios.get(`https://api.pray.zone/v2/times/today.json?longitude=${longitude}&latitude=${latitude}`);
      if (result.status === 200) {
        /* 
        return format : {imsak, subuh, dzuhur, ashar, maghrib, isya, date_masehi, time_offset, time_format}
        */

        // set correct time to locale
        const currentTime = new Date();
        const days = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
        const currentDay = days[currentTime.getDay()];
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const currentMonth = months[currentTime.getMonth()];

        return {
          imsak : result.data.results.datetime[0].times['Imsak'] ? result.data.results.datetime[0].times['Imsak'] : 'N/A',
          subuh : result.data.results.datetime[0].times['Fajr'] ? result.data.results.datetime[0].times['Fajr'] : 'N/A',
          dzuhur : result.data.results.datetime[0].times['Dhuhr'] ? result.data.results.datetime[0].times['Dhuhr'] : 'N/A',
          ashar : result.data.results.datetime[0].times['Asr'] ? result.data.results.datetime[0].times['Asr'] : 'N/A',
          maghrib : result.data.results.datetime[0].times['Maghrib'] ? result.data.results.datetime[0].times['Maghrib'] : 'N/A',
          isya : result.data.results.datetime[0].times['Isha'] ? result.data.results.datetime[0].times['Isha'] : 'N/A',
          date_masehi : `${currentDay}, ${currentTime.getDate()} ${currentMonth} ${currentTime.getFullYear()}`, 
          time_offset : result.data.results.location.local_offset ? result.data.results.location.local_offset : 'N/A',
          time_format : result.data.results.settings.timeformat ? result.data.results.settings.timeformat : 'N/A'
        } ;
      } else {
        return null;
      }
    } catch (err) {
      console.log('[function: getGeolocationFromIP]:',err);
    }
  }

} 