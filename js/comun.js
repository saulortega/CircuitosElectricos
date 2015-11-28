var depuracion=true;
var origen; //Si un elemento es arrastrado desde la caja o desde el propio tablero
var mover; //Si se debe borrar el origen, en caso de ser movimiento desde el mismo tablero.
var columnaOrigen;
var filaOrigen;
var columnaDestino;
var filaDestino;





function detectarNavegador(){
	//alert("Estas utilizando "+navigator.vendor+" "+navigator.appVersion);
	//console.log(navigator);
	var Chrome=new RegExp(/Chrome/i);
	var Google=new RegExp(/Google/i);
	var encuentroChrome=Chrome.test(navigator.appVersion);
	var encuentroGoogle=Google.test(navigator.vendor);
	if(!encuentroChrome && !encuentroGoogle){
		$('#aviso-navegador').show();
	}
}
detectarNavegador();



function escucharEventos(){
	var elementos = document.querySelectorAll('.arrastrable');
	[].forEach.call(elementos, function(elem) {
		elem.addEventListener('dragstart', arrastrar.inicio, false);
		elem.addEventListener('dragend', arrastrar.fin, false);
	});
	var celdas = document.querySelectorAll('.celda');
	[].forEach.call(celdas, function(celda) {
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
//var elementoDiscontinuo='<span class="glyphicon glyphicon-remove elemento-discontinuo"></span>';




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
		tipoElemento = this.getAttribute('data-tipo');
		conexiones = this.getAttribute('data-con');
		polaridad = this.getAttribute('data-pol');
	},
	'sobreCelda':function(e){
		e.preventDefault(); //Necesario
		e.stopPropagation(); //Necesario
		this.style.border = '2px dashed orange';
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
	/*'calcular':function(celda){ //Esta acción sobra, reempazar por la de Elemento....
		var columna = posicion.columna(celda);
		if(columna==1 || columna==20){
			var pos = 'V';
		} else {
			var pos = 'H';
		}
		console.log(pos);
		var aa = posicion.esquina(celda);
		console.log(aa);
	},*/
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
		dibujo=dibujo+'<span class="nombre-elemento" style="display:none"></span>';
		dibujo=dibujo+'<span class="valores"></span>';
		dibujo=dibujo+'<span class="polaridad" style="display:none"></span>';
		if(tipoElemento=='nodo'){
			dibujo=dibujo+'<span class="identificador-nodo"></span>';
		}
		celda.innerHTML = dibujo;
		//posicion.calcular(celda);
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
		} else {
			if(depuracion){
				console.log('Error: Tipo de elemento desconocido: '+el);
			}
		}
		var celda = self.parentElement;
		var fi = posicion.fila(celda);
		var co = posicion.columna(celda);
		console.log('fila: '+fi+', columna: '+co)
		$('#valores-'+el+' input[name="fila"]').val(fi);
		$('#valores-'+el+' input[name="columna"]').val(co);
		$('#valores-'+el).modal('show');
	},
	'unidades':function(tipo,unidad){
		if(tipo=='R'){
			var t='resistencia';
			var u='Ω';
		} else if(tipo=='I'){
			var t='corriente';
			var u='A';
		} else if(tipo=='V'){
			var t='voltaje';
			var u='V';
		}
		u=unidad+u;
		$('#valores-'+t).find('.la-unidad').text(u);
		$('#valores-'+t+' input[name="unidad"]').val(unidad);
		
	},
	'guardar':function(tipo){
		var fil = $('#valores-'+tipo+' input[name="fila"]').val();
		var col = $('#valores-'+tipo+' input[name="columna"]').val();
		var uni = $('#valores-'+tipo+' input[name="unidad"]').val();
		if(uni===undefined){uni='';}
		var val = $('#valor-'+tipo).val();
		val=val.replace(' ','');
		if(isNumeric(val)){
			val=parseFloat(val);
		} else {
			alert('Escriba un valor numérico.');
			return;
		}

		if(tipo=='resistencia'){
			var u=uni+'Ω';
		} else if(tipo=='corriente'){
			var u=uni+'A';
		} else if(tipo=='voltaje'){
			var u=uni+'V';
		}

		var unidadBasica=val;
		if(uni=='K'){
			unidadBasica=val*1000;
		} else if(uni=='m'){
			unidadBasica=val/1000;
		} else if(uni=='μ'){
			unidadBasica=val/1000000;
		}

		$('#tablero>div.fila[data-pos="'+fil+'"]>div.celda[data-pos="'+col+'"]>img').attr('data-val',unidadBasica).siblings('span.valores').text(val+' '+u);
		$('#valores-'+tipo).modal('hide');
		elemento.limpiar();
	},
	/*'guardarR':function(){ //Esta será reemplazada por anerior...
		var fi = $('#valores-resistencia input[name="fila"]').val();
		var co = $('#valores-resistencia input[name="columna"]').val();
		var uni = $('input[name="unidad"][id="_"]').prop('checked');
		var uniK = $('input[name="unidad"][id="K"]').prop('checked');
		if(uni){
			var un = 'Ω';
			var val = $('#valores-resistencia input[name="valor"]').val();
			var unidadBasica = val;
		} else if(uniK){
			var un = 'KΩ';
			var val = $('#valores-resistencia input[name="valor"]').val();
			var unidadBasica = val*1000;
		} else {
			alert('Seleccione las unidades de medida.');
			return;
		}
		$('#tablero>div.fila[data-pos="'+fi+'"]>div.celda[data-pos="'+co+'"]>img').attr('data-val',unidadBasica).siblings('span.valores').text(val+' '+un);
		$('#valores-resistencia input[name="fila"]').val(fi);
		$('#valores-resistencia input[name="columna"]').val(co);
		$('#valores-resistencia').modal('hide');
		elemento.limpiar();
	},*/
	'limpiar':function(){
		$('input[type="text"]').val('');
		$('input[type="hidden"]').val('');
		$('#valores-resistencia').find('.la-unidad').text('Ω');
		$('#valores-corriente').find('.la-unidad').text('A');
		$('#valores-voltaje').find('.la-unidad').text('V');
		//$('input[type="radio"]').prop('checked',false).parent('label').removeClass('active');
		//$('input[type="checkbox"]').prop('checked',false);
	}
}




