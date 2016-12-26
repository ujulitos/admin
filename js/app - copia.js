/* Panel Admin uJL 2016 */

var config = {
    apiKey: "AIzaSyB57W-ODtcRTEOhX2FB5QY4_jBtBK6cQ2s",
    authDomain: "lala-induccion-68d87.firebaseapp.com",
    databaseURL: "https://lala-induccion-68d87.firebaseio.com",
    storageBucket: "lala-induccion-68d87.appspot.com",
    // apiKey: "AIzaSyDqVvj_ib6_ilNKcmf7iowvMtlyXFEOfqE",
    // authDomain: "prueba-de-base.firebaseapp.com",
    // databaseURL: "https://prueba-de-base.firebaseio.com",
    // storageBucket: "prueba-de-base.appspot.com",
    // messagingSenderId: "582189820696"
};
// var secret = '12X3kQJpBvq2rXHeY0Djt5amShmhquj2bDmMvH51';
var secret = 'BUQmADBESAvuCGAgB8GUB0kmpMjh7xrkCfOjzNVc';
// var laUrlBase = "https://prueba-de-base.firebaseio.com";
var laUrlBase = "https://lala-induccion-68d87.firebaseio.com";

firebase.initializeApp(config);






var mensajeConexion = 'Revisando conexión...';
var mensajeError = 'Por favor ingresa datos válidos.';
var mensajeErrorLogin = 'Por favor ingresa datos válidos.'

var elNoColaborad;
var elIdUsuario;
var laSesion;
var elPerfil;
var elPerfilNombre;
var cuantosCursos;
var elCurso;
var elCursoLanzado = false;
var cuantasSesiones;
var cuantasSesionesFecha;
var cuantasSesionesSede;
var cuantosUsuarios;
var contadorSesionesFecha = 0;
var contadorSesionesSede = 0;
var sesionKey;
var usuarioKey;
var contadorKey = 0;
var that;
var connected = false;
var nuevoUsuarioData = {};
var laFecha;
var laFechaInicial;
var laFechaFinal;
var laFechaFormateada;

var elKey = ' ';
var elKeyAnterior = [];
var elKeyNumero = 1;
var paginaActual = 1;
var resPorPagina;
var cuantosResultados;
var deCual;
var aCual;
var buscando = false;
var elArchivo;



var revisaConexion = function() {

    var connectedRef = firebase.database().ref(".info/connected");
    connectedRef.on("value", function(snap) {
        connected = false;
        $('#divBloqConexion').show();
        if (snap.val() === true) {
            connected = true;
            console.log("connected", connected);
            $('#divBloqConexion').hide();
            return connected;
        }
    });
}







function login(cualUsuario, cualPassword) {
    // console.log(cualUsuario, ' y ', cualPassword);

    $('#botonEntrar').addClass('disabled');
    var baseOk = firebase.auth().signInWithEmailAndPassword(cualUsuario, cualPassword).then(function(result) {

            var user = firebase.auth().currentUser;
            var name, email, uid, perfil;

            if (user != null) {

                // user.updateProfile({
                //     displayName: "Participante"
                // }).then(function() {
                //     // Update successful.
                // }, function(error) {
                //     // An error happened.
                // });

                elPerfilNombre = user.displayName;
                console.log("elPerfilNombre", elPerfilNombre);
                elPerfil = user.displayName;
                console.log("elPerfil", elPerfil);

                if (elPerfil === "SuperAdmin") {
                    ingresa(null);
                }
                if (elPerfil === "Administrador") {
                    ingresa(null);
                }
                if (elPerfil === "Instructor") {
                    ingresa(null);
                }
                if (elPerfil === "Participante") {

                    var dialog = document.querySelector('.dialogoLoginParticipante');
                    if (!dialog.showModal) {
                        dialogPolyfill.registerDialog(dialog);
                    }
                    dialog.showModal();

                    // $('#botonAceptarLoginParticipante').click(function() {
                    $(document).off('click', '#botonAceptarLoginParticipante').on('click', '#botonAceptarLoginParticipante', function(e) {
                        var cualColaborador = $("#nvo_no_colaborador").val();
                        if (cualColaborador != '') {
                            ingresa(cualColaborador);
                            dialog.close();
                        }
                    });
                    // $('#botonCancelarLoginParticipante').click(function() {
                    $(document).off('click', '#botonCancelarLoginParticipante').on('click', '#botonCancelarLoginParticipante', function(e) {
                        dialog.close();
                    });

                }

            }

        },
        function(error) {
            $('.mensaje_error_login').text(mensajeErrorLogin);
            $('#botonEntrar').removeClass('disabled');
        });

}

function ingresa(cualColaborador) {
    console.log('cualColaborador', cualColaborador);

    if (cualColaborador != null) {
        elNoColaborad = cualColaborador;
        console.log('elNoColaborad', elNoColaborad);

        if (revisaConexion) {
            firebase.database().ref('Usuarios').orderByChild('NoColaborad').equalTo(elNoColaborad).once('value').then(function(snapshot) {
                if (snapshot.val() != null) {

                    snapshot.forEach(function(childSnapshot) {
                        var elNombreRes = snapshot.child(childSnapshot.key).child('Nombre').val();
                        var elNoColaboradRes = snapshot.child(childSnapshot.key).child('NoColaborad').val();
                        elPerfilNombre = elNombreRes;
                        ingresaOK();
                    });
                } else {
                    console.log('no se encuentra usuario');
                }
            });
        }
    } else {
        ingresaOK();
    }

    function ingresaOK() {
        $('.login').hide();
        $('.contenido_gral').addClass('mdl-layout--fixed-drawer');
        $('.header').show();
        $('.header_buscar').css({
            'left': '200px'
        });
        $('.mdl-layout__drawer-button').show();
        $('#botonCerrar').show();

        $('.mensaje_error_login').text('');
        $('.contenido').show();
        $('.nombre_perfil').text(elPerfilNombre);

        navega();
    }

}


function cierraSesion() {

    firebase.auth().signOut().then(function() {
        $('.login').show();
        $('.contenido_gral').removeClass('mdl-layout--fixed-drawer');
        $('.header').hide();
        $('.mdl-layout__drawer-button').hide();
        $('#botonCerrar').hide();
        $("#botonEntrar").removeClass('disabled');

        $('.contenido').hide();
    }, function(error) {

    });

}









function pintaInicio() {

    // function pintaChart(cualChart, valor, duracion, colorBarra) {
    //     $('#chart' + cualChart).easyPieChart({
    //         size: 150,
    //         animate: duracion,
    //         lineWidth: 20,
    //         barColor: colorBarra,
    //         trackColor: '#e7e7e7 ',
    //         lineCap: 'butt',
    //         onStep: function(from, to, currentValue) {
    //             $('#porciento' + cualChart).text(~~currentValue + '%');
    //         }
    //     });
    //
    //     if ($('.inicio_int').length != 0) {
    //         $('#chart' + cualChart).data('easyPieChart').update(valor);
    //     }
    // };
    //
    //
    //
    // pintaChart(1, 85, 2000, '#ff5722');
    // setTimeout(function() {
    //     pintaChart(1, 38, 3000);
    // }, 5000);
    //
    // pintaChart(2, 41, 2000, '#8bc34a');
    // setTimeout(function() {
    //     pintaChart(2, 76, 2000);
    // }, 6000);
    //
    // pintaChart(3, 27, 2000, '#ff9800');
    // setTimeout(function() {
    //     pintaChart(3, 98, 1500);
    // }, 5500);
    //
    // pintaChart(4, 79, 2000, '#2196f3');
    // setTimeout(function() {
    //     pintaChart(4, 12, 3000);
    // }, 6500);


}






function cuentaCursos() {
    console.log('cuentaCursos');

    if (revisaConexion) {
        firebase.database().ref('Contenidos').once('value').then(function(snapshot) {
            if (snapshot.val() != null) {
                contadorCursos = 0;
                cuantosCursos = snapshot.numChildren();
                console.log('cuantosCursos', cuantosCursos);

                snapshot.forEach(function(childSnapshot) {
                    contadorCursos++;

                    this['CursoId' + contadorCursos] = childSnapshot.key;
                    // console.log('CursoId' + contadorCursos + ': ', this['CursoId' + contadorCursos]);
                    this['cursoNombre' + contadorCursos] = snapshot.child(childSnapshot.key).child('Nombre').val();
                    // console.log('Curso ' + contadorCursos + ': ', this['cursoNombre' + contadorCursos]);
                    this['cursoDesc' + contadorCursos] = snapshot.child(childSnapshot.key).child('Descripcion').val();
                    // console.log('Descripcion del Curso: ', this['cursoDesc' + contadorCursos]);
                    this['cursoLiga' + contadorCursos] = snapshot.child(childSnapshot.key).child('Liga').val();
                    // console.log('Liga del Curso: ', this['cursoLiga' + contadorCursos]);
                    this['cursoActivo' + contadorCursos] = snapshot.child(childSnapshot.key).child('Activo').val();
                    // console.log('Descripcion del Curso: ', this['cursoDesc' + contadorCursos]);
                    that = this;

                    cuantosCursos = contadorCursos;
                    pintaCursos();
                });

                return;
            }
        });
    }
}

