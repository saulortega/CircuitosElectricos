var depuracion=true;
var origen; //Si un elemento es arrastrado desde la caja o desde el propio tablero
var mover; //Si se debe borrar el origen, en caso de ser movimiento desde el mismo tablero.
var columnaOrigen;
var filaOrigen;
var columnaDestino;
var filaDestino;


/*
function comienzaArrastre(e){
	//e.preventDefault();
	//e.stopPropagation();
	e.dataTransfer.effectAllowed = 'move';
	origen = this.getAttribute('data-origen');
	//e.dataTransfer.setData('text', origen);
	console.log(origen)
	console.log('_comienza: ')
	console.log(this)
	if(origen=='tablero'){
		var celda = this.parentElement;
		columna = posicion.columna(celda);
		fila = posicion.fila(celda);
		mover=true;
	}
}*/
/*
function terminaArrastre(e){
	console.log('_termina: ')
	console.log(this)
	origen=null;
	mover=null;
	columna=null;
	fila=null;
}*/
/*
function arrastreSobreCelda(e){
	e.preventDefault(); //Necesario
	e.stopPropagation(); //Necesario
	this.style.border = '2px dashed orange';
	e.dataTransfer.dropEffect = 'move';
	console.log('_Sobre celda: ')
	console.log(this)
}*/
/*
function arrastreFueraCelda(e){
	//e.preventDefault();
	this.style.border = '';
	this.style.backgroundColor = '';
	console.log('_Fuera celda: ')
	console.log(this)
}*/
/*
function soltarElemento(e){
	e.preventDefault();
	e.stopPropagation();
	this.style.border = '';
	var ele = e.dataTransfer.getData("text");
	dibujarElemento(this,ele);
	e.dataTransfer.dropEffect = 'move';
	//console.log('hhh: '+this)
	//return false;
	console.log('_Suelto: ')
	console.log(this)
}*/
/*
function dibujarElemento(celda,ele){
	var I = '<img src="./img/R-h.png" class="arrastrable" draggable="true" data-origen="tablero">';
	celda.innerHTML = I;
	posicion.calcular(celda);
	escucharEventos(); // Necesario para encontrar ls nuevos elementos
}
*/


function escucharEventos(){
	/*var elementos = document.querySelectorAll('.arrastrable');
	[].forEach.call(elementos, function(elem) {
		elem.addEventListener('dragstart', comienzaArrastre, false);
		elem.addEventListener('dragend', terminaArrastre, false);
	});

	var celdas = document.querySelectorAll('.celda');
	[].forEach.call(celdas, function(celda) {
		//celda.addEventListener('dragenter', arrastreSobreCelda, false);
		celda.addEventListener('dragover', arrastreSobreCelda, false);
		celda.addEventListener('dragleave', arrastreFueraCelda, false);
		celda.addEventListener('drop', soltarElemento, false);
	});
	*/
	var elementos = document.querySelectorAll('.arrastrable');
	[].forEach.call(elementos, function(elem) {
		elem.addEventListener('dragstart', arrastrar.inicio, false);
		elem.addEventListener('dragend', arrastrar.fin, false);
	});

	var celdas = document.querySelectorAll('.celda');
	[].forEach.call(celdas, function(celda) {
		//celda.addEventListener('dragenter', arrastreSobreCelda, false);
		celda.addEventListener('dragover', arrastrar.sobreCelda, false);
		celda.addEventListener('dragleave', arrastrar.fueraCelda, false);
		celda.addEventListener('drop', arrastrar.soltar, false);
	});
}





var Resistencia,orientacion,tipoElemento
var conexiones; //ar,de,iz,ab
var polaridad; //+-, -+
var ResistenciaH = './img/R-h.png';
var ResistenciaV = './img/R-v.png';
var elementoDiscontinuo='<span class="glyphicon glyphicon-remove elemento-discontinuo" style="top:19px;left:45px"></span>';




