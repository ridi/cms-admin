export const handleError = (e) => {
  alert(e.response && e.response.data ? e.response.data : e.message);
};
