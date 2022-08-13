export const formatString = (input:string) => input.toLocaleLowerCase();

export const formatStringArray = (input: string[]) => {
  const formattedArray: string[] = [];
  input.map((x:string) => {
    const formattedString = formatString(x);
    formattedArray.push(formattedString);
  });
  return formattedArray;
};