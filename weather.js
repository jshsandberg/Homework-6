
$("#searchBtn").on("click", function () {
  search($("#searchCity").val())
});
$(document).on("click", ".history", function () {
  search($(this).text())
})

const searched = localStorage.getItem("history") ? JSON.parse(localStorage.getItem("history")) : [];

appendBtns();
function search(str) {
  //console.log(str)
  $(`#tempLocation`).text = ``
  let queryURL_1 = `https://api.openweathermap.org/data/2.5/weather?q=` + str + `,us&appid=28d57d24aa77f51c32840ff10cb9e437`;
  let queryURL_2 = `https://api.openweathermap.org/data/2.5/forecast?q=` + str + `&appid=28d57d24aa77f51c32840ff10cb9e437`;
  



  $.ajax({
    url: queryURL_1,
    method: "GET",
  }).then(function (response) {
    let kelvin = (response.main.temp);
    let celsius = kelvin - 273;
    let temp = Math.floor(celsius * (9/5) + 32);
    $(`#tempLocation`).text(` ${temp} F`);
    let humidity = (response.main.humidity);
    $(`#humiLocation`).text(` ${humidity} %`);
    let windSpeed = (response.wind.speed);
    $(`#windLocation`).text(` ${windSpeed} MPH`);
    let lat = (response.coord.lat);
    let lon = (response.coord.lon);
    let queryURL_3 = `http://api.openweathermap.org/data/2.5/uvi?appid=28d57d24aa77f51c32840ff10cb9e437&lat=` + lat + `&lon=` + lon + ``;
      $.ajax({
        url: queryURL_3,
        method: "GET",
      }).then(function (response){
        //console.log(response);
        let uvIndex = (response.value);
        $(`#uvIndex`).text(` ${uvIndex}`);
      })
    let city = (response.name)
    $(`#cityLocation`).text(`${city}`)
    let iconcode0 = response.weather[0].icon;
    let iconurl0 = "http://openweathermap.org/img/w/" + iconcode0 + ".png";
    $('#wicon0').attr('src', iconurl0);
    //console.log(response)
    $.ajax({
    url: queryURL_2,
    method: "GET"
  }).then(function ({ list }) {
    if (!searched.includes(str)) {
      searched.push(str);
      localStorage.setItem('history', JSON.stringify(searched));
      appendBtns()
    }

    for (let i = 1; i < 6; i++) {
      let index = i * 8 - 3;
      $(`#date${i}`).text(list[index].dt_txt);
      $(`#wicon${i}`).attr('src', `http://openweathermap.org/img/w/${list[index].weather[0].icon}.png`);
      let kelvin = (list[index].main.temp);
      let celsius = kelvin - 273;
      let temp = Math.floor(celsius * (9/5) + 32);
      $(`#temp${i}`).text(`${temp} F`);
      $(`#humi${i}`).text(`${list[index].main.humidity} %`)
      $('.hidden').show()
    }
  });
  });
  
}

function appendBtns() {
  $('#recentSearch').html("");
  searched.forEach(e => {
    $(`#recentSearch`).append(`<button id="fun" class="history">${e}`)
  });
}