function aviso(texto){
	$('#mensaje-error').html(texto).show('slow');;
}




var recorridos;
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
		var accion = accion || false;
		var cadaNodo = $('#tablero .celda img[data-tipo="nodo"]');
		recorridos=[];
		$.each(cadaNodo,function(){
			var lasConexiones = $(this).attr('data-con');
			lasConexiones=lasConexiones.split(',');
			var buscaFila;
			var buscaColumna;
			var buscoCelda;
			if(lasConexiones.length>=3){
				var cel = this.parentElement;
				var fi = posicion.fila(cel);
				var co = posicion.columna(cel);
				var fila;
				var columna;
				var identificadorNodoInicial = fi+'-'+co;
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
					var ftsCrnt=[];
					var ftsVltj=[];
					var encuentroElemento=false;
					do {
						var fil=fila;
						var col=columna;
						console.log('fila: '+fil+'_ columna: '+col);
						var elElemento = $('#tablero>.fila[data-pos="'+fila+'"]>.celda[data-pos="'+columna+'"]>img');
						if(elElemento.length>0){
							var tipoElmnto = $(elElemento).attr('data-tipo');
							var plrddElemento = $(elElemento).attr('data-pol');
							//var orientacionElmnto = $(elElemento).attr('data-ori');
							if(tipoElmnto=='R'){
								rstncs.push(fila+'-'+columna+'/'+ruta);
								//rstncs.push(fila+'-'+columna+'/'+orientacionElmnto);
							} else if(tipoElmnto=='I'){
								ftsCrnt.push(fila+'-'+columna+'/'+ruta+'/'+plrddElemento);
							} else if(tipoElmnto=='V'){
								ftsVltj.push(fila+'-'+columna+'/'+ruta+'/'+plrddElemento);
							}
							if(tipoElmnto!='nodo'){
								encuentroElemento=true;
							}
							console.log(elElemento);
							var cnxsElmnto = $(elElemento).attr('data-con');
							var cadena = 'ubicacion='+fila+'-'+columna+'/tipo='+tipoElmnto+'/conexiones='+cnxsElmnto;
							cnxsElmnto=cnxsElmnto.split(',');
							if(cnxsElmnto.length>=3){ //Nodo encontrado, detengo la búsqueda
								//var identificadorNodoFinal = $(elElemento).siblings('.identificador-nodo').attr('data-identificador');
								var identificadorNodoFinal = fila+'-'+columna;
								//var valorNodoFinal = $(elElemento).siblings('.identificador-nodo').attr('data-valor');
								//Comprobación para evitar repetir mismo recorrido en sentido contrario:
								var nuevoRecorrido=true;
								$.each(recorridos,function(ii,obj){
									if(obj.nuevoRecorrido){
										if(obj.identificadorNodoInicial==identificadorNodoFinal && obj.identificadorNodoFinal==identificadorNodoInicial){
											nuevoRecorrido=false;
											return false;
										}
									}
								});
								/*if(nuevoRecorrido){
									//var ASCII = identificadorNodoInicial.charCodeAt(); //----------
									//ASCII=((ASCII+1 >= 65 && ASCII+1 <= 90)) ? ASCII+1 : ASCII;  //----------
									//identificadorNodoInicial=String.fromCharCode(ASCII); //----------
									//nomenclatura.push(identificadorNodoInicial); //----------
									//var esteRecorrido={'identificadorNodoInicial':identificadorNodoInicial,'identificadorNodoFinal':identificadorNodoFinal,'valorNodoInicial':valorNodoInicial,'valorNodoFinal':valorNodoFinal,'resistencias':rstncs,'fuentesCorriente':ftsCrnt,'fuentesVoltaje':ftsVltj}
									var esteRecorrido={'identificadorNodoInicial':identificadorNodoInicial,'identificadorNodoFinal':identificadorNodoFinal,'valorNodoInicial':-1,'valorNodoFinal':-1,'resistencias':rstncs,'fuentesCorriente':ftsCrnt,'fuentesVoltaje':ftsVltj}

									recorridos.push(esteRecorrido);
									
								}*/
								//2015-11-22 anterior cambiado por siguiente:
								var esteRecorrido={'identificadorNodoInicial':identificadorNodoInicial,'identificadorNodoFinal':identificadorNodoFinal,'valorNodoInicial':-1,'valorNodoFinal':-1,'resistencias':rstncs,'fuentesCorriente':ftsCrnt,'fuentesVoltaje':ftsVltj,'nuevoRecorrido':nuevoRecorrido}
								recorridos.push(esteRecorrido);
								//Fin 2015-11-22
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
					} while (i<20);
					//console.log(fila+'_'+columna);
				});
			}
		});
	},
	'limpiar':function(){
		$('.icono-nodo').remove();
		$('.identificador-nodo').remove();
		$('.elemento-discontinuo').remove();
		$('.identificador-nodo').attr('data-identificador','').text('');
		$('.polaridad').removeClass('polaridad-h').removeClass('polaridad-v').html('').hide();
		$('#nomenclatura').html('').hide();
		$('#ecuaciones').html('').hide();
		$('#mensaje-error').hide();
		$('.nombre-elemento').removeClass('horizontal').removeClass('vertical').html('').hide();
		$('button[id^="paso-"]').prop('disabled',false).hide();
	}
}





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
				console.log('Error: No se recibió una dirección válida: '+direccion);
			}
		}
		$(r).siblings('.polaridad').addClass(orntcn).html(p).show(800);
	},
	'nomenclatura':function(contadorInicial){
		var contador = contadorInicial || 0;
		nomenclatura.push('0');
		nomenclatura=nomenclatura.join(' > ');
		if(depuracion){
			console.log('Nomenclatura: '+nomenclatura);
		}
		setTimeout(function(){
			$('#mensaje-inicial').remove();
			$('#nomenclatura').html('<h3><strong>Nomenclatura:</strong> <span class="text-nowrap">'+nomenclatura+'</span></h3>').slideDown();
		},contador);
		return contador+1000;
	},
	'ecuacion':function(contadorInicial){
		var contador = contadorInicial || 0;
		if(depuracion){
			console.log('Ecuaciones:');
			console.log(ecuacionesNodos);
		}
		if(ecuacionesNodos){
			var ecu='';
			$.each(ecuacionesNodos,function(ind,ele){
				if(ind!=0){
					var ec=ele.replace(/V([a-zA-Z0])/g,"V<small>$1</small>");
					ec=ec.replace(/R([0-9]+)/g,"R<small>$1</small>");
					ec=ec.replace(/I([0-9]+)/g,"I<small>$1</small>");
					ec=ec+' = 0';
					ec='<span class="text-nowrap">'+ec+'<span>';
					var nd='<strong>&nbsp;&nbsp;&nbsp;Nodo '+ind+': </strong>';
					ecu=ecu+'<h4>'+nd+ec+'</h4>';
				}
			});
			ecu='<hr><h3><strong>Ecuaciones</strong></h3>'+ecu;
			setTimeout(function(){
				$('#mensaje-inicial').remove();
				$('#ecuaciones').html(ecu).slideDown(1000);
			},contador);
			return contador+1000;
		} else {
			return false;
		}
	}
	/*'nodos':function(){
		circuito.limpiar();
		var cadaElemento = $('#tablero .celda img[data-tipo="nodo"]');
		var letra="@";
		var nomenclatura=[];
		var valorNodo=100;
		var contador=0;
		var cuenta=0;
		$.each(cadaElemento,function(ind,ele){
			var con = $(ele).attr('data-con');
			var her = $(this).attr('data-her');
			//alert(her); //Aquí voy --------------------------------------------------
			con = con.split(',');
			if(con.length>=3){
				if(her){ //Si es el mismo nodo que otro... Verificar --------------------
					$(ele).parent('.celda').append('<span class="glyphicon glyphicon-record nodo" style="position:absolute;font-size:20px;color:blue;top:15px;left:15px;display:none;" title="Nodo no trivial"></span>');
					$(ele).siblings('span.identificador-nodo').attr('data-identificador',her).attr('data-valor',valorNodo).css('display','none').text(her);
					$(ele).siblings('.nodo').show(800);
					$(ele).siblings('.identificador-nodo').show(800);
				} else {
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
				}
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
	}*/
}





