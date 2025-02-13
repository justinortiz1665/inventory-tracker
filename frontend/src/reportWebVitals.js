<<<<<<< HEAD
const reportWebVitals = onPerfEntry => {
=======
const reportWebVitals = (onPerfEntry) => {
>>>>>>> 17ae09cc (Initial commit of inventory tracker progress)
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