var arrastrar = {
	'inicio':function(e){
		e.dataTransfer.effectAllowed = 'move';
		origen = this.getAttribute('data-origen');
		if(origen=='tablero'){
			var celda = this.parentElement;
			columnaOrigen = posicion.columna(celda);
			filaOrigen = posicion.fila(celda);
			mover=true;
		}
		orientacion = this.getAttribute('data-ori');
		/*if(orientacion=='v'){
			Resistencia=ResistenciaV;
		} else {
			Resistencia=ResistenciaH;
		}*/
		tipoElemento = this.getAttribute('data-tipo');
		conexiones = this.getAttribute('data-con');
		polaridad = this.getAttribute('data-pol');
		//console.log(conexiones)

	},
	'sobreCelda':function(e){
		e.preventDefault(); //Necesario
		e.stopPropagation(); //Necesario
		this.style.border = '2px dashed orange';
		//e.dataTransfer.dropEffect = 'move';
	},
	'fueraCelda':function(e){
		this.style.border = '';
	},
	'soltar':function(e){
		e.preventDefault();
		e.stopPropagation();
		this.style.border = '';
		columnaDestino = posicion.columna(this);
		filaDestino = posicion.fila(this);
		if(origen=='tablero'){
			if(filaOrigen==filaDestino && columnaOrigen==columnaDestino){
				return;
			}
		}
		//if(columnaDestino) //Aquí voy -----------------------
		var esq = posicion.esquina(this);
		if(esq){
			orientacion=esq;
			if(tipoElemento=='nodo'){
				if(esq=='si'){
					conexiones = 'de,ab';
				} else if(esq=='sd'){
					conexiones = 'iz,ab';
				} else if(esq=='ii'){
					conexiones = 'ar,de';
				} else if(esq=='id'){
					conexiones = 'iz,ar';
				} else {
					console.log('Esquina desconocida...'); //Esto no debería ocurrir nunca...
				}
			} else {
				alert('No puede poner este elemento en una esquina.');
				return;
			}
		}
		elemento.dibujar(this);
	},
	'fin':function(e){
		origen=null;
		mover=null;
		columnaOrigen=null;
		filaOrigen=null;
		columnaDestino=null;
		filaDestino=null;
		conexiones=null;
		polaridad=null;
	}
}




var posicion = { //Posicionamiento de una celda
	'calcular':function(celda){ //Esta acción sobra, reempazar por la de Elemento....
		var columna = posicion.columna(celda);
		if(columna==1 || columna==20){
			var pos = 'V';
		} else {
			var pos = 'H';
		}
		console.log(pos);
		var aa = posicion.esquina(celda);
		console.log(aa);
	},
	'fila':function(celda){
		var fila = celda.parentElement.getAttribute('data-pos');
		fila = parseInt(fila);
		return fila;
	},
	'columna':function(celda){
		var columna = celda.getAttribute('data-pos');
		columna = parseInt(columna);
		return columna;
	},
	'esquina':function(celda){
		var co = posicion.columna(celda);
		var fi = posicion.fila(celda);
		var esq = null;
		if(co==1 && fi==1){
			esq = 'si';
		} else if(co==20 && fi==1){
			esq = 'sd';
		} else if(co==1 && fi==6){
			esq = 'ii';
		} else if(co==20 && fi==6){
			esq = 'id';
		}
		return esq;
	}
}




