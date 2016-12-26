function descargaReporteIndivSesion(cualSesion) {
    // // console.log('cualSesion', cualSesion);
    var sesionFch = that['sesionFecha' + cualSesion];
    var sesionSde = that['sesionKey' + cualSesion];
    var laUrlSesiones = "" + laUrlBase + "/Sesiones/" + sesionFch + '/' + sesionSde + "/.json?auth=" + secret + "";
    // // console.log('laUrlSesiones', laUrlSesiones);
    var data;

    $.ajax({
        url: laUrlSesiones,
        success: function(data) {
            // // console.log(data);

            $('.tablas').empty();

            //------------------------------------------------------
            //            TABLA GRAL
            //------------------------------------------------------

            $('.tablas').append(escape('Datos de la Sesión:') + '<div class="tabla1"></div>' + escape('Datos del Instructor:') + '<div class="tabla2"></div>' + escape('Datos de los Usuarios') + '<div class="tabla3"></div>' + '</div>');

            //------------------------------------------------------
            //            TABLA 1
            //------------------------------------------------------
            //obtenemos las llaves de la primer tabla
            var llaves1 = Object.keys(data)
            var miTabla1 = '<table><tr>';
            for (var x = 0; x < ((llaves1.length) - 2); x++) {
                miTabla1 = miTabla1 + '<th>' + llaves1[x] + '</th>';
            }
            miTabla1 = miTabla1 + '</tr> <tr>';
            //pinta headers (SIN INSTRUCTOR NI PARTICIPANTES)
            for (var x = 0; x < ((llaves1.length) - 2); x++) {
                miTabla1 = miTabla1 + '<td>' + data[llaves1[x]] + '</td>';
            }
            miTabla1 = miTabla1 + '</tr></table>';

            //------------------------------------------------------
            //            TABLA 2
            //------------------------------------------------------
            //obtenemos las llaves para la segunda tabla
            var llaves2 = Object.keys(data['instructor']);
            var miTabla2 = '<table><tr>';
            for (var x = 0; x < (llaves2.length); x++) {
                miTabla2 = miTabla2 + '<th>' + llaves2[x] + '</th>';
            }
            miTabla2 = miTabla2 + '</tr> <tr>';
            for (var x = 0; x < (llaves2.length); x++) {
                miTabla2 = miTabla2 + '<td>' + data['instructor'][llaves2[x]] + '</td>';
            }
            miTabla2 = miTabla2 + '</tr></table>';

            //------------------------------------------------------
            //            TABLA 3
            //------------------------------------------------------
            datosTabla3 = data['participantes'];
            listaUsuarios = Object.keys(datosTabla3);
            if (listaUsuarios.length > 0) {
                headers3 = Object.keys(datosTabla3[listaUsuarios[0]]);
                // // console.log(headers3);
            } else {
                headers3 = {};
            }
            //// console.log(datosTabla3);
            //// console.log(listaUsuarios);
            //// console.log(headers3);

            var miTabla3 = '<table>' +
                '<tr>';
            miTabla3 = miTabla3 + '<th></th>';
            //pintando headers
            for (var x = 0; x < headers3.length; x++) {
                miTabla3 = miTabla3 + '<th>' + headers3[x] + '</th>';
            }
            miTabla3 = miTabla3 + '</tr>';

            for (var x = 0; x < listaUsuarios.length; x++) {
                //pintamos el no de usuario
                miTabla3 = miTabla3 + '<tr><th>' + listaUsuarios[x] + '</th>';
                //pintamos las caracteristicas del usuario
                for (var y = 0; y < headers3.length; y++) {
                    miTabla3 = miTabla3 + '<td>' + datosTabla3[listaUsuarios[x]][headers3[y]] + '</td>';
                }

                miTabla3 = miTabla3 + '</tr>';
            }
            miTabla3 = miTabla3 + '</table>';

            //------------------------------------------------------
            //            PINTA TABLAS
            //------------------------------------------------------
            //pinta la primer tabla
            $(".tabla1").append(escape(miTabla1));
            //pinta la segunda tabla
            $(".tabla2").append(escape(miTabla2));
            //pinta la tercer tabla
            $(".tabla3").append(escape(miTabla3));
            //exporta a excel
            // $("#btnExport").click(function(e) {
            // Reporte_Sesion_" + sesionFch + "_" + sesionSde + ".csv


            // function saveContent(fileContents, fileName) {
            //     var link = document.createElement('a');
            //     $('a').attr('download', 'ssssss.xls');
            //     link.download = fileName;
            //     link.href = 'data:application/vnd.ms-excel;charset=utf-8,' + fileContents;
            //     link.click();
            // }
            //
            // saveContent($('.tablas').html(), 'uorales.xls');

            window.open('data:application/vnd.ms-excel;charset=utf-8,' + $('.tablas').html());
            // // console.log($('.tablas').html());
            // e.preventDefault();
            // });
            $('.tablas').empty();

        }
    })

}
