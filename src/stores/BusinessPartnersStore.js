import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useBusinessPartnersStore = defineStore('businessPartnersStore', () => {
  const partnersError = ref('');
  const partnersDeleteError = ref('');
  const partnersData = ref(null);
  const partnersAddData = ref(null);

  function cleanParams(obj) {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    );
  }


  const Partners = async (params, bearerToken) => {
    console.log('params',  params,);
    try {
      const cleanedParams = cleanParams({
        cardName: params.cardName,
        phone1: params.phone1,
        address: params.address,
        skip: params.skip,
        limit: params.limit,
      });

      console.log('cleanedParams', cleanedParams);

      const res = await axios.get('http://localhost:5149/api/business-partners', {
        params: cleanedParams,
        headers: {
          Authorization: `Bearer ${bearerToken?.token}`,
        },
      });

      partnersData.value = res;
    } catch (error) {
      console.error('Partners Error:', error);
      if (axios.isAxiosError(error)) {
        partnersError.value = error.response?.data?.message || error.message || 'Unknown axios error';
      } else {
        partnersError.value = 'Unknown error';
      }
    }
  };


  const PartnersById = async (id, authData) => {
    try {
      const res = await axios.get(`http://localhost:5149/api/business-partners/${id}`, {
        headers: {
          Authorization: `Bearer ${authData?.token}`,
        },
      });
      partnersData.value = res;
    } catch (error) {
      console.error('PartnersById Error:', error);
      partnersError.value = error?.response?.data?.message || 'Unknown error';
    }
  };

  const PartnersAdd = async (partnerData, localeToken) => {
    console.log('!!!!!!!!!PartnersAdd', partnerData);
    try {
      const res = await axios.post(
        'http://localhost:5149/api/business-partners',
        partnerData,
        {
          headers: {
            Authorization: `Bearer ${localeToken.token}`,
          },
        },
      );
      partnersAddData.value = res;
    } catch (error) {
      console.error('PartnersAdd Error:', error);
      partnersError.value = error?.response?.data?.message || 'Unknown error';
    }
  };

  const PartnersEdit = async (partnerData, token) => {
    try {
      const res = await axios.patch(
        `http://localhost:5149/api/business-partners/${partnerData.cardCode}`,
        {
          cardName: partnerData.cardName,
          groupCode: partnerData.groupCode,
          phone1: partnerData.phone1,
          valid: partnerData.valid,
          address: partnerData.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      partnersAddData.value = res;
    } catch (error) {
      console.error('PartnersEdit Error:', error);
      partnersError.value = error?.response?.data?.message || 'Unknown error';
    }
  };

  const PartnersDelete = async (partnerData, token) => {
    partnersDeleteError.value = null;  //remove old errors

    try {
      await axios.delete(
        `http://localhost:5149/api/business-partners/${partnerData.cardCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.error('PartnersDelete Error:', error);
      partnersDeleteError.value = error?.response?.data?.message || 'Unknown error';
    }
  };


  return {
    Partners,
    PartnersById,
    PartnersAdd,
    PartnersEdit,
    PartnersDelete,
    partnersDeleteError,
    partnersError,
    partnersData,
    partnersAddData,
  };
});
