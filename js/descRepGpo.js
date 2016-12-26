function descargaReportesSesionesCurso(cualCurso) {


    if (cualCurso == 1) {

        var laUrlSesiones = "" + laUrlBase + "/Sesiones/.json?auth=" + secret + "";
        var laTablaGral = '';
        var data;

        $.ajax({
            url: laUrlSesiones,
            success: function(data) {
                // console.log(data);
                descargaRepC1();
            }
        })

        function descargaRepC1() {

            var contador = 0;
            laTablaGral = '';

            for (a = 1; a <= cuantasSesiones; a++) {

                var laUrlSesiones = "" + laUrlBase + "/Sesiones/" + that['sesionFecha' + a] + '/' + that['sesionKey' + a] + "/.json?auth=" + secret + "";
                // console.log('laUrlSesiones', laUrlSesiones);

                var sesionFch = that['sesionFecha' + a];
                var sesionSde = that['sesionKey' + a];

                $.ajax({
                    url: laUrlSesiones,
                    success: function(data) {
                        // console.log(data);
                        contador++;
                        // console.log('contador', contador);

                        $('.tabla_gral').empty();
                        $('.tabla_1').empty();
                        $('.tabla_2').empty();
                        $('.tabla_3').empty();
                        $('.tabla_gral').append('<div class="tabla_' + contador + '"> </div>');

                        //------------------------------------------------------
                        //            TABLA GRAL
                        //------------------------------------------------------

                        $('.tabla_' + contador).append(escape('Datos de la Sesión:') + '<div class="tabla1"></div>' + escape('Datos del Instructor:') + '<div class="tabla2"></div>' + escape('Datos de los Participantes:') + '<div class="tabla3"></div>' + '</div>');

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
                        console.log('datosTabla3', datosTabla3);
                        if (datosTabla3 != undefined) {
                            listaUsuarios = Object.keys(datosTabla3);
                        }
                        console.log(listaUsuarios);
                        if (listaUsuarios.length > 0) {
                            if (datosTabla3 != undefined) {
                                headers3 = Object.keys(datosTabla3[listaUsuarios[0]]);
                            }
                            console.log(headers3);
                        } else {
                            headers3 = {};
                        }

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
                                if (datosTabla3 != undefined) {
                                    miTabla3 = miTabla3 + '<td>' + datosTabla3[listaUsuarios[x]][headers3[y]] + '</td>';
                                }
                            }

                            miTabla3 = miTabla3 + '</tr>';
                        }
                        miTabla3 = miTabla3 + '</table>';
                        miTabla3 += '<br><br><br><br>'

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

                        laTablaGral += $('.tabla_' + contador).html();
                        $('.tabla_' + contador).empty();

                        if (contador >= cuantasSesiones) {
                            // console.log('laTablaGral', laTablaGral);
                            $('.tabla_gral').append(laTablaGral);
                            window.open('data:application/vnd.ms-excel;charset=utf-8,' + $('.tabla_gral').html());
                            $('.tabla_gral').empty();
                            return;
                        }
                    }
                })
            }
        }
    }




    if (cualCurso == 2) {

        var laUrlSesiones = "" + laUrlBase + "/Contenidos/Curso2/.json?auth=" + secret + "";
        console.log('laUrlSesiones', laUrlSesiones);
        var laTablaGral = '';
        var data;

        $.ajax({
            'url': laUrlSesiones,
            'dataType': "json",
            'success': function(data) {
                // console.log('data', data);

                $('.tabla_gral').empty();

                //-------------------------------------------------------------------
                //				Generamos el codigo de la tabla
                //-------------------------------------------------------------------
                //table-header
                var tabla = '<table>' +
                    '<tr>' +
                    '<th colspan="2">' + data['Nombre'] + '</th>' +
                    '</tr>' +
                    '<tr>' +
                    '<th> Participante </th>' +
                    '<th> Completado </th>' +
                    '</tr>';
                //tabla-body
                for (var x = 0; x < Object.keys(data['participantes']).length; x++) {
                    tabla = tabla +
                        '<tr>' +
                        '<td>' + Object.keys(data['participantes'])[x] + '</td>' +
                        '<td>' + data['participantes'][Object.keys(data['participantes'])[x]][
                            ['Completado']
                        ] + '</td>' +
                        '</tr>';
                }
                tabla = tabla + '</table>';
                // console.log('tabla', tabla);
                //-------------------------------------------------------------------
                //				Imprimimos la tabla
                //-------------------------------------------------------------------
                $(".tabla_gral").append(escape(tabla));

                //-------------------------------------------------------------------
                //				Generamos el excel
                //-------------------------------------------------------------------
                window.open('data:application/vnd.ms-excel;charset=utf-8,' + $('.tabla_gral').html());
                $('.tabla_gral').empty();
            }
        });
    }




    if (cualCurso == 3) {

        var laUrlSesiones = "" + laUrlBase + "/Contenidos/Curso3/.json?auth=" + secret + "";
        console.log('laUrlSesiones', laUrlSesiones);
        var laTablaGral = '';
        var data;

        $.ajax({
            'url': laUrlSesiones,
            'dataType': "json",
            'success': function(data) {
                    // console.log('data', data);

                    $('.tabla_gral').empty();
                    //-------------------------------------------------------------------
                    //				Generamos el codigo de la tabla
                    //-------------------------------------------------------------------
                    //table-header
                    var tabla = '<table>' +
                        '<tr>' +
                        '<th colspan="5">' + data['Nombre'] + '</th>' +
                        '</tr>' +
                        '<tr>' +
                        '<th> Ventas </th>' +
                        '<th> Canal </th>' +
                        '<th> Puesto </th>' +
                        '<th> Participante </th>' +
                        '<th> Completado </th>' +
                        '</tr>';

                    //-------------------------------------------------------------------
                    //				VENTAS No
                    //-------------------------------------------------------------------
                    for (var x = 0; x < Object.keys(data['Ventas']['No']['participantes']).length; x++) {
                        tabla = tabla +
                            '<tr>' +
                            '<td>No</td>' +
                            '<td>&nbsp;</td>' +
                            '<td>&nbsp;</td>' +
                            '<td>' + Object.keys(data['Ventas']['No']['participantes'])[x] + '</td>' +
                            '<td>' + data['Ventas']['No']['participantes'][ /**/ Object.keys(data['Ventas']['No']['participantes'])[x] /**/ ]['Completado'] + '</td>' +
                            '</tr>';
                    }

                    //-------------------------------------------------------------------
                    //				VENTAS Si -> Detalle
                    //-------------------------------------------------------------------
                    for (var x = 0; x < Object.keys(data['Ventas']['Si']['Canal']['Detalle']['participantes']).length; x++) {
                        tabla = tabla +
                            '<tr>' +
                            '<td>Si</td>' +
                            '<td>Detalle</td>' +
                            '<td>&nbsp;</td>' +
                            '<td>' + Object.keys(data['Ventas']['Si']['Canal']['Detalle']['participantes'])[x] + '</td>' +
                            '<td>' + data['Ventas']['Si']['Canal']['Detalle']['participantes'][ /**/ Object.keys(data['Ventas']['Si']['Canal']['Detalle']['participantes'])[x] /**/ ]['Completado'] + '</td>' +
                            '</tr>';
                    }

                    //-------------------------------------------------------------------
                    //				VENTAS Si -> Comercio -> Comercio
                    //-------------------------------------------------------------------
                    for (var x = 0; x < Object.keys(data['Ventas']['Si']['Canal']['Comercio']['Puesto']['Comercio']['participantes']).length; x++) {
                        tabla = tabla +
                            '<tr>' +
                            '<td>Si</td>' +
                            '<td>Comercio</td>' +
                            '<td>Comercio</td>' +
                            '<td>' + Object.keys(data['Ventas']['Si']['Canal']['Comercio']['Puesto']['Comercio']['participantes'])[x] + '</td>' +
                            '<td>' + data['Ventas']['Si']['Canal']['Comercio']['Puesto']['Comercio']['participantes'][ /**/ Object.keys(data['Ventas']['Si']['Canal']['Comercio']['Puesto']['Comercio']['participantes'])[x] /**/ ]['Completado'] + '</td>' +
                            '</tr>';
                    }

                    //-------------------------------------------------------------------
                    //				VENTAS Si -> Comercio -> Lider
                    //-------------------------------------------------------------------
                    for (var x = 0; x < Object.keys(data['Ventas']['Si']['Canal']['Comercio']['Puesto']['Lider']['participantes']).length; x++) {
                        tabla = tabla +
                            '<tr>' +
                            '<td>Si</td>' +
                            '<td>Comercio</td>' +
                            '<td>Lider</td>' +
                            '<td>' + Object.keys(data['Ventas']['Si']['Canal']['Comercio']['Puesto']['Lider']['participantes'])[x] + '</td>' +
                            '<td>' + data['Ventas']['Si']['Canal']['Comercio']['Puesto']['Lider']['participantes'][ /**/ Object.keys(data['Ventas']['Si']['Canal']['Comercio']['Puesto']['Lider']['participantes'])[x] /**/ ]['Completado'] + '</td>' +
                            '</tr>';
                    }

                    //-------------------------------------------------------------------
                    //				VENTAS Si -> Comercio -> Promoventas
                    //-------------------------------------------------------------------
                    for (var x = 0; x < Object.keys(data['Ventas']['Si']['Canal']['Comercio']['Puesto']['Promoventas']['participantes']).length; x++) {
                        tabla = tabla +
                            '<tr>' +
                            '<td>Si</td>' +
                            '<td>Comercio</td>' +
                            '<td>Promoventas</td>' +
                            '<td>' + Object.keys(data['Ventas']['Si']['Canal']['Comercio']['Puesto']['Promoventas']['participantes'])[x] + '</td>' +
                            '<td>' + data['Ventas']['Si']['Canal']['Comercio']['Puesto']['Promoventas']['participantes'][ /**/ Object.keys(data['Ventas']['Si']['Canal']['Comercio']['Puesto']['Promoventas']['participantes'])[x] /**/ ]['Completado'] + '</td>' +
                            '</tr>';
                    }
                    tabla = tabla + '</table>';

                    //-------------------------------------------------------------------
                    //				Imprimimos la tabla
                    //-------------------------------------------------------------------
                    $(".tabla_gral").append(escape(tabla));

                    //-------------------------------------------------------------------
                    //				Generamos el excel
                    //-------------------------------------------------------------------
                    window.open('data:application/vnd.ms-excel;charset=utf-8,' + $('.tabla_gral').html());
                    $('.tabla_gral').empty();

                } //termina success

        });
    }




    if (cualCurso == 4) {

        var laUrlSesiones = "" + laUrlBase + "/Contenidos/Curso4/.json?auth=" + secret + "";
        console.log('laUrlSesiones', laUrlSesiones);
        var laTablaGral = '';
        var data;

        $.ajax({
            'url': laUrlSesiones,
            'dataType': "json",
            'success': function(data) {
                console.log('data', data);

                $('.tabla_gral').empty();

                //-------------------------------------------------------------------
                //				Generamos el codigo de la tabla
                //-------------------------------------------------------------------
                //table-header
                var tabla = '<table>' +
                    '<tr>' +
                    '<th colspan="3">' + data['Nombre'] + '</th>' +
                    '</tr>' +
                    '<tr>' +
                    '<th> Ventas </th>' +
                    '<th> Participante </th>' +
                    '<th> Complatado </th>' +
                    '</tr>';
                //tabla-body
                //-------------------------------------------------------------------
                //				VENTAS No
                //-------------------------------------------------------------------
                for (var x = 0; x < Object.keys(data['Ventas']['No']['participantes']).length; x++) {
                    tabla = tabla +
                        '<tr>' +
                        '<td>No</td>' +
                        '<td>' + Object.keys(data['Ventas']['No']['participantes'])[x] + '</td>' +
                        '<td>' + data['Ventas']['No']['participantes'][ /**/ Object.keys(data['Ventas']['No']['participantes'])[x] /**/ ]['Completado'] + '</td>' +
                        '</tr>';
                }

                //-------------------------------------------------------------------
                //				VENTAS No
                //-------------------------------------------------------------------
                for (var x = 0; x < Object.keys(data['Ventas']['Si']['participantes']).length; x++) {
                    tabla = tabla +
                        '<tr>' +
                        '<td>Si</td>' +
                        '<td>' + Object.keys(data['Ventas']['Si']['participantes'])[x] + '</td>' +
                        '<td>' + data['Ventas']['Si']['participantes'][ /**/ Object.keys(data['Ventas']['Si']['participantes'])[x] /**/ ]['Completado'] + '</td>' +
                        '</tr>';
                }

                tabla = tabla + '</table>';

                //-------------------------------------------------------------------
                //				Imprimimos la tabla
                //-------------------------------------------------------------------
                $(".tabla_gral").append(escape(tabla));

                //-------------------------------------------------------------------
                //				Generamos el excel
                //-------------------------------------------------------------------
                window.open('data:application/vnd.ms-excel;charset=utf-8,' + $('.tabla_gral').html());
                $('.tabla_gral').empty();
            }
        });


    }




}