function pintaCursos() {

    var contenidoSecCursos = '';
    $('.cursos_int').empty();


    for (a = 1; a <= cuantosCursos; a++) {

        contenidoSecCursos += '<div class="mdl-grid">';
        contenidoSecCursos += '<div class="mdl-layout-spacer"></div>';

        contenidoSecCursos += '<div id="tarjeta' + a + '" class="mdl-cell--8-col mdl-card mdl-shadow--3dp">';
        contenidoSecCursos += '<div id="curso_titulo' + a + '" class="curso_titulo" style="background: rgba(0, 0, 0, 0) url(images/curso' + a + '.jpg) no-repeat top center / cover;">';
        contenidoSecCursos += '<div class="mdl-card__title-text curso_titulo_texto"></div>';
        contenidoSecCursos += '</div>';

        contenidoSecCursos += '<div class="mdl-card__supporting-text">';
        contenidoSecCursos += '<h1 class="mdl-card__title-text">' + this['cursoNombre' + a] + '</h1>';
        contenidoSecCursos += '<br>' + this['cursoDesc' + a] + '</div>';
        contenidoSecCursos += '<div class="mdl-card__actions mdl-card--border">';
        contenidoSecCursos += '<div id="botonIniciarCurso' + a + '" class="botonCard mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-color--red-A100 ripplelink">Iniciar</div>';
        contenidoSecCursos += '</div>';
        contenidoSecCursos += '</div>';

        contenidoSecCursos += '<div class="mdl-layout-spacer"></div>';
        contenidoSecCursos += '</div>  ';

        contenidoSecCursos += '<br>';

    }
    $('.cursos_int').append(contenidoSecCursos);

    hazRipple();
    activaLanzarCursos();

}







function buscaUsuario(cualUsuario) {

    if (cualUsuario.length > 0) {
        buscando = true;

        var valBuscar1 = 'Nombre';
        var valBuscar2 = 'NoColaborad';

        if (revisaConexion) {
            firebase.database().ref('Usuarios').orderByChild(valBuscar2).equalTo(cualUsuario).once('value').then(function(snapshot) {

                if (snapshot.val() != null) {

                    console.log('snapshot.val()', snapshot.val());
                    cuantosResultados = 1;

                    snapshot.forEach(function(childSnapshot) {

                        // cuantosResultados++;

                        this['usuarioKey' + cuantosResultados] = childSnapshot.key;
                        console.log('usuarioKey' + cuantosResultados + ': ', this['usuarioKey' + cuantosResultados]);

                        this['usuarioNoColaborad' + cuantosResultados] = snapshot.child(childSnapshot.key).child('NoColaborad').val();
                        this['usuarioNombre' + cuantosResultados] = snapshot.child(childSnapshot.key).child('Nombre').val();

                        this['usuarioAP' + cuantosResultados] = snapshot.child(childSnapshot.key).child('AP').val();
                        console.log('usuarioAP' + cuantosResultados + ': ', this['usuarioAP' + cuantosResultados]);
                        this['usuarioAP_Desc' + cuantosResultados] = snapshot.child(childSnapshot.key).child('AP_Desc').val();
                        // console.log('usuarioAP_Desc: ', this['usuarioAP_Desc' + cuantosResultados]);
                        this['usuarioCURP' + cuantosResultados] = snapshot.child(childSnapshot.key).child('CURP').val();
                        // console.log('usuarioCURP: ', this['usuarioCURP' + cuantosResultados]);
                        this['usuarioCentroCoste_DESC' + cuantosResultados] = snapshot.child(childSnapshot.key).child('CentroCoste_DESC').val();
                        // console.log('usuarioCentroCoste_DESC: ', this['usuarioCentroCoste_DESC' + cuantosResultados]);
                        this['usuarioDivision_de_personal' + cuantosResultados] = snapshot.child(childSnapshot.key).child('Division_de_personal').val();
                        // console.log('usuarioDivision_de_personal: ', this['usuarioDivision_de_personal' + cuantosResultados]);
                        this['usuarioFechaIngreso' + cuantosResultados] = snapshot.child(childSnapshot.key).child('FechaIngreso').val();
                        // console.log('usuarioFechaIngreso: ', this['usuarioFechaIngreso' + cuantosResultados]);
                        this['usuarioFecha_Nac' + cuantosResultados] = snapshot.child(childSnapshot.key).child('Fecha_Nac').val();
                        // console.log('usuarioFecha_Nac: ', this['usuarioFecha_Nac' + cuantosResultados]);
                        this['usuarioIdDivsion' + cuantosResultados] = snapshot.child(childSnapshot.key).child('IdDivsion').val();
                        // console.log('usuarioIdDivsion: ', this['usuarioIdDivsion' + cuantosResultados]);
                        this['usuarioIdSoc' + cuantosResultados] = snapshot.child(childSnapshot.key).child('IdSoc').val();
                        // console.log('usuarioIdSoc: ', this['usuarioIdSoc' + cuantosResultados]);
                        this['usuarioIdSubDivision' + cuantosResultados] = snapshot.child(childSnapshot.key).child('IdSubDivision').val();
                        // console.log('usuarioIdSubDivision: ', this['usuarioIdSubDivision' + cuantosResultados]);
                        this['usuarioN_Sexo' + cuantosResultados] = snapshot.child(childSnapshot.key).child('N_Sexo').val();
                        // console.log('usuarioN_Sexo: ', this['usuarioN_Sexo' + cuantosResultados]);
                        this['usuarioNoColaborad' + cuantosResultados] = snapshot.child(childSnapshot.key).child('NoColaborad').val();
                        // console.log('usuarioNoColaborad: ', this['usuarioNoColaborad' + cuantosResultados]);
                        this['usuarioNo_de_Nomina' + cuantosResultados] = snapshot.child(childSnapshot.key).child('No_de_Nomina').val();
                        // console.log('usuarioNo_de_Nomina: ', this['usuarioNo_de_Nomina' + cuantosResultados]);
                        this['usuarioNombre' + cuantosResultados] = snapshot.child(childSnapshot.key).child('Nombre').val();
                        // console.log('usuarioNombre: ', this['usuarioNombre' + cuantosResultados]);
                        this['usuarioNomina' + cuantosResultados] = snapshot.child(childSnapshot.key).child('Nomina').val();
                        // console.log('usuarioNomina: ', this['usuarioNomina' + cuantosResultados]);
                        this['usuarioPosicion' + cuantosResultados] = snapshot.child(childSnapshot.key).child('Posicion').val();
                        // console.log('usuarioPosicion: ', this['usuarioPosicion' + cuantosResultados]);
                        this['usuarioRFC' + cuantosResultados] = snapshot.child(childSnapshot.key).child('RFC').val();
                        // console.log('usuarioRFC: ', this['usuarioRFC' + cuantosResultados]);
                        this['usuarioSociedad' + cuantosResultados] = snapshot.child(childSnapshot.key).child('Sociedad').val();
                        // console.log('usuarioSociedad: ', this['usuarioSociedad' + cuantosResultados]);
                        this['usuarioSubdivision_de_personal_DESC' + cuantosResultados] = snapshot.child(childSnapshot.key).child('Subdivision_de_personal_DESC').val();
                        // console.log('usuarioSubdivision_de_personal_DESC: ', this['usuarioSubdivision_de_personal_DESC' + cuantosResultados]);
                        this['usuarioZona' + cuantosResultados] = snapshot.child(childSnapshot.key).child('Zona').val();
                        // console.log('usuarioZona: ', this['usuarioZona' + cuantosResultados]);

                        that = this;

                    });
                    pintaUsuarios(cuantosResultados);

                } else {
                    pintaUsuarios(0);
                }
            });

        }
    } else {
        buscando = false;
        llenaUsuarios();
    }
    $("#botonMenosUsuarios, #botonMasUsuarios").removeClass('mdl-button--colored mdl-color--white mdl-color-text--light-green ripplelink').attr('disabled', 'disabled');


}






function cuentaUsuarios() {
    if (revisaConexion) {
        $.getJSON("" + laUrlBase + "/Usuarios.json?auth=" + secret + "&shallow=true", function(data) {
            if (data == null || data == undefined || data == '') {
                cuantosUsuarios = 0;
            } else {
                cuantosUsuarios = Object.keys(data).length;
            }
        }).done(function() {
            console.log('cuantosUsuariosss', cuantosUsuarios);
            return cuantosUsuarios;
        });

    }
}