function empezar(paso){
	var paso = paso || false;
	if(paso){
		var t=0;
		paso=parseInt(paso);
		if(isNaN(paso)){
			alert('¡Ups! Hice algo mal...');
			return;
		} else if(paso==1){
			t=nodos.nombresElementos();
		} else if(paso==2){
			t=nodos.dibujar(0);
		} else if(paso==3){
			t=dibujar.nomenclatura(0);
		} else if(paso==4){
			t=nodos.polaridadResistencias(0);
		} else if(paso==5){
			t=dibujar.ecuacion(0);
		}
		t=t+500;
		var sigPaso=paso+1;
		$('#paso-'+paso).prop('disabled',true);
		$('#btnEmpezar').prop('disabled',true);
		setTimeout(function(){
			$('#paso-'+paso).prop('disabled',false).hide();
			$('#btnEmpezar').prop('disabled',false);
			$('#paso-'+sigPaso).slideDown(1000);
		},t);
	} else {
		var pp = $('#comoEmpezarPP').prop('checked');
		circuito.recorrer();
		nodos.identificar();
		var comprobacion=circuito.comprobar();
		if(comprobacion){
			if(pp){
				$('#paso-1').slideDown(800);
			} else {
				var t1=nodos.nombresElementos();
				var t2=nodos.dibujar(t1);
				var t3=dibujar.nomenclatura(t2+1000);
				var t4=nodos.polaridadResistencias(t3+1000);
				var t5=dibujar.ecuacion(t4+1000);
				$('#btnEmpezar').prop('disabled',true);
				$('button[id^="paso-"]').prop('disabled',true);
				$('#paso-1').slideDown(1000);
				setTimeout(function(){
					$('#paso-1').hide();
					$('#paso-2').slideDown(1000);
				},t1);
				setTimeout(function(){
					$('#paso-2').hide();
					$('#paso-3').slideDown(1000);
				},t2);
				setTimeout(function(){
					$('#paso-3').hide();
					$('#paso-4').slideDown(1000);
				},t3);
				setTimeout(function(){
					$('#paso-4').hide();
					$('#paso-5').slideDown(1000);
				},t4);
				setTimeout(function(){
					$('#paso-5').hide();
					$('button[id^="paso-"]').prop('disabled',false);
					$('#btnEmpezar').prop('disabled',false);
				},t5+1000);
			}
		} else {
			return;
		}
	
	}
}