var elemento = {
	'posicion':function(celda){ //Horizontal o vertical
		//
	},
	'direccion':function(){ //Dirección de corroente o voltaje...
		//
	},
	'dibujar':function(celda){
		//Limpiar:
		//comprobacion.limpiar();
		circuito.limpiar();
		var laImagen = tipoElemento+'-'+orientacion;
		if(polaridad && polaridad!='null'){
			var laImagen = laImagen+'_'+polaridad;
		}
		//var I = '<img src="./img/R-h.png" class="arrastrable" draggable="true" data-origen="tablero" data-pos="H">'; //data-pos quemado,verificar después
		var dibujo='<img src="./img/'+laImagen+'.png" class="arrastrable" draggable="true" data-origen="tablero" data-tipo="'+tipoElemento+'" data-ori="'+orientacion+'" data-con="'+conexiones+'" data-pol="'+polaridad+'" data-val="" onclick="elemento.valores(this)">';
		dibujo=dibujo+'<span class="valores"></span>';
		dibujo=dibujo+'<span class="polaridad" style="display:none"></span>';
		if(tipoElemento=='nodo'){
			dibujo=dibujo+'<span class="identificador-nodo" data-identificador="" style="position:absolute;font-size:20px;color:blue;top:-10px;left:18px;"></span>';
		}
		celda.innerHTML = dibujo;
		posicion.calcular(celda);
		escucharEventos();
		if(mover){
			var ta = document.getElementById('tablero');
			console.log('fila origen: '+filaOrigen)
			var fi = ta.querySelector('.fila[data-pos="'+filaOrigen+'"]');
			var cel = fi.querySelector('.celda[data-pos="'+columnaOrigen+'"]');
			cel.innerHTML='';
		}
	},
	'valores':function(self){
		var el = $(self).attr('data-tipo');
		if(el=='R'){
			el='resistencia';
		} else if(el=='I'){
			el='corriente';
		} else if(el=='V'){
			el='voltaje';
		}
		//$(self).attr('data-edi',true); //Editando...
		var celda = self.parentElement;
		var fi = posicion.fila(celda);
		var co = posicion.columna(celda);
		console.log('fila: '+fi+', columna: '+co)
		$('#valores-'+el+' input[name="fila"]').val(fi);
		$('#valores-'+el+' input[name="columna"]').val(co);
		$('#valores-'+el).modal('show');
	},
	'guardarR':function(){
		var fi = $('#valores-resistencia input[name="fila"]').val();
		var co = $('#valores-resistencia input[name="columna"]').val();
		var uni = $('input[name="unidad"][id="_"]').prop('checked');
		var uniK = $('input[name="unidad"][id="K"]').prop('checked');
		if(uni){
			var un = 'Ω';
			var val = $('#valores-resistencia input[name="valor"]').val();
			var unidadBasica = val;
		}else if(uniK){
			var un = 'KΩ';
			var val = $('#valores-resistencia input[name="valor"]').val();
			var unidadBasica = val*1000;
		} else {
			alert('Seleccione las unidades d emedida.');
			return;
		}
		$('#tablero>div.fila[data-pos="'+fi+'"]>div.celda[data-pos="'+co+'"]>img').attr('data-val',unidadBasica).siblings('span.valores').text(val+' '+un);
		$('#valores-resistencia input[name="fila"]').val(fi);
		$('#valores-resistencia input[name="columna"]').val(co);
		$('#valores-resistencia').modal('hide');
		elemento.limpiar();
	},
	'limpiar':function(){
		$('input[type="text"]').val('');
		$('input[type="hidden"]').val('');
		$('input[type="radio"]').prop('checked',false).parent('label').removeClass('active');
		$('input[type="checkbox"]').prop('checked',false);
	}
}




function aviso(texto){
	$('#mensaje-error').html(texto).show('slow');;
}