function llenaUsuarios(paginacion) {

    var noUsuarios = setInterval(function() {
        cuentaUsuarios();
        if (cuantosUsuarios != undefined) {
            console.log('ya conte y me dieron: ', cuantosUsuarios, ' usuarios.');
            llenaUsuariosOK();
            clearInterval(noUsuarios);
        }
    }, 200);


    function llenaUsuariosOK() {


        var limiteUsuarios;

        switch (paginacion) {
            case 'menos':
                if (paginaActual > 1) {
                    paginaActual--;
                    elKeyNumero -= resPorPagina;
                } else {
                    elKeyNumero = 1;
                }
                elKey = elKeyAnterior.pop();

                break;
            case 'mas':
                if (paginaActual < (cuantosUsuarios / resPorPagina)) {
                    paginaActual++;
                    elKeyAnterior.push(this['usuarioKey' + 1]);
                    elKeyNumero += resPorPagina;
                } else {
                    elKeyNumero = cuantosUsuarios;
                }

                elKey = this['usuarioKey' + (resPorPagina + 1)];

                break;
            default:
                //TODO no regresar siempre a la paginaActual 1
                // paginaActual = 1;
                // elKey = ' ';
                // elKeyAnterior = [];
                break;
        }

        console.log('cuantosUsuarios', cuantosUsuarios);
        console.log('paginaActual', paginaActual);
        console.log('elKey', elKey);
        console.log('elKeyAnterior', elKeyAnterior);
        console.log('elKeyNumero', elKeyNumero);



        if (revisaConexion) {
            console.log('resPorPagina', resPorPagina + 1);
            firebase.database().ref('Usuarios').orderByKey().limitToFirst(resPorPagina + 1).startAt(elKey).once('value').then(function(snapshot) {

                console.log('snapshot', snapshot.val());

                if (snapshot.numChildren() == (resPorPagina + 1)) {
                    // resPorPagina = resPorPagina;
                    limiteUsuarios = resPorPagina;
                } else {
                    limiteUsuarios = snapshot.numChildren();
                }

                console.log('snapshot length', resPorPagina);
                var contador = 0;

                if (snapshot.val() != null) {

                    snapshot.forEach(function(snapshot) {
                        contador++;

                        this['usuarioKey' + contador] = snapshot.key;
                        console.log('usuarioKey' + contador + ': ', this['usuarioKey' + contador]);

                        this['usuarioAP' + contador] = snapshot.child('AP').val();
                        console.log('usuarioAP' + contador + ': ', this['usuarioAP' + contador]);
                        this['usuarioAP_Desc' + contador] = snapshot.child('AP_Desc').val();
                        // console.log('usuarioAP_Desc: ', this['usuarioAP_Desc' + contador]);
                        this['usuarioCURP' + contador] = snapshot.child('CURP').val();
                        // console.log('usuarioCURP: ', this['usuarioCURP' + contador]);
                        this['usuarioCentroCoste_DESC' + contador] = snapshot.child('CentroCoste_DESC').val();
                        // console.log('usuarioCentroCoste_DESC: ', this['usuarioCentroCoste_DESC' + contador]);
                        this['usuarioDivision_de_personal' + contador] = snapshot.child('Division_de_personal').val();
                        // console.log('usuarioDivision_de_personal: ', this['usuarioDivision_de_personal' + contador]);
                        this['usuarioFechaIngreso' + contador] = snapshot.child('FechaIngreso').val();
                        // console.log('usuarioFechaIngreso: ', this['usuarioFechaIngreso' + contador]);
                        this['usuarioFecha_Nac' + contador] = snapshot.child('Fecha_Nac').val();
                        // console.log('usuarioFecha_Nac: ', this['usuarioFecha_Nac' + contador]);
                        this['usuarioIdDivsion' + contador] = snapshot.child('IdDivsion').val();
                        // console.log('usuarioIdDivsion: ', this['usuarioIdDivsion' + contador]);
                        this['usuarioIdSoc' + contador] = snapshot.child('IdSoc').val();
                        // console.log('usuarioIdSoc: ', this['usuarioIdSoc' + contador]);
                        this['usuarioIdSubDivision' + contador] = snapshot.child('IdSubDivision').val();
                        // console.log('usuarioIdSubDivision: ', this['usuarioIdSubDivision' + contador]);
                        this['usuarioN_Sexo' + contador] = snapshot.child('N_Sexo').val();
                        // console.log('usuarioN_Sexo: ', this['usuarioN_Sexo' + contador]);
                        this['usuarioNoColaborad' + contador] = snapshot.child('NoColaborad').val();
                        // console.log('usuarioNoColaborad: ', this['usuarioNoColaborad' + contador]);
                        this['usuarioNo_de_Nomina' + contador] = snapshot.child('No_de_Nomina').val();
                        // console.log('usuarioNo_de_Nomina: ', this['usuarioNo_de_Nomina' + contador]);
                        this['usuarioNombre' + contador] = snapshot.child('Nombre').val();
                        // console.log('usuarioNombre: ', this['usuarioNombre' + contador]);
                        this['usuarioNomina' + contador] = snapshot.child('Nomina').val();
                        // console.log('usuarioNomina: ', this['usuarioNomina' + contador]);
                        this['usuarioPosicion' + contador] = snapshot.child('Posicion').val();
                        // console.log('usuarioPosicion: ', this['usuarioPosicion' + contador]);
                        this['usuarioRFC' + contador] = snapshot.child('RFC').val();
                        // console.log('usuarioRFC: ', this['usuarioRFC' + contador]);
                        this['usuarioSociedad' + contador] = snapshot.child('Sociedad').val();
                        // console.log('usuarioSociedad: ', this['usuarioSociedad' + contador]);
                        this['usuarioSubdivision_de_personal_DESC' + contador] = snapshot.child('Subdivision_de_personal_DESC').val();
                        // console.log('usuarioSubdivision_de_personal_DESC: ', this['usuarioSubdivision_de_personal_DESC' + contador]);
                        this['usuarioZona' + contador] = snapshot.child('Zona').val();
                        // console.log('usuarioZona: ', this['usuarioZona' + contador]);

                        that = this;

                    });
                }

                deCual = elKeyNumero;
                aCual = deCual + (limiteUsuarios - 1);

                pintaUsuarios(limiteUsuarios);
            });
        }
    }
    return true;
}





function pintaUsuarios(res) {
    console.log('pintando usuarios', res);

    // if (cuentaUsuarios() == true) {

    var contenidoSecUsuarios = '';
    $('.usuarios_int').empty();
    $('#paginadoUsuarios').html('');
    $("#botonMenosUsuarios").removeClass('mdl-button--colored mdl-color--white mdl-color-text--light-green ripplelink').attr('disabled', 'disabled');
    $("#botonMasUsuarios").removeClass('mdl-button--colored mdl-color--white mdl-color-text--light-green ripplelink').attr('disabled', 'disabled');

    if (res <= 0 || res == undefined || res == null) {
        $('.usuarios_int').append('<tr> <td class="mdl-data-table__cell--non-numeric">No existen usuarios</td> <td></td><td></td></tr>');
    } else {



        for (a = 1; a <= res; a++) {

            contenidoSecUsuarios += '<tr>';
            contenidoSecUsuarios += '<td class="mdl-data-table__cell--non-numeric">' + that['usuarioNoColaborad' + a] + '</td>';
            contenidoSecUsuarios += '<td class="mdl-data-table__cell--non-numeric">' + that['usuarioNombre' + a] + '</td>';
            contenidoSecUsuarios += '<td>';

            contenidoSecUsuarios += '<div id="botonModificarUsuario' + a + '" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored mdl-color-text--blue-grey-600 ripplelink" style="margin-right:10%;"><i class="material-icons">mode_edit</i></div>';

            if (elPerfil === "Administrador" || elPerfil === "SuperAdmin") {
                contenidoSecUsuarios += '<div id="botonBorrarUsuario' + a + '" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored mdl-color-text--red-A200 ripplelink" style="margin-right:10%;"><i class="material-icons">delete</i></div>';
            }

            contenidoSecUsuarios += '</td>';
            contenidoSecUsuarios += '</tr>';

        }

        $('.usuarios_int').append(contenidoSecUsuarios);

        if (!buscando) {
            $('#paginadoUsuarios').html('Mostrando del <b>' + deCual + '</b> al <b>' + aCual + '</b> de <b>' + cuantosUsuarios + '</b> usuarios.');

            if (paginaActual > 1 && cuantosUsuarios > 0) {
                $("#botonMenosUsuarios").addClass('mdl-button--colored mdl-color--white mdl-color-text--light-green ripplelink').removeAttr('disabled', 'disabled');
            } else {
                $("#botonMenosUsuarios").removeClass('mdl-button--colored mdl-color--white mdl-color-text--light-green ripplelink').attr('disabled', 'disabled');
            }
            if (aCual >= cuantosUsuarios || cuantosUsuarios <= 0) {
                $("#botonMasUsuarios").removeClass('mdl-button--colored mdl-color--white mdl-color-text--light-green ripplelink').attr('disabled', 'disabled');
            } else {
                $("#botonMasUsuarios").addClass('mdl-button--colored mdl-color--white mdl-color-text--light-green ripplelink').removeAttr('disabled', 'disabled');
            }
        }

        hazRipple();
        activaBotonesUsuarios();

    }
    // }
}





function agregaUsuario(usuNoColabNvo, usuNombreNvo, usuRFCNvo, usuCURPNvo, usuFecNacNvo, usuFecIngNvo, usuPosNvo, usuAPNvo, usuAPDescNvo, usuDivPNvo, usuCCosteDescNvo, usuIdSocNvo, usuIdDivNvo, usuIdSubDivNvo, usuSubDivDescNvo, usuNSexoNvo, usuNoNominaNvo, usuNominaNvo, usuSocNvo, usuZonaNvo) {

    var onComplete = function(error) {
        if (error) {
            console.log('Ocurrió un error en la sincronización.');
        } else {
            llenaUsuarios();
            console.log('Sincronización realizada.');
        }
    };

    if (revisaConexion) {

        var nuevoUsuarioData = {
            'AP': usuAPNvo,
            'AP_Desc': usuAPDescNvo,
            'CURP': usuCURPNvo,
            'CentroCoste_DESC': usuCCosteDescNvo,
            'Division_de_personal': usuDivPNvo,
            'FechaIngreso': usuFecIngNvo,
            'Fecha_Nac': usuFecNacNvo,
            'IdDivsion': usuIdDivNvo,
            'IdSoc': usuIdSocNvo,
            'IdSubDivision': usuIdSubDivNvo,
            'N_Sexo': usuNSexoNvo,
            'NoColaborad': usuNoColabNvo,
            'No_de_Nomina': usuNoNominaNvo,
            'Nombre': usuNombreNvo,
            'Nomina': usuNominaNvo,
            'Posicion': usuPosNvo,
            'RFC': usuRFCNvo,
            'Sociedad': usuSocNvo,
            'Subdivision_de_personal_DESC': usuSubDivDescNvo,
            'Zona': usuZonaNvo
        };

        var updates = {};
        updates['Usuarios/usuario_' + usuNoColabNvo + '/'] = nuevoUsuarioData;
        firebase.database().ref().update(updates, onComplete);

        $(".mensaje_error_nvo_usuario").text('');

    }
}




