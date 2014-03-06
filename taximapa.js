function make_draggable($elements) {
	/* Elements is a jquery object: */
	$elements.draggable({
		containment:'parent',
		start:function(e,ui){ ui.helper.css('z-index',++zIndex); },
		stop:function(e,ui){
		}
	});
}
    var map;
(function($){
jQuery(document).ready(
function(){
var idSzukajMarker, klienci, taksowki;
    function podepnij_eventy() {
        function ustaw_markery_od_do() {
            var szukaj_od = $('#taxi-szukaj-od').val();
            var szukaj_do = $('#taxi-szukaj-do').val();
            var telefon = $('#taxi-szukaj-telefon').val();
            var nazwa = telefon != "" ? telefon : "Brak";

            dodaj_marker_adres(nazwa, szukaj_do);
            dodaj_marker_adres(nazwa, szukaj_od);
        }
        $('#taxi-lista a.dodaj').click(function(e){
            e.preventDefault();
            var nazwa_kierowcy = $('#taxi-nazwa').val();
            var adres = $('#taxi-ulica').val();
            var nazwa = nazwa_kierowcy != ""? nazwa_kierowcy : "Taxi";
            pobierz_wsp_z_adresu(adres, nazwa);
        });   

        $('#taxi-szukaj-przycisk').click(function() {
            ustaw_markery_od_do();
        });
        
        $("#taxi-szukaj-dodaj").click(function(e){
            var szukaj_od = $('#taxi-szukaj-od').val();
            var szukaj_do = $('#taxi-szukaj-do').val();
            var telefon = $('#taxi-szukaj-telefon').val();
            var nazwa = "od: " + szukaj_od + " do: " + szukaj_do;
            ustaw_markery_od_do();
            dodaj_taxi(telefon, nazwa);
        });
        $("#taxi-switch").click(function(){
            var szukaj_od = $('#taxi-szukaj-od').val();
            $('#taxi-szukaj-od').val($('#taxi-szukaj-do').val());
            $('#taxi-szukaj-do').val(szukaj_od);
        });
    }
    
    function dodaj_markery_taxi() {
        var lista_taksowek = ["Romek", "Krzysiu", "Zbysiu", "Wiesiu"];
        var latLng = new google.maps.LatLng(54.3350301,18.6258778);
        for(var taxi in lista_taksowek) {
            map.addMarker({
                lat: latLng.lat(),
                lng: latLng.lng(),
                title: taxi,
                icon: "car_share.png",
                draggable: true,
                click: function(e) {
                },
                dragend: function(e) {
               
                }
            });
        }
    }
    
    function d() {
      GMaps.geocode({
                address: szukaj,
                callback: function(results, status) {
                    var latLng = results[0].geometry.location;
                    if (status == 'OK') {
                        if (idSzukajMarker === undefined) {
                            dodaj_marker("", latLng);
                            idSzukajMarker = map.markers.length-1;
                        }
                        marker = pobierz_marker(idSzukajMarker);
                        marker.setOptions({
                            position: latLng
                        });
                        map.setCenter(latLng.lat(), latLng.lng());
                        map.setZoom(12);
                    }
                }
            });
    }

    function pobierz_trase(origin, destination) {
        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
                {
                    origins: [origin],
                    destinations: [destination],
                    travelMode: google.maps.TravelMode.DRIVING,
                    avoidHighways: false,
                    avoidTolls: false
                }, callback);

        function callback(response, status) {
            console.table(response.rows[0]);
            console.table(response.rows[0].elements[0].distance.text);
            console.log(status);
        }
    }
        
    function dodaj_taxi(nazwa_kierowcy, adres) {
        var taxiLista = $('#taxi-lista-klientow');
        var struktura = "<li><p>" + nazwa_kierowcy + "</p><p> "+ adres + "</p></li>";
        var elementListy = $(struktura);
        elementListy.appendTo(taxiLista).hide().fadeIn();
    }
    
    function ukryj_marker(idMarker) {
        var marker = pobierz_marker(idMarker);
        marker.setMap(null);
    }
    function dodaj_marker_adres(nazwa, adres, typ) {
        GMaps.geocode({
            address: adres,
            callback: function(results, status) {
                var latLng = results[0].geometry.location;
                if (status == 'OK') {
                    dodaj_marker("adres", latLng, typ);
                }
            }
        });
    }
    function dodaj_marker(nazwa, latLng, typ) {
        var image="male-2.png";
        map.setCenter(latLng.lat(), latLng.lng());
        map.addMarker({
            lat: latLng.lat(),
            lng: latLng.lng(),
            title: nazwa,
            icon: image,
            draggable: true,
            click: function(e) {
                this.setMap(null);
            },
            dragend: function(e) {
           
            }
        });
    }
    
    function pobierz_marker(idMarker) {
        return map.markers[idMarker];
    }
    
    function wyswietl_komunikat(rodzaj_komunikatu, tresc) {
        function utworz_komunikat() {
            var div = $("<div id='taxi-komunikat' class='komunikat "+rodzaj_komunikatu+"'>"+tresc+"</div>");
            div.appendTo($("#szukaj"));
            div.click(function(){$(this).fadeOut().remove();});
        }
        var komunikat = $('#taxi-komunikat');
        
        if (!komunikat.length) {
        console.log('nie ma');
            utworz_komunikat();
        }
    }
    
    function pobierz_wsp_z_adresu(adres, nazwa) {
        GMaps.geocode({
            address: adres,
            callback: function(results, status) {
                if (status == 'OK') {
                  dodaj_marker(nazwa, results[0].geometry.location);
                  dodaj_taxi(nazwa, adres);
                } else if (status == 'ZERO_RESULTS') {
                    wyswietl_komunikat('blad', "Nie znaleziono.");
                }
            }
        });
    }
    
    map = new GMaps({
        div: '#mapa',
        lat: 54.3350301,
        lng: 18.6258778,
        zoom: 12,
        click: function(e) {
            dodaj_taxi("Taxi", e.latLng);
            dodaj_marker("Taxi", e.latLng);
        },
    });
    
    podepnij_eventy();
    dodaj_markery_taxi();
    $("#taxi-lista-klientow, .dropable").sortable(
        {
            connectWith: ".dropable",
            placeholder: "ui-state-highlight",
            start: function(e, ui) {
                
            },
            stop: function(e, ui) {
                
            }
        }
    ).disableSelection();
    
});
})(jQuery);