//var comprobacion = {
var circuito = {
	'comprobar':function(){
		circuito.limpiar();
		var cadaElemento = $('#tablero .celda img');
		var cadaResistencia = $('#tablero .celda img[data-tipo="R"]');
		var cadaCorriente = $('#tablero .celda img[data-tipo="I"]');
		var cadaVoltaje = $('#tablero .celda img[data-tipo="V"]');
		var cadaNodo = $('#tablero .celda img[data-tipo="nodo"]');
		if(cadaElemento.length<=4){
			aviso('Dibuje un circuito.');
			return false;
		} else if(cadaResistencia.length==0 && cadaCorriente.length==0 && cadaVoltaje.length==0){
			aviso('Agregue resistencias y fuentes de corriente o voltaje.');
			return false;
		} else if(cadaResistencia.length==0){
			aviso('Agregue resistencias al circuito.');
			return false;
		} else if(cadaCorriente.length==0 && cadaVoltaje.length==0){
			aviso('Agregue una fuente de corriente o voltaje.');
			return false;
		}
		//var cuenta=0;
		var incoherente=false;
		$.each(cadaElemento,function(ind,ele){
			//cuenta++;
			var cel = ele.parentElement;
			var fi = posicion.fila(cel);
			var co = posicion.columna(cel);
			//var buscaFila=[];
			//var buscaColumna=[];
			var con = $(ele).attr('data-con');
			var cadaConexion = con.split(',');
			if(depuracion){
				console.log('########## circuito.comprobar():');
				console.log('Fila: '+fi);
				console.log('Columna: '+co);
				console.log('Celda:');
				console.log(cel);
				console.log('Conexiones del elemento: '+con);
			}
			$.each(cadaConexion,function(ind,ele){
				if(ele=='ar'){
					//buscaFila.push(fi-1);
					var buscoArriba = $('#tablero>.fila[data-pos="'+(fi-1)+'"]>.celda[data-pos="'+co+'"]>img[data-con*="ab"]');
					if(buscoArriba.length==0){
						incoherente=true;
						$('#tablero>.fila[data-pos="'+fi+'"]>.celda[data-pos="'+co+'"]').append('<span class="glyphicon glyphicon-remove elemento-discontinuo" style="top:-5px;left:19px"></span>');
					}
				} else if(ele=='ab'){
					//buscaFila.push(fi+1);
					var buscoAbajo = $('#tablero>.fila[data-pos="'+(fi+1)+'"]>.celda[data-pos="'+co+'"]>img[data-con*="ar"]');
					if(buscoAbajo.length==0){
						incoherente=true;
						$('#tablero>.fila[data-pos="'+fi+'"]>.celda[data-pos="'+co+'"]').append('<span class="glyphicon glyphicon-remove elemento-discontinuo" style="top:45px;left:19px"></span>');
					}
				} else if(ele=='iz'){
					//buscaColumna.push(co-1);
					var buscoIzquierda = $('#tablero>.fila[data-pos="'+fi+'"]>.celda[data-pos="'+(co-1)+'"]>img[data-con*="de"]');
					if(buscoIzquierda.length==0){
						incoherente=true;
						$('#tablero>.fila[data-pos="'+fi+'"]>.celda[data-pos="'+co+'"]').append('<span class="glyphicon glyphicon-remove elemento-discontinuo" style="top:19px;left:-5px"></span>');
					}
				} else if(ele=='de'){
					//buscaColumna.push(co+1);
					var buscoDerecha = $('#tablero>.fila[data-pos="'+fi+'"]>.celda[data-pos="'+(co+1)+'"]>img[data-con*="iz"]');
					if(buscoDerecha.length==0){
						incoherente=true;
						$('#tablero>.fila[data-pos="'+fi+'"]>.celda[data-pos="'+co+'"]').append('<span class="glyphicon glyphicon-remove elemento-discontinuo" style="top:19px;left:45px"></span>');
					}
				}
			});
			/*$.each(buscaFila,function(ind,ele){
				var buscoArribaAbajo = $('#tablero>.fila[data-pos="'+ele+'"]>.celda[data-pos="'+co+'"]>img');
				if(buscoArribaAbajo.length==0){
					incoherente=true;
					}
			});
			$.each(buscaColumna,function(ind,ele){
				var buscoIzquierdaDerecha = $('#tablero>.fila[data-pos="'+fi+'"]>.celda[data-pos="'+ele+'"]>img');
				if(buscoIzquierdaDerecha.length==0){
					incoherente=true;
				}
			});*/
		});
		if(incoherente){
			aviso('El circuito no está bien cerrado.');
			return false;
		}
		var nodoNoTrivial=false;
		$.each(cadaNodo,function(){
			var con=$(this).attr('data-con');
			con=con.split(',');
			if(con.length>=3){
				nodoNoTrivial=true;
			}
		});
		if(!nodoNoTrivial){
			aviso('Dibuje un circuito con nodos no triviales.');
			return false;
		}
		if(depuracion){
			console.log('El circuito parece estar bien.');
			console.log('////////// circuito.comprobar():');
		}
		return true;
	},
	'recorrer':function(){
		var cadaNodo = $('#tablero .celda img[data-tipo="nodo"]');
		var recorridos=[];
		$.each(cadaNodo,function(){
			var lasConexiones = $(this).attr('data-con');
			lasConexiones=lasConexiones.split(',');
			var buscaFila;
			var buscaColumna;
			var buscoCelda;
			if(lasConexiones.length>=3){
				var identificadorNodoInicial = $(this).siblings('.identificador-nodo').attr('data-identificador');
				var valorNodoInicial = $(this).siblings('.identificador-nodo').attr('data-valor');
				console.log('Valor de nodo: '+valorNodoInicial);
				var cel = this.parentElement;
				var fi = posicion.fila(cel);
				var co = posicion.columna(cel);
				var fila;
				var columna;
				$.each(lasConexiones,function(ind,ele){
					if(ele=='ar'){
						fila=fi-1;
						columna=co;
					} else if(ele=='ab'){
						fila=fi+1;
						columna=co;
					} else if(ele=='iz'){
						columna=co-1;
						fila=fi;
					} else if(ele=='de'){
						columna=co+1;
						fila=fi;
					}
					var ruta=ele;
					var encuentroNodo=false;
					var i=0;
					console.log('antes de entrar al bucle');
					var rstncs=[];
					do {
						var fil=fila;
						var col=columna;
						console.log('fila: '+fil+'_ columna: '+col);
						var elElemento = $('#tablero>.fila[data-pos="'+fila+'"]>.celda[data-pos="'+columna+'"]>img');
						if(elElemento.length>0){
							var tipoElmnto = $(elElemento).attr('data-tipo');
							if(tipoElmnto=='R'){
								rstncs.push(fila+'-'+columna+'/'+ruta);
							}
							console.log(elElemento);
							var cnxsElmnto = $(elElemento).attr('data-con');
							var cadena = 'ubicacion='+fila+'-'+columna+'/tipo='+tipoElmnto+'/conexiones='+cnxsElmnto;
							cnxsElmnto=cnxsElmnto.split(',');
							if(cnxsElmnto.length>=3){ //Nodo encontrado, detengo la búsqueda
								var identificadorNodoFinal = $(elElemento).siblings('.identificador-nodo').attr('data-identificador');
								var valorNodoFinal = $(elElemento).siblings('.identificador-nodo').attr('data-valor');
								//Comprobación para evitar repetir mismo recorrido en sentido contrario:
								var nuevoRecorrido=true;
								$.each(recorridos,function(ii,obj){
									if(obj.identificadorNodoInicial==identificadorNodoFinal && obj.identificadorNodoFinal==identificadorNodoInicial){
										nuevoRecorrido=false;
										return false;
									}
								});
								if(nuevoRecorrido){
									var esteRecorrido={'identificadorNodoInicial':identificadorNodoInicial,'identificadorNodoFinal':identificadorNodoFinal,'valorNodoInicial':valorNodoInicial,'valorNodoFinal':valorNodoFinal,'resistencias':rstncs}
									recorridos.push(esteRecorrido);
								}
								i=100;
							} else {
								var yaEntré=false;
								$.each(cnxsElmnto,function(i,e){
									var ladoOpuesto=opuesto(ruta);
									//console.log('esta ruta: '+e)
									//console.log('lado opuesto: '+ladoOpuesto);
									//console.log('ruta: '+ruta);
									if(ladoOpuesto!=e && !yaEntré){
										yaEntré=true;
										if(e=='ar'){
											fila=fil-1;
										} else if(e=='ab'){
											fila=fil+1;
										} else if(e=='iz'){
											columna=col-1;
										} else if(e=='de'){
											columna=col+1;
										}
										ruta=e
									}
								});
							}
							console.log('dentro del bucle: '+cadena);
						} else {
							i=100;
							if(depuracion){
								console.log('Error: No se encontró ningún elemento.')
							}
						}
						i++;
						console.log(i)
					} while (i<10);
					//console.log(fila+'_'+columna);
				});
			}
		});
		var contador=0;
		$.each(recorridos,function(ind,ele){
			if(ind==0){
				cuenta=contador;
			} else {
				cuenta=contador+800;
			}
			$.each(ele.resistencias,function(i,e){
				var r=e.split('/');
				var d=r[1];
				var pos=r[0].split('-');
				var f=pos[0];
				var c=pos[1];
				var vni=parseInt(ele.valorNodoInicial);
				var vnf=parseInt(ele.valorNodoFinal);
				if(vni<vnf){
					d=opuesto(d);
				}
				contador=(i*800)+cuenta;
				setTimeout(function(){
					dibujar.polaridad(f,c,d);
				},contador);
			});
			//console.log(ele);
		});
	},
	'limpiar':function(){
		$('.glyphicon-record').remove();
		$('.identificador-nodo').attr('data-identificador','').text('');
		$('.polaridad').removeClass('polaridad-h').removeClass('polaridad-h').html('').hide();
		$('.elemento-discontinuo').remove();
		$('#nomenclatura').html('').hide();
		$('#mensaje-error').hide();
	}
}