function modificarUsuario(cualUsuario, usuNombreAct, usuRFCAct, usuCURPAct, usuFecNacAct, usuFecIngAct, usuPosAct, usuAPAct, usuAPDescAct, usuDivPAct, usuCCosteDescAct, usuIdSocAct, usuIdDivAct, usuIdSubDivAct, usuSubDivDescAct, usuNSexoAct, usuNoNominaAct, usuNominaAct, usuSocAct, usuZonaAct) {
    console.log('modificando: ', cualUsuario, ' ', usuNombreAct);


    var elRefUsuario;

    if (revisaConexion) {

        elRefUsuario = 'Usuarios/' + that['usuarioKey' + cualUsuario];
        console.log('getKey: ', firebase.database().ref(elRefUsuario).getKey());

        firebase.database().ref(elRefUsuario).once('value').then(function(snapshot) {
            if (snapshot.val() != null) {

                noColaborador = snapshot.child('NoColaborad').val();
                console.log('noColaborador', noColaborador);


                var nuevoUsuarioData = {
                    'AP': usuAPAct,
                    'AP_Desc': usuAPDescAct,
                    'CURP': usuCURPAct,
                    'CentroCoste_DESC': usuCCosteDescAct,
                    'Division_de_personal': usuDivPAct,
                    'FechaIngreso': usuFecIngAct,
                    'Fecha_Nac': usuFecNacAct,
                    'IdDivsion': usuIdDivAct,
                    'IdSoc': usuIdSocAct,
                    'IdSubDivision': usuIdSubDivAct,
                    'N_Sexo': usuNSexoAct,
                    'NoColaborad': noColaborador,
                    'No_de_Nomina': usuNoNominaAct,
                    'Nombre': usuNombreAct,
                    'Nomina': usuNominaAct,
                    'Posicion': usuPosAct,
                    'RFC': usuRFCAct,
                    'Sociedad': usuSocAct,
                    'Subdivision_de_personal_DESC': usuSubDivDescAct,
                    'Zona': usuZonaAct
                };

                var updates = {};
                updates['Usuarios/usuario_' + noColaborador + '/'] = nuevoUsuarioData;
                firebase.database().ref().update(updates, onComplete);

                // if (noColabModificado != noColaboradorAnt) {
                //     firebase.database().ref().child('Usuarios/' + that['usuarioKey' + cualUsuario]).remove();
                // }

            }
        });

        var onComplete = function(error) {
            if (error) {
                console.log('Ocurrió un error en la sincronización.');
            } else {
                if (buscando) {
                    buscaUsuario($("#busqueda_usuario").val());
                } else {
                    llenaUsuarios();
                }
                console.log('Sincronización realizada.');
            }
        };

    }
}


function borrarUsuario(cualUsuario) {
    console.log('cualUsuario', cualUsuario);

    if (revisaConexion) {
        firebase.database().ref('Usuarios').once('value').then(function(snapshot) {
            if (snapshot.val() != null) {
                var itemaRemover = that['usuarioKey' + cualUsuario];
                console.log('itemaRemover', itemaRemover);
                firebase.database().ref().child('Usuarios/' + itemaRemover).remove();

                $("#busqueda_usuario").val('');
                setTimeout(llenaUsuarios, 400);
                return;
            }
        });
    }
}




function llenaSesiones() {

    if (revisaConexion) {
        firebase.database().ref('Sesiones').once('value').then(function(snapshot) {
            if (snapshot.val() != null) {
                contadorSesionesFecha = 0;
                contadorSesionesSede = 0;
                cuantasSesionesFecha = snapshot.numChildren();

                console.log('cuantasSesionesFecha', cuantasSesionesFecha);

                snapshot.forEach(function(childSnapshot) {
                    contadorSesionesFecha++;
                    this['cuantasSesionesSede' + contadorSesionesFecha] = snapshot.child(childSnapshot.key).numChildren();
                    console.log('cuantasSesionesSede' + contadorSesionesFecha, this['cuantasSesionesSede' + contadorSesionesFecha]);

                    childSnapshot.forEach(function(grandChildSnapshot) {
                        contadorSesionesSede++;

                        this['sesionFecha' + contadorSesionesSede] = snapshot.child(childSnapshot.key).key;
                        console.log('sesionFecha' + contadorSesionesSede + ': ', this['sesionFecha' + contadorSesionesSede]);

                        this['sesionKey' + contadorSesionesSede] = childSnapshot.child(grandChildSnapshot.key).key;
                        console.log('sesionKey' + contadorSesionesSede + ': ', this['sesionKey' + contadorSesionesSede]);

                        this['sesionNombre' + contadorSesionesSede] = childSnapshot.child(grandChildSnapshot.key).child('Nombre_del_evento').val();
                        console.log('sesionNombre' + contadorSesionesSede + ': ', this['sesionNombre' + contadorSesionesSede]);

                        this['sesionZona' + contadorSesionesSede] = childSnapshot.child(grandChildSnapshot.key).child('Zona').val();
                        console.log('sesionZona' + contadorSesionesSede + ': ', this['sesionZona' + contadorSesionesSede]);

                        this['sesionSede' + contadorSesionesSede] = childSnapshot.child(grandChildSnapshot.key).child('Sede').val();
                        console.log('sesionSede' + contadorSesionesSede + ': ', this['sesionSede' + contadorSesionesSede]);

                        that = this;

                    });
                    cuantasSesiones = contadorSesionesSede;
                });

                pintaSesiones(1);
                return true;
            }

        });
    }
}



function pintaSesiones(res) {
    console.log('pintando sesiones', cuantasSesiones);

    // var contenidoSecSesiones = '';
    $('.sesiones_int').empty();


    var dataSet1 = [
        ["Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011/04/25", "$320,800"],
        ["Garrett Winters", "Accountant", "Tokyo", "8422", "2011/07/25", "$170,750"],
        ["Unity Butler", "Marketing Designer", "San Francisco", "5384", "2009/12/09", "$85,675"]
    ];

    var dataSet = [];




    if (res <= 0 || res == undefined || res == null) {
        $('.sesiones_int').append('<tr> <td class="mdl-data-table__cell--non-numeric">No existen sesiones</td> <td></td><td></td></tr>');
    } else {

        if (cuantasSesiones <= 0 || cuantasSesiones == undefined || cuantasSesiones == null) {
            $('.sesiones_int').append('<tr> <td class="mdl-data-table__cell--non-numeric">No existen sesiones</td> <td></td><td></td><td></td></tr>');
        } else {

            for (a = 1; a <= cuantasSesiones; a++) {


                dataSet[(a - 1)] = [that['sesionFecha' + a], that['sesionZona' + a], that['sesionSede' + a], '<div id="botonReporteSesion' + a + '" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored mdl-color-text--blue-grey-600 ripplelink" style="margin-right:10%;"><i class="material-icons">insert_chart</i></div>'];


                // contenidoSecSesiones += '<tr>';
                // contenidoSecSesiones += '<td class="mdl-data-table__cell--non-numeric">' + this['sesionFecha' + a] + '</td>';
                // // contenidoSecSesiones += '<td class="mdl-data-table__cell--non-numeric">' + this['sesionNombre' + a] + '</td>';
                // contenidoSecSesiones += '<td class="mdl-data-table__cell--non-numeric">' + this['sesionZona' + a] + '</td>';
                // contenidoSecSesiones += '<td class="mdl-data-table__cell--non-numeric">' + this['sesionSede' + a] + '</td>';
                // contenidoSecSesiones += '<td>';
                //
                // // contenidoSecSesiones += '<div id="botonModificarSesion' + a + '" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored mdl-color-text--blue-grey-600 ripplelink" style="margin-right:10%;"><i class="material-icons">mode_edit</i></div>';
                //
                // contenidoSecSesiones += '<div id="botonReporteSesion' + a + '" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored mdl-color-text--blue-grey-600 ripplelink" style="margin-right:10%;"><i class="material-icons">insert_chart</i></div>';
                //
                // // contenidoSecSesiones += '<div id="botonBorrarSesion' + a + '" class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored mdl-color-text--red-A200 ripplelink" style="margin-right:10%;"><i class="material-icons">delete</i></div>';
                //
                // contenidoSecSesiones += '</td>';
                // contenidoSecSesiones += '</tr>';

            }

            // console.log('dataSet', dataSet);

            // contenidoSecSesiones += '</tbody>';
            // contenidoSecSesiones += '</table>';
            // contenidoSecSesiones += '</div>';

            var table = $('#tablaSesiones').DataTable({
                data: dataSet,
                "pagingType": "simple_numbers",
                "language": {
                    "url": "js/dataTable_spanish.json"
                },
                columnDefs: [{
                    "targets": [3],
                    "orderable": false
                }, {
                    "targets": [0, 1, 2],
                    className: 'mdl-data-table__cell--non-numeric'
                }]
            });
            $.fn.DataTable.ext.pager.numbers_length = 4;
            $('#tablaSesiones').on('draw.dt', function() {

                $('.dataTables_filter').hide();
                $('.dataTables_empty').css({
                    'text-align': 'left'
                });
                $('.form-control').css({
                    'padding': '5px',
                    'font-size': '15px'
                });
                hazRipple();
                activaBotonesSesiones();
            });

            $('#busqueda_sesion').on('keyup search input paste cut', function() {
                // $(document).off('keyup search input paste cut', '#busqueda_sesion').on('keyup search input paste cut', '#busqueda_sesion', function(e) {
                table.search($(this).val()).draw();
                // });
            });




            // $('.sesiones_int').append(contenidoSecSesiones);


        }
    }
}



