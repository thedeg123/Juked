/**
 * @description - Equivelent to python zip function
 * @author - @ninjagecko on stackoverflow :)
 */
export default arrays => {
  return arrays[0].map(function(_, i) {
    return arrays.map(function(array) {
      return array[i];
    });
  });
};