escucharEventos();





//Obtener la conexión opuesta a la actual:
function opuesto(op){
	if(op=='ar'){opu='ab';}
	else if(op=='ab'){opu='ar';}
	else if(op=='iz'){opu='de';}
	else if(op=='de'){opu='iz';}
	return opu;
}



//Obtener la dirección en la que recorro el circuito:
function direccion(dp,da){
	//Útil para dibujar dirección de corriente después...
	//dp: Dirección previa
	//da: Dirección actual
	if(dp=='de' && da=='de'){ //Hacia la derecha
		
	} else if(dp=='iz' && da=='iz'){ //Hacia la izquierda

	} else if(dp=='ab' && da=='ab'){ //Hacia arriba

	} else if(dp=='ar'&& da=='ar'){ //Hacia arriba

	}
}





var dibujar={
	'polaridad':function(fila,columna,direccion){
		var p;
		var orntcn;
		var r=$('#tablero>.fila[data-pos="'+fila+'"]>.celda[data-pos="'+columna+'"]>img');
		if(direccion=='de'){
			p='+&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-';
			orntcn='polaridad-h';
		} else if(direccion=='iz'){
			p='-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+';
			orntcn='polaridad-h';
		} else if(direccion=='ab'){
			p='+-';
			orntcn='polaridad-v';
		} else if(direccion=='ar'){
			p='-+';
			orntcn='polaridad-v';
		} else {
			if(depuracion){
				console.log('Error: No se recibió una dirección válida.');
			}
		}
		$(r).siblings('.polaridad').addClass(orntcn).html(p).show(800);
	},
	'nodos':function(){
		circuito.limpiar();
		var cadaElemento = $('#tablero .celda img[data-tipo="nodo"]');
		var letra="@";
		var nomenclatura=[];
		var valorNodo=100;
		var contador=0;
		var cuenta=0;
		$.each(cadaElemento,function(ind,ele){
			var con = $(ele).attr('data-con');
			con = con.split(',');
			if(con.length>=3){
				contador=cuenta*800;
				cuenta++;
				var ASCII = letra.charCodeAt();
				ASCII=((ASCII+1 >= 65 && ASCII+1 <= 90)) ? ASCII+1 : ASCII; 
				letra=String.fromCharCode(ASCII);
				nomenclatura.push(letra);
				valorNodo--;
				$(ele).parent('.celda').append('<span class="glyphicon glyphicon-record nodo" style="position:absolute;font-size:20px;color:blue;top:15px;left:15px;display:none;" title="Nodo no trivial"></span>');
				$(ele).siblings('span.identificador-nodo').attr('data-identificador',letra).attr('data-valor',valorNodo).css('display','none').text(letra);
				setTimeout(function(){
					$(ele).siblings('.nodo').show(800);
					$(ele).siblings('.identificador-nodo').show(800);
				},contador);
				console.log(contador)
			}
		});
		//Defino el último nodo no trivial como 0:
		$('.celda>.identificador-nodo[data-identificador="'+letra+'"]').attr('data-identificador','0').attr('data-valor','0').text('0');
		nomenclatura.pop();
		nomenclatura.push('0');
		nomenclatura=nomenclatura.join(' > ');
		if(depuracion){
			console.log('Nomenclatura: '+nomenclatura);
		}
		$('#nomenclatura').html('<h3>Nomenclatura: '+nomenclatura+'</h3>').show('slow');
		return contador+800;
	}
}