function creaSesion(nombreNuevo, zonaNueva, sedeNueva) {

    console.log('creando sesion');

    var elRefSesionNombre;
    var elRefSesionZona;
    var elRefSesionSede;

    var onComplete = function(error) {
        if (error) {
            console.log('Ocurrió un error en la sincronización.');
        } else {
            llenaSesiones();
            console.log('Sincronización realizada.');
        }
    };

    if (revisaConexion) {
        var newPostKey = firebase.database().ref().push().key;

        var postData = {
            'Activa': false,
            'Calificacion_grupal': 0,
            'Duracion': '',
            'Fecha_fin': '',
            'Fecha_inicio': '',
            'Nombre_del_evento': nombreNuevo,
            'Sede': sedeNueva,
            'Zona': zonaNueva,
            'idEvento': 'evt' + newPostKey,
            'instructor': {
                'Activo': false,
                'Avatar': 1,
                'Calificacion': 0,
                'Completado': false,
                'MapaActivo': 0,
                'Marcador': 0,
                'NoColaborad': ''
            }

        };

        var updates = {};
        updates['Sesiones/' + newPostKey + '/'] = postData;
        firebase.database().ref().update(updates, onComplete);

    }

}




function borrarSesion(cualSesion) {
    console.log('cualSesion', cualSesion);

    if (revisaConexion) {
        firebase.database().ref('Sesiones').once('value').then(function(snapshot) {
            if (snapshot.val() != null) {
                var itemaRemover = that['sesionFecha' + cualSesion] + '/' + that['sesionKey' + cualSesion];
                console.log('itemaRemover', itemaRemover);
                firebase.database().ref().child('Sesiones/' + itemaRemover).remove(onComplete);
                return;
            }
        });
    }

    var onComplete = function(error) {
        if (error) {
            console.log('Ocurrió un error en la sincronización.');
        } else {
            setTimeout(llenaSesiones, 100);
            console.log('Sincronización realizada.');
        }
    };

}


function modificarSesion(cualSesion, nombreModificado, zonaModificada, sedeModificada) {
    console.log(cualSesion, ' ', that['sesionFecha' + cualSesion], ' ', nombreModificado, ' ', zonaModificada, ' ', sedeModificada);
    llenaSesiones();

    var elRefSesionNombre;
    var elRefSesionZona;
    var elRefSesionSede;

    if (revisaConexion) {

        elRefSesionNombre = 'Sesiones/' + that['sesionFecha' + cualSesion] + '/' + that['sesionKey' + cualSesion] + '/Nombre_del_evento';
        elRefSesionZona = 'Sesiones/' + that['sesionFecha' + cualSesion] + '/' + that['sesionKey' + cualSesion] + '/Zona';
        elRefSesionSede = 'Sesiones/' + that['sesionFecha' + cualSesion] + '/' + that['sesionKey' + cualSesion] + '/Sede';

        firebase.database().ref(elRefSesionNombre).once('value').then(function(snapshot) {
            if (snapshot.val() != null) {

                var nombreActual = snapshot.child('Nombre_del_evento').val();
                console.log('nombreActual', nombreActual);

                nuevoUsuarioData = nombreModificado;
            }

            var updates = {};
            updates[elRefSesionNombre] = nuevoUsuarioData;
            firebase.database().ref().update(updates, onComplete);
        });

        firebase.database().ref(elRefSesionZona).once('value').then(function(snapshot) {
            if (snapshot.val() != null) {

                var zonaActual = snapshot.child('Zona').val();
                console.log('zonaActual', zonaActual);

                nuevoUsuarioData = zonaModificada;
            }

            var updates = {};
            updates[elRefSesionZona] = nuevoUsuarioData;
            firebase.database().ref().update(updates);
        });

        firebase.database().ref(elRefSesionSede).once('value').then(function(snapshot) {
            if (snapshot.val() != null) {

                var sedeActual = snapshot.child('Sede').val();
                console.log('sedeActual', sedeActual);

                nuevoUsuarioData = sedeModificada;
            }

            var updates = {};
            updates[elRefSesionSede] = nuevoUsuarioData;
            firebase.database().ref().update(updates);
        });


        var onComplete = function(error) {
            if (error) {
                console.log('Ocurrió un error en la sincronización.');
            } else {
                if (buscando) {
                    buscaSesion($("#busqueda_sesion").val());
                } else {
                    llenaSesiones();
                }
                console.log('Sincronización realizada.');
            }
        };


    }

}



function buscaSesion(sesionABuscar) {
    console.log(sesionABuscar);

    if (sesionABuscar.length > 0) {
        buscando = true;

        if (revisaConexion) {
            firebase.database().ref('Sesiones').orderByKey().equalTo(sesionABuscar).once('value').then(function(snapshot) {

                if (snapshot.val() != null) {
                    contadorSesionesFecha = 0;
                    contadorSesionesSede = 0;
                    cuantasSesionesFecha = snapshot.numChildren();

                    console.log('cuantasSesionesFecha', cuantasSesionesFecha);

                    snapshot.forEach(function(childSnapshot) {
                        contadorSesionesFecha++;
                        this['cuantasSesionesSede' + contadorSesionesFecha] = snapshot.child(childSnapshot.key).numChildren();
                        console.log('cuantasSesionesSede' + contadorSesionesFecha, this['cuantasSesionesSede' + contadorSesionesFecha]);

                        childSnapshot.forEach(function(grandChildSnapshot) {
                            contadorSesionesSede++;

                            this['sesionFecha' + contadorSesionesSede] = snapshot.child(childSnapshot.key).key;
                            console.log('sesionFecha' + contadorSesionesSede + ': ', this['sesionFecha' + contadorSesionesSede]);

                            this['sesionKey' + contadorSesionesSede] = childSnapshot.child(grandChildSnapshot.key).key;
                            console.log('sesionKey' + contadorSesionesSede + ': ', this['sesionKey' + contadorSesionesSede]);

                            this['sesionNombre' + contadorSesionesSede] = childSnapshot.child(grandChildSnapshot.key).child('Nombre_del_evento').val();
                            console.log('sesionNombre' + contadorSesionesSede + ': ', this['sesionNombre' + contadorSesionesSede]);

                            this['sesionZona' + contadorSesionesSede] = childSnapshot.child(grandChildSnapshot.key).child('Zona').val();
                            console.log('sesionZona' + contadorSesionesSede + ': ', this['sesionZona' + contadorSesionesSede]);

                            this['sesionSede' + contadorSesionesSede] = childSnapshot.child(grandChildSnapshot.key).child('Sede').val();
                            console.log('sesionSede' + contadorSesionesSede + ': ', this['sesionSede' + contadorSesionesSede]);

                            that = this;

                        });
                        cuantasSesiones = contadorSesionesSede;
                    });

                    pintaSesiones(1);

                } else {
                    pintaSesiones(0);
                }
            });

        }
    } else {
        buscando = false;
        llenaSesiones();
    }
    // $("#botonMenosSesiones, #botonMasSesiones").removeClass('mdl-button--colored mdl-color--white mdl-color-text--light-green ripplelink').attr('disabled', 'disabled');


}








function activaSecInicio() {
    pintaInicio();
}


function activaSecCursos() {

    cuentaCursos();

}

