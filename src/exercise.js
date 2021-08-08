const jsonConfig = {
  startd: "node build/init.js",
  "build:server": "babel src -d build",
  "build:assets": "webpack --mode=production",
};

//결과적으로는 start를 통해서 build 안에 있는 옛날 javascript 파일로 init.js 가 실행된다는 것.