function empezar(){
	var comprobacion=circuito.comprobar();
	if(comprobacion){
		var t=dibujar.nodos();
	} else {
		return;
	}
	setTimeout(function(){
		//pru();
		circuito.recorrer();
	},t);
}






/*
function pru(){
	var cadaNodo = $('#tablero .celda img[data-tipo="nodo"]');
	var recorridos=[];
	$.each(cadaNodo,function(){
		var lasConexiones = $(this).attr('data-con');
		lasConexiones=lasConexiones.split(',');
		var buscaFila;
		var buscaColumna;
		var buscoCelda;
		if(lasConexiones.length>=3){ //Si al menos tres conexiones, nodo no trivia. Entro.
			var identificadorNodoInicial = $(this).siblings('.identificador-nodo').attr('data-identificador');
			var valorNodoInicial = $(this).siblings('.identificador-nodo').attr('data-valor');
			console.log('Valor de nodo: '+valorNodoInicial);
			var cel = this.parentElement;
			var fi = posicion.fila(cel);
			var co = posicion.columna(cel);
			var fila;
			var columna;
			$.each(lasConexiones,function(ind,ele){
				if(ele=='ar'){
					fila=fi-1;
					columna=co;
				} else if(ele=='ab'){
					fila=fi+1;
					columna=co;
				} else if(ele=='iz'){
					columna=co-1;
					fila=fi;
				} else if(ele=='de'){
					columna=co+1;
					fila=fi;
				}
				var ruta=ele;
				var encuentroNodo=false;
				var i=0;
				console.log('antes de entrar al bucle');
				var rstncs=[];
				do {
					var fil=fila;
					var col=columna;
					console.log('fila: '+fil+'_ columna: '+col);
					var elElemento = $('#tablero>.fila[data-pos="'+fila+'"]>.celda[data-pos="'+columna+'"]>img');
					if(elElemento.length>0){
						var tipoElmnto = $(elElemento).attr('data-tipo');
					
						if(tipoElmnto=='R'){
							rstncs.push(fila+'-'+columna+'/'+ruta);
						}
						console.log(elElemento);
						var cnxsElmnto = $(elElemento).attr('data-con');
						var cadena = 'ubicacion='+fila+'-'+columna+'/tipo='+tipoElmnto+'/conexiones='+cnxsElmnto;
						cnxsElmnto=cnxsElmnto.split(',');
						if(cnxsElmnto.length>=3){ //Nodo encontrado, detengo la búsqueda
							var identificadorNodoFinal = $(elElemento).siblings('.identificador-nodo').attr('data-identificador');
							var valorNodoFinal = $(elElemento).siblings('.identificador-nodo').attr('data-valor');
							//Comprobación para evitar repetir mismo recorrido en sentido contrario:
							var nuevoRecorrido=true;
							$.each(recorridos,function(ii,obj){
								if(obj.identificadorNodoInicial==identificadorNodoFinal && obj.identificadorNodoFinal==identificadorNodoInicial){
									nuevoRecorrido=false;
									return false;
								}
							});
							if(nuevoRecorrido){
								var esteRecorrido={'identificadorNodoInicial':identificadorNodoInicial,'identificadorNodoFinal':identificadorNodoFinal,'valorNodoInicial':valorNodoInicial,'valorNodoFinal':valorNodoFinal,'resistencias':rstncs}
								recorridos.push(esteRecorrido);
							}
							i=100;
						} else {
							var yaEntré=false;
							$.each(cnxsElmnto,function(i,e){
								//console.log('............'+e+'-')
								var ladoOpuesto=opuesto(ruta);
								//console.log('esta ruta: '+e)
								//console.log('lado opuesto: '+ladoOpuesto);
								//console.log('ruta: '+ruta);
								if(ladoOpuesto!=e && !yaEntré){ //Sólo sigo la otra ruta, no me devuelvo...
									yaEntré=true; //Es válido porque anteriormente se detiene la búsqueda si ha más de dos conexiones...No funcionaría si siguiera buscando con más de dos conexiones...
									if(e=='ar'){
										fila=fil-1;
									} else if(e=='ab'){
										//console.log('aumento fila');
										fila=fil+1;
									} else if(e=='iz'){
										//console.log('disminuyo columna')
										columna=col-1;
									} else if(e=='de'){
										columna=col+1;
									}
									ruta=e
								}
							});
						}
						console.log('dentro del bucle: '+cadena);
					} else {
						i=100;
						console.log('Error 73'); //Esto no debería ocurrir nunca,previamente se debió verificar la continuidad del circuito
					}
					i++;
					console.log(i)
				//} while (!encuentroNodo && i<10); //Temp---------
				} while (i<10); //Temp---------
				console.log(fila+'_'+columna);
			});
		}
	});
	var contador=0;
	$.each(recorridos,function(ind,ele){
		//var cuenta=(ind*800)+contador;
		if(ind==0){
			cuenta=contador;
		} else {
			cuenta=contador+800;
		}
		$.each(ele.resistencias,function(i,e){
			var r=e.split('/');
			var d=r[1];
			var pos=r[0].split('-');
			var f=pos[0];
			var c=pos[1];
			var vni=parseInt(ele.valorNodoInicial);
			var vnf=parseInt(ele.valorNodoFinal);
			//console.log(ele.valorNodoInicial)
			if(vni<vnf){
				d=opuesto(d);
			}
			contador=(i*800)+cuenta;
			setTimeout(function(){
				dibujar.polaridad(f,c,d);
			},contador);
			//console.log(contador)
		});
		console.log(ele);
	});
}

*/