function activaSecUsuarios() {


    $("#botonAgregarUsuarioInd").mouseup(function(event) {
        event.preventDefault();

        $("#nvo_usu_nocolab").val('');
        $("#nvo_usu_nombre").val('');
        $("#nvo_usu_rfc").val('');
        $("#nvo_usu_curp").val('');
        $("#nvo_usu_fecnac").val('');
        $("#nvo_usu_fecing").val('');
        $("#nvo_usu_pos").val('');
        $("#nvo_usu_ap").val('');
        $("#nvo_usu_apdesc").val('');
        $("#nvo_usu_divp").val('');
        $("#nvo_usu_ccostedesc").val('');
        $("#nvo_usu_idsoc").val('');
        $("#nvo_usu_iddiv").val('');
        $("#nvo_usu_idsubdiv").val('');
        $("#nvo_usu_subdivpdesc").val('');
        $("#nvo_usu_nsexo").val('');
        $("#nvo_usu_nonomina").val('');
        $("#nvo_usu_nomina").val('');
        $("#nvo_usu_soc").val('');
        $("#nvo_usu_zona").val('');
        $('.mensaje_error_nvo_usuario').text('');

        var dialog = document.querySelector('.dialogoCrearUsuario');
        if (!dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
        }
        dialog.showModal();

        // $('#botonAceptarCrearUsuario').click(function() {
        $(document).off('click', '#botonAceptarCrearUsuario').on('click', '#botonAceptarCrearUsuario', function(e) {

            var usuNoColabNvo = $("#nvo_usu_nocolab").val();
            var usuNombreNvo = $("#nvo_usu_nombre").val();
            var usuRFCNvo = $("#nvo_usu_rfc").val();
            var usuCURPNvo = $("#nvo_usu_curp").val();
            var usuFecNacNvo = $("#nvo_usu_fecnac").val();
            var usuFecIngNvo = $("#nvo_usu_fecing").val();
            var usuPosNvo = $("#nvo_usu_pos").val();
            var usuAPNvo = $("#nvo_usu_ap").val();
            var usuAPDescNvo = $("#nvo_usu_apdesc").val();
            var usuDivPNvo = $("#nvo_usu_divp").val();
            var usuCCosteDescNvo = $("#nvo_usu_ccostedesc").val();
            var usuIdSocNvo = $("#nvo_usu_idsoc").val();
            var usuIdDivNvo = $("#nvo_usu_iddiv").val();
            var usuIdSubDivNvo = $("#nvo_usu_idsubdiv").val();
            var usuSubDivDescNvo = $("#nvo_usu_subdivpdesc").val();
            var usuNSexoNvo = $("#nvo_usu_nsexo").val();
            var usuNoNominaNvo = $("#nvo_usu_nonomina").val();
            var usuNominaNvo = $("#nvo_usu_nomina").val();
            var usuSocNvo = $("#nvo_usu_soc").val();
            var usuZonaNvo = $("#nvo_usu_zona").val();

            if (usuNoColabNvo != '' &&
                usuRFCNvo != '' &&
                usuCURPNvo != '' &&
                usuFecNacNvo != '' &&
                usuFecIngNvo != '' &&
                usuPosNvo != '' &&
                usuAPNvo != '' &&
                usuAPDescNvo != '' &&
                usuDivPNvo != '' &&
                usuCCosteDescNvo != '' &&
                usuIdSocNvo != '' &&
                usuIdDivNvo != '' &&
                usuIdSubDivNvo != '' &&
                usuSubDivDescNvo != '' &&
                usuNSexoNvo != '' &&
                usuNoNominaNvo != '' &&
                usuNominaNvo != '' &&
                usuSocNvo != '' &&
                usuZonaNvo != '') {

                agregaUsuario(usuNoColabNvo, usuNombreNvo, usuRFCNvo, usuCURPNvo, usuFecNacNvo, usuFecIngNvo, usuPosNvo, usuAPNvo, usuAPDescNvo, usuDivPNvo, usuCCosteDescNvo, usuIdSocNvo, usuIdDivNvo, usuIdSubDivNvo, usuSubDivDescNvo, usuNSexoNvo, usuNoNominaNvo, usuNominaNvo, usuSocNvo, usuZonaNvo);
                dialog.close();
            } else {
                $('.mensaje_error_nvo_usuario').text(mensajeErrorLogin);
            }
        });
        // $('#botonCancelarCrearUsuario').click(function() {
        $(document).off('click', '#botonCancelarCrearUsuario').on('click', '#botonCancelarCrearUsuario', function(e) {
            dialog.close();
        });

    });



    $("#agregarUsuariosGpo").mouseup(function(event) {
        event.preventDefault();
        cualSesion = $(this).attr('id').substr(17, 3);
        console.log('cualSesion', cualSesion);

        var dialog = document.querySelector('.dialogoAgregarUsuarioGpo');
        if (!dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
        }
        dialog.showModal();

        //$('#botonAceptarAgregarUsuarioGpo').click(function() {
        $(document).off('click', '#botonAceptarAgregarUsuarioGpo').on('click', '#botonAceptarAgregarUsuarioGpo', function(e) {
            if (elArchivo == '' || elArchivo == null || elArchivo == undefined) {
                $('.mensaje_error_nvo_usgpo').text(mensajeErrorLogin);
            } else {
                agregaUsuarioGpo(dialog);
            }
        });
        // $('#botonCancelarAgregarUsuarioGpo').click(function() {
        $(document).off('click', '#botonCancelarAgregarUsuarioGpo').on('click', '#botonCancelarAgregarUsuarioGpo', function(e) {
            limpiaInputSubir();
            dialog.close();
        });
    });



    resPorPagina = parseInt($('#resporpag').val());

    $("#resporpag").change(function() {
        resPorPagina = parseInt($('#resporpag').val());
        console.log('resPorPagina', resPorPagina);
        llenaUsuarios();
    });



    $("#botonMenosUsuarios").removeClass('mdl-button--colored mdl-color--white mdl-color-text--light-green ripplelink').attr('disabled', 'disabled');
    $("#botonMasUsuarios").removeClass('mdl-button--colored mdl-color--white mdl-color-text--light-green ripplelink').attr('disabled', 'disabled');


    setTimeout(llenaUsuarios, 300);

}


function agregaUsuarioGpo(dialog) {
    var cuantosUsuariosAntes = cuantosUsuarios;
    var cuantosUsuariosNvos = 0;
    console.log('cuantosUsuariosAntes', cuantosUsuariosAntes);

    function subeArchivo(cualArchivo) {
        var laUrlUsuarios = "" + laUrlBase + "/Usuarios/.json?auth=" + secret + "";

        // $.getJSON(cualArchivo, function(datos) {
        // console.log('datos a subir', datos);
        // }).done(function(datos) {
        // var jsonstring = JSON.stringify(cualArchivo);
        // console.log('val', jsonstring);

        $.ajax({
            type: "PATCH",
            url: laUrlUsuarios,
            data: cualArchivo,
            processData: false,
            contentType: false,
            // dataType: 'json',
            success: function() {
                console.log(arguments[1]);
                data = '';
                jsonstring = '';

                llenaUsuarios();
                setTimeout(function() {
                    cuantosUsuariosNvos = (cuantosUsuarios - cuantosUsuariosAntes);
                    console.log('cuantosUsuarios ahora', cuantosUsuarios);
                    llenaUsuarios();
                    dialog.close();
                    var dialog2 = document.querySelector('.dialogoAgregarUsuarioGpoExito');
                    if (!dialog2.showModal) {
                        dialogPolyfill.registerDialog(dialog2);
                    }
                    dialog2.showModal();

                    $('.dialogoAgregarUsuarioGpoExito').find('.mdl-dialog__content').html('Se han agregado con éxito ' + cuantosUsuariosNvos + ' usuarios.');

                    $(document).off('click', '#botonCerrarUsuarioGpoExito').on('click', '#botonCerrarUsuarioGpoExito', function(e) {
                        limpiaInputSubir();
                        dialog2.close();
                    });
                }, 500);

            },
            error: function() {
                //TODO detectar error en firebase
                console.log(arguments[1]);
                $('.mensaje_error_nvo_usgpo').text(mensajeErrorLogin);
            }
        });
        // });
    }

    //console.log('el archivo es', elArchivo);
    subeArchivo(elArchivo);

}


function limpiaInputSubir() {
    document.getElementById('inputArchBoton').value = '';
    document.getElementById('inputArchivo').value = '';
    elArchivo = '';
    // $('#botonSubir').attr('disabled', '');
    $('.mensaje_error_nvo_usgpo').text('');
}





function activaSecSesiones() {
    if (elPerfil === "Instructor") {
        $("#reportesSesiones").removeClass("mdl-grid").empty();
    }

    $("#botonCrearSesion").mouseup(function(event) {
        event.preventDefault();
        $("#nvo_ses_nombre").val('');
        $("#nvo_ses_zona").val('');
        $("#nvo_ses_sede").val('');
        $('.mensaje_error_nvo_sesion').text('');

        var dialog = document.querySelector('.dialogoCrearSesion');
        if (!dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
        }
        dialog.showModal();

        // $('#botonAceptarCrearSesion').click(function() {
        $(document).off('click', '#botonAceptarCrearSesion').on('click', '#botonAceptarCrearSesion', function(e) {
            var nombreNuevo = $("#nvo_ses_nombre").val();
            var zonaNueva = $("#nvo_ses_zona").val();
            var sedeNueva = $("#nvo_ses_sede").val();

            if (nombreNuevo != '' && zonaNueva != '' && sedeNueva != '') {
                creaSesion(nombreNuevo, zonaNueva, sedeNueva);
                dialog.close();
            } else {
                $('.mensaje_error_nvo_sesion').text(mensajeErrorLogin);
            }
        });
        // $('#botonCancelarCrearSesion').click(function() {
        $(document).off('click', '#botonCancelarCrearSesion').on('click', '#botonCancelarCrearSesion', function(e) {
            dialog.close();
        });

    });

    setTimeout(llenaSesiones, 200);

}




function activaLanzarCursos() {

    for (a = 1; a <= cuantosCursos; a++) {
        $("#botonIniciarCurso" + a).mouseup(function(event) {
            event.preventDefault();
            elCurso = $(this).attr('id').substr(17, 3);
            // console.log('elCurso', elCurso);
            // window.open(that['cursoLiga' + elCurso]);
            lanzaCurso(elCurso);
        });
    }


}