/*
var paso = $('#paso').val();
			paso=parseInt(paso);
			if(isNaN(paso)){
				alert('¡Ups! Hice algo mal...');
				return;
			}*/



var ubiNodos; //Coordenadas
var ideNodos; //Identificador
var valNodos; //Valor
var nodosUnicos;
var nodosIdentificadores;
var nodosValores;



var ecuacionesNodos;
var nomenclatura;



var iconoNodo='<span class="glyphicon glyphicon-certificate icono-nodo" title="Nodo"></span>';
var identificadorNodo='<span class="identificador-nodo"></span>'; // data-identificador="" data-valor=""
var nodos = {
	'identificar':function(){
		ubiNodos=[];
		ideNodos=[];
		valNodos=[];
		nodosUnicos=[];
		var pendientesI=[];
		var pendientesF=[];
		$.each(recorridos,function(ind,ele){
			if(ele['nuevoRecorrido']){
				var buscoNodoI=ubiNodos.indexOf(ele['identificadorNodoInicial']);
				var buscoNodoF=ubiNodos.indexOf(ele['identificadorNodoFinal']);
				if(buscoNodoI == -1){
					ubiNodos.push(ele['identificadorNodoInicial']);
				}
				if(buscoNodoF == -1){
					ubiNodos.push(ele['identificadorNodoFinal']);
				}

				var encontradoI=false;
				var encontradoF=false;
				var idEncontradoI,idEncontradoF;
				$.each(nodosUnicos,function(i,e){
					var aI=new RegExp(ele['identificadorNodoInicial']);
					//console.log('1I: '+aI);
					var bI=aI.test(e);
					//console.log('2I: '+bI);
					
					var aF=new RegExp(ele['identificadorNodoFinal']);
					//console.log('1F: '+aF)
					var bF=aF.test(e);
					//console.log('2F: '+bF)
					if(bI){
						encontradoI=true;
						idEncontradoI=i;
					}
					if(bF){
						encontradoF=true;
						idEncontradoF=i;
					}
				});
				if(ele['resistencias'].length==0 && ele['fuentesCorriente'].length==0 && ele['fuentesVoltaje'].length==0){
					if(encontradoI && !encontradoF){
						nodosUnicos[idEncontradoI]=nodosUnicos[idEncontradoI]+','+ele['identificadorNodoFinal'];
					}else if(!encontradoI && encontradoF){
						nodosUnicos[idEncontradoF]=nodosUnicos[idEncontradoF]+','+ele['identificadorNodoInicial'];
					} else if(!encontradoI && !encontradoF){
						nodosUnicos.push(ele['identificadorNodoInicial']);
						nodosUnicos.push(ele['identificadorNodoFinal']);
					} else if(encontradoI && encontradoF && idEncontradoI!=idEncontradoF){ //Si se encuentran en diferentes lugares, reorganizarlos...
						var buscoNI=nodosUnicos.indexOf(ele['identificadorNodoInicial']);
						var buscoNF=nodosUnicos.indexOf(ele['identificadorNodoFinal']);
						if(buscoNI>=0){
							nodosUnicos.splice(buscoNI,1);
							pendientesI.push(ele['identificadorNodoInicial']);
						} else if(buscoNF>=0){
							nodosUnicos.splice(buscoNF,1);
							pendientesF.push(ele['identificadorNodoFinal']);
						}
						//¿Será posible que haya más de uno y que los elimine todos (1-2,3-4)? Revisar...
					}
				} else {
					/*if(!encontradoI && !encontradoF){
						nodosUnicos.push(ele['identificadorNodoInicial']);
						nodosUnicos.push(ele['identificadorNodoFinal']);
					}*/
					//Verificar esto...
					if(!encontradoI){
						nodosUnicos.push(ele['identificadorNodoInicial']);
					}
					if(!encontradoF){
						nodosUnicos.push(ele['identificadorNodoFinal']);
					}
				}
			}
		});

		$.each(pendientesI,function(ind,ele){
			$.each(recorridos,function(i,e){
				if(e['nuevoRecorrido']){
					if(e['identificadorNodoInicial']==ele && e['resistencias'].length==0 && e['fuentesCorriente'].length==0 && e['fuentesVoltaje'].length==0){
						var a=new RegExp(e['identificadorNodoFinal']);
						$.each(nodosUnicos,function(ii,ee){
							var b=a.test(ee);
							if(b){
								nodosUnicos[ii]=nodosUnicos[ii]+','+ele;
								var c=nodosUnicos.indexOf(ele);
								if(c>=0){
									nodosUnicos.splice(c,1);//Esto no debería ser necesario, pero es necesario...
								}
							}
						});
					}
				}
			});
		});
		$.each(pendientesF,function(ind,ele){
			$.each(recorridos,function(i,e){
				if(e['nuevoRecorrido']){
					if(e['identificadorNodoFinal']==ele && e['resistencias'].length==0 && e['fuentesCorriente'].length==0 && e['fuentesVoltaje'].length==0){
						var a=new RegExp(e['identificadorNodoInicial']);
						$.each(nodosUnicos,function(ii,ee){
							var b=a.test(ee);
							if(b){
								nodosUnicos[ii]=nodosUnicos[ii]+','+ele;
								var c=nodosUnicos.indexOf(ele);
								if(c>=0){
									nodosUnicos.splice(c,1);//Esto no debería ser necesario, pero es necesario...
								}
							}
						});
					}
				}
			});
		});
	},
	'polaridadResistencias':function(contadorInicial){
		var contadorInicial = contadorInicial || 0;
		var contador=contadorInicial;
		//Empieza ecuación:
		ecuacionesNodos=new Object;
		var recorridosEcTemp=new Object;
		//Termina ecuación.
		$.each(recorridos,function(ind,ele){
			var vI=ele['valorNodoInicial'];
			var vF=ele['valorNodoFinal'];
			var plrddCrnt=false;
			//Empieza obtención de nombre para ecuación:
			var nombresCrnt='';
			//Termina obtención de nombre
			if(ele['fuentesCorriente'].length>0){
				//Tiene en cuenta sólo la primera. ¿Qué pasaría si hubiera más de una?
				var fntCrnt=ele['fuentesCorriente'][0];
				fntCrnt=fntCrnt.split('/');
				plrddCrnt=fntCrnt[2];
				var drccnCrnt=fntCrnt[1];
				//Empieza obtención de nombre para ecuación:
				var b=fntCrnt[0].split('-');
				var fila=b[0];
				var columna=b[1];
				nombresCrnt = $('#tablero>.fila[data-pos="'+fila+'"]>.celda[data-pos="'+columna+'"]>img').attr('data-nom');
				//Termina obtención de nombre
			}
			//////////////if(ele['nuevoRecorrido']){
				/*if (vF==vI){
					aviso('Se encontraron algunas resistencias en cortocircuito. Verifique el circuito.');
				}*/
				var nombresRstcs=[];
				if(ele['resistencias'].length>0){
					//var fcI=ele['identificadorNodoInicial'].split('-');
					//var fcF=ele['identificadorNodoFinal'].split('-');
					//var fI=parseInt(fcI[0]);
					//var cI=parseInt(fcI[1]);
					//var fF=parseInt(fcF[0]);
					//var cF=parseInt(fcF[1]);
					$.each(ele['resistencias'],function(i,e){
						var a=e.split('/');
						var b=a[0].split('-');
						var fila=b[0];
						var columna=b[1];
						var direccion=a[1];
						if(vI<vF){
							direccion=opuesto(direccion);
						}
						if(plrddCrnt){
							if((drccnCrnt=='iz' ||drccnCrnt=='ar') && plrddCrnt=='+-'){
								direccion=opuesto(direccion);
							} else if((drccnCrnt=='de' ||drccnCrnt=='ab') && plrddCrnt=='-+'){
								direccion=opuesto(direccion);
							}
						}
						if(ele['nuevoRecorrido']){
							setTimeout(function(){
								dibujar.polaridad(fila,columna,direccion);
							},contador);
							contador=contador+800;
						}
						//Empieza obtención de nombres para ecuación
						var nom = $('#tablero>.fila[data-pos="'+fila+'"]>.celda[data-pos="'+columna+'"]>img').attr('data-nom');
						nombresRstcs.push(nom);
						//Termina obtención de nombres
					});
					//Empieza obtención de nombres para ecuación
					nombresRstcs=nombresRstcs.join('+');
					//Termina obtención de nombres
				}
			//////////////}
			//Empieza obtención de nombres para ecuación
			//var explotoI=ele['identificadorNodoInicial'].split('-');
			//var filaInicial=parseInt(explotoI[0]);
			//var columnaInicial=parseInt(explotoI[1]);
			//var explotoF=ele['identificadorNodoFinal'].split('-');
			//var filaFinal=parseInt(explotoF[0]);
			//var columnaFinal=parseInt(explotoF[1]);
			//var nomNodoInicial = $('#tablero>.fila[data-pos="'+filaInicial+'"]>.celda[data-pos="'+columnaInicial+'"]>img').attr('data-nom');
			var idI=ele['identificadorNodoInicial'];
			var idF=ele['identificadorNodoFinal'];
			var nomNodoInicial=nodosIdentificadores[idI];
			var nomNodoFinal=nodosIdentificadores[idF];
			var ec;
			if(nombresRstcs.length>3){
				nombresRstcs='('+nombresRstcs+')';
			}
			var signo='+';
			if(vI>vF /*&& !ecuacionesNodos.nomNodoInicial*/){
				if(!plrddCrnt && nombresRstcs){
					ec='(V'+nomNodoInicial+'-V'+nomNodoFinal+')/'+nombresRstcs;
					signo='-';
				} else if(plrddCrnt && nombresCrnt){
					ec=nombresCrnt;
					if((drccnCrnt=='iz' || drccnCrnt=='ar') && plrddCrnt=='-+'){
						signo='-';
					} else if((drccnCrnt=='de' || drccnCrnt=='ab') && plrddCrnt=='+-'){
						signo='-';
					}
				}
				/*var elNodo=nomNodoInicial;
				var nodoNodo=nomNodoInicial+'-'+nomNodoFinal;
				if(!ele['nuevoRecorrido']){
					console.log('repetidoooooooooooo')
				}*/
				if(ele['nuevoRecorrido']){
					var elNodo=nomNodoInicial;
					var nodoNodo=nomNodoInicial+'-'+nomNodoFinal;
				} else {
					var elNodo=nomNodoFinal;
					var nodoNodo=nomNodoFinal+'-'+nomNodoInicial;
					if(signo=='-'){signo='+'}
					else if(signo=='+'){signo='-'}
				}
			} else if(vI<vF /*&& !ecuacionesNodos.nomNodoFinal*/){
				if(!plrddCrnt && nombresRstcs){
					ec='(V'+nomNodoFinal+'-V'+nomNodoInicial+')/'+nombresRstcs;
					signo='-';
				} else if(plrddCrnt && nombresCrnt){
					ec=nombresCrnt;
					if((drccnCrnt=='iz' || drccnCrnt=='ar') && plrddCrnt=='+-'){
						signo='-';
					} else if((drccnCrnt=='de' || drccnCrnt=='ab') && plrddCrnt=='-+'){
						signo='-';
					}
				}
				/*
				var elNodo=nomNodoFinal;
				var nodoNodo=nomNodoFinal+'-'+nomNodoInicial;*/
				if(ele['nuevoRecorrido']){
					var elNodo=nomNodoFinal;
					var nodoNodo=nomNodoFinal+'-'+nomNodoInicial;
				} else {
					var elNodo=nomNodoInicial;
					var nodoNodo=nomNodoInicial+'-'+nomNodoFinal;
					if(signo=='-'){signo='+'}
					else if(signo=='+'){signo='-'}
				}
			}
			if(ec){
				if(recorridosEcTemp[nodoNodo]){
					//Todo bien...
				} else {
					recorridosEcTemp[nodoNodo]=ec; // ---- falta signo....
				}
				console.log(recorridosEcTemp);
				if(ecuacionesNodos[elNodo]){
					ec=ecuacionesNodos[elNodo]+' '+signo+' '+ec;
				} else {
					if(signo=='-'){
						ec=signo+ec;
					}
				}
				ecuacionesNodos[elNodo]=ec;
			}
			//Termina obtención de nombres
		});
		return contador;
	},
	'nombresElementos':function(contadorInicial){
		var contador = contadorInicial || 0;
		var incR=0;
		var lasResistencias = $('#tablero img[data-tipo="R"]');
		$.each(lasResistencias,function(ind,ele){
			incR++;
			var r='R'+incR;
			var o=$(ele).attr('data-ori');
			if(o=='v'){
				$(ele).siblings('.nombre-elemento').addClass('vertical');
			} else {
				$(ele).siblings('.nombre-elemento').addClass('horizontal');
			}
			$(ele).attr('data-nom',r);
			setTimeout(function(){
				$(ele).siblings('.nombre-elemento').text(r).show('slow');
			},contador);
			contador=contador+800;
		});
		var incI=0;
		var lasCorrientes = $('#tablero img[data-tipo="I"]');
		$.each(lasCorrientes,function(ind,ele){
			incI++;
			var r='I'+incI;
			var o=$(ele).attr('data-ori');
			if(o=='v'){
				$(ele).siblings('.nombre-elemento').addClass('vertical');
			} else {
				$(ele).siblings('.nombre-elemento').addClass('horizontal');
			}
			$(ele).attr('data-nom',r);
			setTimeout(function(){
				$(ele).siblings('.nombre-elemento').text(r).show('slow');
			},contador);
			contador=contador+800;
		});
		return contador;
	},
	'ecuaciones':function(){

	},
	'dibujar':function(contadorInicial){ //Esta función dería tener otro nombre, porque sirve también para asignar los valores d elas resistencias y servirá para otras cosas....
		var contador = contadorInicial || 0;
		//var contador=contadorInicial;
		//Obtener el que tenga más puntos (inexacto, según la longitud de la cadena):
		nodosValores=new Object;
		nodosIdentificadores=new Object;
		var elCero={'indice':0,'longitud':0};
		$.each(nodosUnicos,function(indi,elem){
			if(elem.length>=elCero.longitud){
				elCero.indice=indi;
				elCero.longitud=elem.length;
			}
		});
		elCero=elCero.indice;
		//Asignar Valores e identificadores:
		nomenclatura=[];
		var letraNodo="@";
		var valorNodo=100;
		//var contador=0;
		//var cuenta=0;
		$.each(nodosUnicos,function(ind,ele){
			//contador=cuenta*800;
			//cuenta++;
			//contador=contador+800;
			if(ind==elCero){
				var cadaPunto=ele.split(',');
				$.each(cadaPunto,function(i,e){
					contador=contador+800;
					var estePunto=e.split('-');
					var fila=estePunto[0];
					var columna=estePunto[1];
					var celda=$('#tablero>.fila[data-pos="'+fila+'"]>.celda[data-pos="'+columna+'"]');
					$(celda).append(iconoNodo);
					$(celda).append(identificadorNodo);
					$(celda).children('.identificador-nodo').html('0').attr('data-identificador','0').attr('data-valor','0');
					setTimeout(function(){
						$(celda).children('.icono-nodo').show(800);
						$(celda).children('.identificador-nodo').show(800);
					},contador);
					//Valores e identificadores:
					nodosValores[e]=0;
					nodosIdentificadores[e]=0;
					//Termina valores e identicadores.
					//Empieza asignación de valores
					$.each(recorridos,function(iii,eee){
						//if(eee['nuevoRecorrido']){
							if(e==eee['identificadorNodoInicial']){
								recorridos[iii].valorNodoInicial=0;
							} else if(e==eee['identificadorNodoFinal']){
								recorridos[iii].valorNodoFinal=0;
							}
							//No salir del each (return false) porque se repiten por cada conexión de nodo...
						//}
					});
					//Termina asignación de valores
				});
			} else {
				var ASCII = letraNodo.charCodeAt();
				ASCII=((ASCII+1 >= 65 && ASCII+1 <= 90)) ? ASCII+1 : ASCII; 
				letraNodo=String.fromCharCode(ASCII);
				valorNodo--;
				nomenclatura.push(letraNodo);
				var cadaPunto=ele.split(',');
				$.each(cadaPunto,function(i,e){
					contador=contador+800;
					var estePunto=e.split('-');
					var fila=estePunto[0];
					var columna=estePunto[1];
					var celda=$('#tablero>.fila[data-pos="'+fila+'"]>.celda[data-pos="'+columna+'"]');
					$(celda).append(iconoNodo);
					$(celda).append(identificadorNodo);
					$(celda).children('.identificador-nodo').html(letraNodo).attr('data-identificador',letraNodo).attr('data-valor',valorNodo);
					setTimeout(function(){
						$(celda).children('.icono-nodo').show(800);
						$(celda).children('.identificador-nodo').show(800);
					},contador);
					//Valores e identificadores:
					nodosValores[e]=valorNodo;
					nodosIdentificadores[e]=letraNodo;
					//Termina valores e identicadores.
					//Empieza asignación de valores
					$.each(recorridos,function(iii,eee){
						//if(eee['nuevoRecorrido']){
							if(e==eee['identificadorNodoInicial']){
								recorridos[iii].valorNodoInicial=valorNodo;
							} else if(e==eee['identificadorNodoFinal']){
								recorridos[iii].valorNodoFinal=valorNodo;
							}
							//No salir del each (return false) porque se repiten por cada conexión de nodo...
						//}
					});
					//Termina asignación de valores
				});
			}
			//console.log(nodosValores);
		});
		/*//Defino el último nodo no trivial como 0:
		$('.celda>.identificador-nodo[data-identificador="'+letraNodo+'"]').attr('data-identificador','0').attr('data-valor','0').text('0');
		nomenclatura.pop();*/
		//Siguiente bloque, pasado a función:
		/*
		nomenclatura.push('0');
		nomenclatura=nomenclatura.join(' > ');
		if(depuracion){
			console.log('Nomenclatura: '+nomenclatura);
		}
		$('#nomenclatura').html('<h3><strong>Nomenclatura:</strong> <span class="text-nowrap">'+nomenclatura+'</span></h3>').slideDown(800);
		*/
		return contador+800;
	}
}





function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}





//Esta funcion va al final de todo...
escucharEventos();






//1. circuito.pru();
//2. nodos.identificar();
//3. nodos.dibujar();
//4. nodos.polaridadResistencias();

