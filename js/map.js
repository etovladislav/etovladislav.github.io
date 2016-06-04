function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: {lat: 54.57, lng: 48.44}
    });
    map.addListener('click', function () {
        $('.navbar').css('display', 'none');
    });

    setMarkers(map);
}

var rivers = [
    ['р.Меша - с.Пестрецы ', 55.44, 49.39, 3, mesha],
    ['р.Казанка - пгт Арск', 56.06, 49.52, 5, kazanka],
    ['р.Улема - д.Нармонка', 54.57, 48.44, 4, ulema],
    ['р.Свияга - с.Вырыпаевка', 54.15, 48.17, 2, sviyaga],
    ['р.Бузулук - д.Перевозниково', 52.40, 52.16, 1, buzuluk]
];

function setMarkers(map) {
    var infoWindow = new google.maps.InfoWindow();
    for (var i = 0; i < rivers.length; i++) {
        var river = rivers[i];
        var marker = new google.maps.Marker({
            position: {lat: river[1], lng: river[2]},
            map: map,
            title: river[0],
            river: river[4],
            number: i
        });
        (function (marker, river) {
            google.maps.event.addListener(marker, "click", function (e) {
                infoWindow.setContent("<div class='info-map'>" + marker.title + "</div>");
                infoWindow.open(map, marker);
                openHeader(marker.river, marker.title, marker.number);
            });
        })(marker, river);
    }
}
var selectedRiver = null;
var selectedRiverNumber = null;
function openHeader(river, title, number) {
    selectedRiver = river;
    selectedRiverNumber = number;
    $('#year').text("");
    for (var i = 0; i < river.length; i++) {
        $('#year').append('<option value=' + river[i].year + '>' + river[i].year + '</option>');
    }
    $('#year').append('<option value="maxAll">Max All</option>');

    $('#header-button').on('click', function () {
        var year = $('#year').val();
        var hq = $('#hq').val();
        var res = null;
        var number = selectedRiverNumber;
        var river = selectedRiver;
        $('#modal-graphic').text('');
        $('#myModalLabel').text('');
        $('#modal-data').text('');
        $('#maxAll').text('');
        if (year == "maxAll") {
            $('#table').css('display', 'none');
            $('#maxAll').append('<img src="images/' + number + '.jpg" style="width: 100%;"/>');

        } else {
            $('#table').css('display', 'block');
            for (var i = 0; i < river.length; i++) {
                if (river[i].year == year) {
                    res = river[i];
                    break;
                }
            }
            var image = (hq == 'h') ? res.imageH : res.imageQ;
            $('#modal-graphic').append('<img src=images/' + number + '/' + image + ' style="width: 100%;"/>');
            $('#myModalLabel').append(title);

            var dataHQ = (hq == 'h') ? res.H : res.Q;

            var day = daysInMonth(1, year);
            var currentDay = 1;
            var currentMonth = 1;
            for (var i = 0; i < dataHQ.length; i++) {
                if ((currentDay - 1) == day) {
                    currentMonth++;
                    day = daysInMonth(currentMonth, year);
                    currentDay = 1;
                }
                $('#modal-data').append("<tr>" +
                    "<td>" + i + "</td>" +
                    "<td>" + currentDay++ + "</td>" +
                    "<td>" + dataHQ[i] + "</td>" +
                    "</tr>");
            }
        }
        $('#modalochka').modal();
    });

    $('.navbar').css('display', 'block');

}

function daysInMonth(month, year) {
    var MonthDays = [
        [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    ];
    if (month < 1 || month > 12) return 0;
    return MonthDays[((month == 2) || ((year % 4 == 0) || ((year % 100 != 0) || (year % 400 == 0)))) ? 1 : 0][month - 1];
}