function activaBotonesSesiones() {

    for (a = 1; a <= cuantasSesiones; a++) {

        $("#botonModificarSesion" + a).mouseup(function(event) {
            event.preventDefault();
            cualSesion = $(this).attr('id').substr(20, 3);
            console.log('cualSesion', cualSesion);

            var dialog = document.querySelector('.dialogoModificarSesion');
            if (!dialog.showModal) {
                dialogPolyfill.registerDialog(dialog);
            }

            $("#act_ses_nombre").val(that['sesionNombre' + cualSesion]);
            $("#act_ses_nombre").parent().addClass('is-upgraded is-dirty');
            $("#act_ses_zona").val(that['sesionZona' + cualSesion]);
            $("#acto_ses_zona").parent().addClass('is-upgraded is-dirty');
            $("#act_ses_sede").val(that['sesionSede' + cualSesion]);
            $("#act_ses_sede").parent().addClass('is-upgraded is-dirty');
            $('.mensaje_error_act_sesion').text('');

            dialog.showModal();

            // $('#botonAceptarModificarSesion').click(function() {
            $(document).off('click', '#botonAceptarModificarSesion').on('click', '#botonAceptarModificarSesion', function(e) {
                //console.log('cualSesion', cualSesion);

                var nombreModificado = $("#act_ses_nombre").val();
                var zonaModificada = $("#act_ses_zona").val();
                var sedeModificada = $("#act_ses_sede").val();

                if (nombreModificado != '' && zonaModificada != '' && sedeModificada != '') {
                    modificarSesion(cualSesion, nombreModificado, zonaModificada, sedeModificada);
                    dialog.close();
                } else {
                    $('.mensaje_error_act_sesion').text(mensajeErrorLogin);
                }

            });
            // $('#botonCancelarModificarSesion').click(function() {
            $(document).off('click', '#botonCancelarModificarSesion').on('click', '#botonCancelarModificarSesion', function(e) {
                dialog.close();
            });
        });


        $(document).off('click', '#botonReporteSesion' + a).on('click', '#botonReporteSesion' + a, function(event) {
            event.preventDefault();
            cualSesion = $(this).attr('id').substr(18, 3);
            console.log('Creando reporte de la sesión cualSesion ', cualSesion);

            var dialog = document.querySelector('.dialogoReporteSesion');

            if (!dialog.showModal) {
                dialogPolyfill.registerDialog(dialog);
            }
            dialog.showModal();

            //$('#botonAceptarReporteSesion').click(function() {
            $(document).off('click', '#botonAceptarReporteSesion').on('click', '#botonAceptarReporteSesion', function(e) {
                // console.log('cualSesion', cualSesion);
                descargaReporteIndivSesion(cualSesion);
                dialog.close();
            });
            // $('#botonCancelarReporteSesion') .click(function() {
            $(document).off('click', '#botonCancelarReporteSesion').on('click', '#botonCancelarReporteSesion', function(e) {
                dialog.close();
            });
        });


        $("#botonBorrarSesion" + a).mouseup(function(event) {
            event.preventDefault();
            cualSesion = $(this).attr('id').substr(17, 3);
            console.log('cualSesion', cualSesion);

            var dialog = document.querySelector('.dialogoBorrarSesion');
            if (!dialog.showModal) {
                dialogPolyfill.registerDialog(dialog);
            }
            dialog.showModal();

            //$('#botonAceptarBorrarSesion').click(function() {
            $(document).off('click', '#botonAceptarBorrarSesion').on('click', '#botonAceptarBorrarSesion', function(e) {
                console.log('cualSesion', cualSesion);
                borrarSesion(cualSesion);
                dialog.close();
            });
            // $('#botonCancelarBorrarSesion').click(function() {
            $(document).off('click', '#botonCancelarBorrarSesion').on('click', '#botonCancelarBorrarSesion', function(e) {
                dialog.close();
            });
        });

    }


    for (a = 1; a <= 5; a++) {

        $("#botonReportesSesiones" + a).mouseup(function(event) {
            event.preventDefault();
            var cualCurso = $(this).attr('id').substr(21, 3);
            console.log('Creando reporte de todas las  sesiones del curso:', cualCurso);

            var dialog = document.querySelector('.dialogoReporteGralSesiones');
            if (!dialog.showModal) {
                dialogPolyfill.registerDialog(dialog);
            }
            dialog.showModal();

            //$('#botonAceptarreportesSesiones').click(function() {
            $(document).off('click', '#botonAceptarReporteGralSesiones').on('click', '#botonAceptarReporteGralSesiones', function(e) {
                console.log('reportesSesiones', cualCurso);
                descargaReportesSesionesCurso(cualCurso);
                dialog.close();
            });
            // $('#botonCancelarreportesSesiones').click(function() {
            $(document).off('click', '#botonCancelarReporteGralSesiones').on('click', '#botonCancelarReporteGralSesiones', function(e) {
                dialog.close();
            });
        });

    }



}




function activaBotonesUsuarios() {

    for (a = 1; a <= cuantosUsuarios; a++) {

        $("#botonModificarUsuario" + a).mouseup(function(event) {
            event.preventDefault();
            cualUsuario = $(this).attr('id').substr(21, 3);
            console.log('cualUsuario', cualUsuario);

            var dialog = document.querySelector('.dialogoModificarUsuario');
            if (!dialog.showModal) {
                dialogPolyfill.registerDialog(dialog);
            }

            // $("#act_usu_nocolab").val(that['usuarioNoColab' + cualUsuario]);
            // $("#act_usu_nocolab").parent().addClass('is-upgraded is-dirty');
            $("#act_usu_nombre").val(that['usuarioNombre' + cualUsuario]);
            $("#act_usu_nombre").parent().addClass('is-upgraded is-dirty');
            $("#act_usu_rfc").val(that['usuarioRFC' + cualUsuario]);
            $("#act_usu_rfc").parent().addClass('is-upgraded is-dirty');
            $("#act_usu_curp").val(that['usuarioCURP' + cualUsuario]);
            $("#act_usu_curp").parent().addClass('is-upgraded is-dirty');
            $("#act_usu_fecnac").val(that['usuarioFecha_Nac' + cualUsuario]);
            $("#act_usu_fecnac").parent().addClass('is-upgraded is-dirty');
            $("#act_usu_fecing").val(that['usuarioFechaIngreso' + cualUsuario]);
            $("#act_usu_fecing").parent().addClass('is-upgraded is-dirty');
            $("#act_usu_pos").val(that['usuarioPosicion' + cualUsuario]);
            $("#act_usu_pos").parent().addClass('is-upgraded is-dirty');
            $("#act_usu_ap").val(that['usuarioAP' + cualUsuario]);
            $("#act_usu_ap").parent().addClass('is-upgraded is-dirty');
            $("#act_usu_apdesc").val(that['usuarioAP_Desc' + cualUsuario]);
            $("#act_usu_apdesc").parent().addClass('is-upgraded is-dirty');
            $("#act_usu_divp").val(that['usuarioDivision_de_personal' + cualUsuario]);
            $("#act_usu_divp").parent().addClass('is-upgraded is-dirty');
            $("#act_usu_ccostedesc").val(that['usuarioCentroCoste_DESC' + cualUsuario]);
            $("#act_usu_ccostedesc").parent().addClass('is-upgraded is-dirty');
            $("#act_usu_idsoc").val(that['usuarioIdSoc' + cualUsuario]);
            $("#act_usu_idsoc").parent().addClass('is-upgraded is-dirty');
            $("#act_usu_iddiv").val(that['usuarioIdDivsion' + cualUsuario]);
            $("#act_usu_iddiv").parent().addClass('is-upgraded is-dirty');
            $("#act_usu_idsubdiv").val(that['usuarioIdSubDivision' + cualUsuario]);
            $("#act_usu_idsubdiv").parent().addClass('is-upgraded is-dirty');
            $("#act_usu_subdivpdesc").val(that['usuarioSubdivision_de_personal_DESC' + cualUsuario]);
            $("#act_usu_subdivpdesc").parent().addClass('is-upgraded is-dirty');
            $("#act_usu_nsexo").val(that['usuarioN_Sexo' + cualUsuario]);
            $("#act_usu_nsexo").parent().addClass('is-upgraded is-dirty');
            $("#act_usu_nonomina").val(that['usuarioNo_de_Nomina' + cualUsuario]);
            $("#act_usu_nonomina").parent().addClass('is-upgraded is-dirty');
            $("#act_usu_nomina").val(that['usuarioNomina' + cualUsuario]);
            $("#act_usu_nomina").parent().addClass('is-upgraded is-dirty');
            $("#act_usu_soc").val(that['usuarioSociedad' + cualUsuario]);
            $("#act_usu_soc").parent().addClass('is-upgraded is-dirty');
            $("#act_usu_zona").val(that['usuarioZona' + cualUsuario]);
            $("#act_usu_zona").parent().addClass('is-upgraded is-dirty');

            $(".dialogoModificarUsuario .titulo_dialogo_confirm").html("Modificar usuario: <span style='margin-left:10px; font-size:28px; color: rgb(105, 151, 139);'>" + (that['usuarioNoColaborad' + cualUsuario]) + "<span>");


            dialog.showModal();

            // $('#botonAceptarModificarUsuario').click(function() {
            $(document).off('click', '#botonAceptarModificarUsuario').on('click', '#botonAceptarModificarUsuario', function(e) {
                //console.log('cualUsuario', cualUsuario);

                var usuNombreAct = $("#act_usu_nombre").val();
                var usuRFCAct = $("#act_usu_rfc").val();
                var usuCURPAct = $("#act_usu_curp").val();
                var usuFecNacAct = $("#act_usu_fecnac").val();
                var usuFecIngAct = $("#act_usu_fecing").val();
                var usuPosAct = $("#act_usu_pos").val();
                var usuAPAct = $("#act_usu_ap").val();
                var usuAPDescAct = $("#act_usu_apdesc").val();
                var usuDivPAct = $("#act_usu_divp").val();
                var usuCCosteDescAct = $("#act_usu_ccostedesc").val();
                var usuIdSocAct = $("#act_usu_idsoc").val();
                var usuIdDivAct = $("#act_usu_iddiv").val();
                var usuIdSubDivAct = $("#act_usu_idsubdiv").val();
                var usuSubDivDescAct = $("#act_usu_subdivpdesc").val();
                var usuNSexoAct = $("#act_usu_nsexo").val();
                var usuNoNominaAct = $("#act_usu_nonomina").val();
                var usuNominaAct = $("#act_usu_nomina").val();
                var usuSocAct = $("#act_usu_soc").val();
                var usuZonaAct = $("#act_usu_zona").val();

                if (usuNombreAct != '' &&
                    usuRFCAct != '' &&
                    usuCURPAct != '' &&
                    usuFecNacAct != '' &&
                    usuFecIngAct != '' &&
                    usuPosAct != '' &&
                    usuAPAct != '' &&
                    usuAPDescAct != '' &&
                    usuDivPAct != '' &&
                    usuCCosteDescAct != '' &&
                    usuIdSocAct != '' &&
                    usuIdDivAct != '' &&
                    usuIdSubDivAct != '' &&
                    usuSubDivDescAct != '' &&
                    usuNSexoAct != '' &&
                    usuNoNominaAct != '' &&
                    usuNominaAct != '' &&
                    usuSocAct != '' &&
                    usuZonaAct != '') {

                    modificarUsuario(cualUsuario, usuNombreAct, usuRFCAct, usuCURPAct, usuFecNacAct, usuFecIngAct, usuPosAct, usuAPAct, usuAPDescAct, usuDivPAct, usuCCosteDescAct, usuIdSocAct, usuIdDivAct, usuIdSubDivAct, usuSubDivDescAct, usuNSexoAct, usuNoNominaAct, usuNominaAct, usuSocAct, usuZonaAct);
                    dialog.close();
                } else {
                    $('.mensaje_error_act_usuario').text(mensajeErrorLogin);
                }

            });
            // $('#botonCancelarModificarUsuario').click(function() {
            $(document).off('click', '#botonCancelarModificarUsuario').on('click', '#botonCancelarModificarUsuario', function(e) {
                dialog.close();
            });
        });

        $("#botonBorrarUsuario" + a).mouseup(function(event) {
            event.preventDefault();
            cualUsuario = $(this).attr('id').substr(18, 3);
            console.log('cualUsuario', cualUsuario);

            var dialog = document.querySelector('.dialogoBorrarUsuario');
            if (!dialog.showModal) {
                dialogPolyfill.registerDialog(dialog);
            }
            dialog.showModal();

            //$('#botonAceptarBorrarUsuario').click(function() {
            $(document).off('click', '#botonAceptarBorrarUsuario').on('click', '#botonAceptarBorrarUsuario', function(e) {
                console.log('cualUsuario', cualUsuario);
                borrarUsuario(cualUsuario);
                dialog.close();
            });
            // $('#botonCancelarBorrarUsuario').click(function() {
            $(document).off('click', '#botonCancelarBorrarUsuario').on('click', '#botonCancelarBorrarUsuario', function(e) {
                dialog.close();
            });
        });

    }

    $("#botonMenosUsuarios").mouseup(function(event) {
        event.preventDefault();
        $(document).off('mouseup', '#botonMenosUsuarios').on('mouseup', '#botonMenosUsuarios', function(e) {
            if ($(this).attr('disabled') != 'disabled') {
                llenaUsuarios('menos');
            }
        });
    });

    $("#botonMasUsuarios").mouseup(function(event) {
        event.preventDefault();
        $(document).off('mouseup', '#botonMasUsuarios').on('mouseup', '#botonMasUsuarios', function(e) {
            if ($(this).attr('disabled') != 'disabled') {
                llenaUsuarios('mas');
            }
        });
    });

    $("#busqueda_usuario").keyup(function(event) {
        $(document).off('keyup', '#busqueda_usuario').on('keyup', '#busqueda_usuario', function(e) {
            buscaUsuario($(this).val());
        });
    });


}





