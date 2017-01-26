$(function() {
  console.log("YO");
  $('input.autocomplete').autocomplete({
    data: {
      "CS61A": "https://www.python.org/static/opengraph-icon-200x200.png",
      "CS61B": "http://d3gnp09177mxuh.cloudfront.net/tech-page-images/java.png",
      "CS61C": 'https://lh3.googleusercontent.com/3gI9l3yQynt2cj1MFdTZbaYE0VK056s-lvE4iejCCZQ1_-S8v3ZGDCPsIhtQsOB8Kb8i=w300',
      "CS70": "https://lh3.ggpht.com/2ZbR3AYxGipGK-7rv7Zvmz2l1rmaaK8_Ncr9jWE7IdIxfI5lmgfIiFPnC5nZZEsqnRWL=w300",
      "CS161": "https://certification.comptia.org/images/default-source/blog-thumbnails/thinkstockphotos-533535877-(1).png?sfvrsn=0",
      "CS189": "https://image.freepik.com/free-vector/coloured-robot-design_1148-9.jpg"
    },
    limit: 20
  });
});
