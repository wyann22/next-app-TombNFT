async function main() {
  let ret = 0;
  const func1 = async () => {
    ret = await "1";
    console.log("func1 ", ret);
  };
  const func2 = async () => {
    console.log("func2 ", ret);
  };

  func1();
  func2();
  return ret;
}
console.log("before main");
// main().then((ret) => {
//   console.log("main ", ret);
// });
console.log(await main());
console.log("after main");