function lanzaCurso(cualCurso) {
    console.log(cualCurso);

    var laLiga = that['cursoLiga' + elCurso];

    $("#contenido").css({
        'padding': '0px'
    });

    $("#content").empty();
    // $("#content").load(laLiga, function() {
    //     console.log('elCurso', elCurso, ' ', laLiga, 'cargado.');
    // });

    $("#content").html('<iframe name="curso" id="curso" src="' + laLiga + '" frameborder="0" scrolling="no" border="0" style="width:100%; height:100%;"></iframe>');

    elCursoLanzado = true;


    ajustaEscalaCurso();

}




function ajustaEscalaCurso() {

    elAlto = $(window).height() - 64;

    $("#content").css({
        'height': elAlto + 'px'
    });

}


///////////////////////////////// fechas ///////////////////////////////////////

function obtenerFecha() {
    moment.locale('es');
    var laFecha = moment().format('LL');
    console.log('laFecha', laFecha);

    return laFecha;
}
//obtenerFecha();

function obtenerFechaInicial() {
    moment.locale('es');
    laFechaInicial = moment().format();
    console.log('laFechaInicial', laFechaInicial);

    return laFechaInicial;
}
//obtenerFechaInicial();

function obtenerDuracion() {
    moment.locale('es');
    laFechaFinal = moment().format();
    laDuracion = moment(laFechaInicial).fromNow(true);
    console.log('laDuracion', laDuracion);

    return laDuracion;
}
//obtenerDuracion();


// laFecha = obtenerFecha();
// laFechaInicial = obtenerFechaInicial();
// laFechaFinal = moment().format('LL');
// var laDuracionSesion = obtenerDuracion();
//
// console.log('laFecha', laFecha);
// console.log('laFechaInicial', laFechaInicial);
// console.log('laFechaFinal', laFechaFinal);
// console.log('laDuracionSesion', laDuracionSesion);


function obtenerFechaFormateada() {
    var laFechaFormateada = moment().locale('es').format('DD-MM-YYYY');
    console.log('laFechaFormateada', laFechaFormateada);

    return laFechaFormateada;
}



$("#sesinicio").css({
    'opacity': '0',
    'display': 'none'
});





/////////////////////////////// navegación /////////////////////////////////////

function navega(cualSeccion) {
    // console.log(cualSeccion);

    elCursoLanzado = false;

    $("#contenido").css({
        'padding': '10px'
    });


    if (cualSeccion == '' || cualSeccion == null || cualSeccion == undefined) {
        cualSeccion = 'inicio';
    }

    $("#content").empty();
    $("#content").load('inc/' + cualSeccion + '.html', function() {
        // console.log('cualSeccion', cualSeccion, 'cargada.');
        $("#boton_inicio, #boton_cursos, #boton_usuarios, #boton_sesiones").removeClass('inactivo').addClass('activo');
        $("#boton_" + cualSeccion).removeClass('activo').addClass('inactivo');

        $(".mdl-layout__drawer, .mdl-layout__obfuscator").removeClass('is-visible');

        hazRipple();

    });

    $("#boton_inicio, #boton_cursos, #boton_usuarios, #boton_sesiones").show();
    if (elPerfil === "Instructor") {
        // $("#boton_sesiones").hide();
    }
    if (elPerfil === "Participante") {
        $("#boton_usuarios, #boton_sesiones").hide();
    }
}





function hazRipple() {
    var ink, d, x, y;
    $(".ripplelink, .ripplelink_sc").mousedown(function(event) {
        if ($(this).find(".ink").length === 0) {
            $(this).prepend("<span class='ink'></span>");
        }

        ink = $(this).find(".ink");
        ink.removeClass("animate");

        if (!ink.height() && !ink.width()) {
            d = Math.max($(this).outerWidth(), $(this).outerHeight());
            ink.css({
                height: d,
                width: d
            });
        }

        x = event.pageX - $(this).offset().left - ink.width() / 2;
        y = event.pageY - $(this).offset().top - ink.height() / 2;

        ink.css({
            top: y + 'px',
            left: x + 'px'
        }).addClass("animate");
    });
}


$(window).resize(function() {

    if (elCursoLanzado == true) {
        ajustaEscalaCurso();
    }


    $('#tablaSesiones').css({
        'width': '100%'
    })

});







$(document).ready(function() {


    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/js/sw.js', {
                scope: '/js/'
            })
            .then(function(registration) {
                console.log('Service Worker Registered');
            });

        navigator.serviceWorker.ready.then(function(registration) {
            console.log('Service Worker Ready');
        });
    }



    laFechaFormateada = obtenerFechaFormateada();


    $('.contenido').hide();
    $('.header').hide();
    $('#botonCerrar').hide();
    $("#inputUsuario").val('');
    $("#inputPassword").val('');

    $("#sesion_nvo_nombre").val('');
    $("#sesion_nvo_zona").val('');
    $("#sesion_nvo_sede").val('');




    $("#botonEntrar").click(function(event) {
        event.preventDefault();
        login($("#inputUsuario").val(), $("#inputPassword").val());
    });


    $('#botonCerrar').click(function() {
        var dialog = document.querySelector('.dialogoCerrar');
        if (!dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
        }
        dialog.showModal();

        // $('#botonAceptarCerrar').click(function() {
        $(document).off('click', '#botonAceptarCerrar').on('click', '#botonAceptarCerrar', function(e) {
            cierraSesion();
            dialog.close();
        });
        // $('#botonCancelarCerrar').click(function() {
        $(document).off('click', '#botonCancelarCerrar').on('click', '#botonCancelarCerrar', function(e) {
            dialog.close();
        });
    });




    $("#boton_inicio, #boton_cursos, #boton_usuarios, #boton_sesiones").click(function(event) {
        if ($(this).css('cursor') == 'pointer') {
            var cualSeccion = $(this).attr('id').substr(6, $(this).attr('id').length);
            event.preventDefault();

            navega(cualSeccion);
        }
    });






    var fileInput = document.getElementById('inputArchivo');

    document.getElementById('inputArchBoton').onchange = function(e) {
        document.getElementById('inputArchivo').value = this.files[0].name;
        var file = this.files[0];

        // console.log('file.type', file.jQuery.type(  ));
        // if (file.type.match('image/jpeg')) {
        var reader = new FileReader();

        reader.onload = function(e) {
            elArchivo = reader.result;
            // console.log('elArchivo', elArchivo);
        }
        reader.onerror = function(e) {
            $('.mensaje_error_nvo_usgpo').text(mensajeErrorLogin);
            console.log('File not supported!');
        }
        reader.readAsText(file);
        // } else {
        // $('.mensaje_error_nvo_usgpo').text(mensajeErrorLogin);
        // console.log('File not supported!');
        // }
    };







});
