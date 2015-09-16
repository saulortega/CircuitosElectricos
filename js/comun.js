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
var ResistenciaH = './img/R-h.png';
var ResistenciaV = './img/R-v.png';





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
		if(columnaDestino) //Aquí voy -----------------------
		var esq = posicion.esquina(this);
		if(esq){
			orientacion=esq;
			if(tipoElemento!='nodo'){
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
		/*console.log(celda)
		console.log('kkkkkkkk')
		alert(typeof(celda));return;*/
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
		//var I = '<img src="./img/R-h.png" class="arrastrable" draggable="true" data-origen="tablero" data-pos="H">'; //data-pos quemado,verificar después
		var I = '<img src="./img/'+tipoElemento+'-'+orientacion+'.png" class="arrastrable" draggable="true" data-origen="tablero" data-tipo="'+tipoElemento+'" data-ori="'+orientacion+'" data-con="'+conexiones+'" data-val="" onclick="elemento.valores(this)">';
		var spanVal = '<span class="valores"></span>';
		celda.innerHTML = I+spanVal;
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





var comprobacion = {
	'circuito':function(){
		comprobacion.limpiar();
		var cadaElemento = $('#tablero .celda img'); //Falta agregar filtro para que busque todo menos nodos
		console.log(cadaElemento)
		var incoherente = false;
		var cuenta=0;
		$.each(cadaElemento,function(ind,ele){
			cuenta++;
			var cel = ele.parentElement;
			var fi = posicion.fila(cel);
			var co = posicion.columna(cel);
			//var es = posicion.esquina(cel);
			//console.log($(ele).parent('.celda'));
			console.log(fi +' '+ co )
			var pos = $(ele).attr('data-ori');
			console.log(pos)
			var buscaFila=[];
			var buscaColumna=[];
			var inchrt = false;
			/*if(pos=='h'){
				buscaColumna.push(co-1);
				buscaColumna.push(co+1);
				$.each(buscaColumna,function(ind,ele){
					var buscoIzquierdaDerecha = $('#tablero>.fila[data-pos="'+fi+'"]>.celda[data-pos="'+ele+'"]>img');
					if(buscoIzquierdaDerecha.length>0){
						alert('encontrado');
					} else {
						alert('¡Circuito incoherente!')
					}
				});
			} else if(pos=='v'){
				if(fi==1){ //Primera fila
					buscaFila.push(fi+1); //Esto no debería ser necesario, no se deberia poder agregar un elemento vertical ahí----------
				} else if(fi==6){ //Ultima fila
					buscaFila.push(fi-1); //Esto no debería ser necesario, no se deberia poder agregar un elemento vertical ahí----------
				} else {
					buscaFila.push(fi-1);
					buscaFila.push(fi+1);
				}
				// --------------------- pendiente --------------------------
				$.each(buscaFila,function(ind,ele){
					var buscoArribaAbajo = $('#tablero>.fila[data-pos="'+ele+'"]>.celda[data-pos="'+co+'"]>img');
					if(buscoArribaAbajo.length>0){
						//console.log(buscoArribaAbajo)
					} else {
						alert('¡Circuito incoherente!')
					}
				});
			}*/
			var con = $(ele).attr('data-con');
			var cadaConexion = con.split(',');
			$.each(cadaConexion,function(ind,ele){
				console.log(ele+' jjlllllllll');
				if(ele=='ar'){
					buscaFila.push(fi-1);
				} else if(ele=='ab'){
					buscaFila.push(fi+1);
				} else if(ele=='iz'){
					buscaColumna.push(co-1);
				} else if(ele=='de'){
					buscaColumna.push(co+1);
				}
			});
			$.each(buscaFila,function(ind,ele){
				var buscoArribaAbajo = $('#tablero>.fila[data-pos="'+ele+'"]>.celda[data-pos="'+co+'"]>img');
				if(buscoArribaAbajo.length==0){
					inchrt=true;
					}
			});
			$.each(buscaColumna,function(ind,ele){
				var buscoIzquierdaDerecha = $('#tablero>.fila[data-pos="'+fi+'"]>.celda[data-pos="'+ele+'"]>img');
				if(buscoIzquierdaDerecha.length==0){
					inchrt=true;
				}
			});
			if(inchrt){
				$(ele).css('border','1px solid red');
				incoherente = true;
			}
			inchrt=false;
			//console.log('mmmmm');
			//console.log(buscaColumna);
			//console.log(buscaFila);
		});
		if(incoherente){
			alert('¡Circuito incoherente!');
		} else {
			if(cuenta>0){
				alert('Parece estar bien...');
			} else {
				alert('Arrastre elementos y dibuje un circuito...');
			}
		}
	},
	'identificarNodos':function(){
		comprobacion.limpiar();
		var cadaElemento = $('#tablero .celda img[data-tipo="nodo"]');
		//console.log(cadaElemento);
		$.each(cadaElemento,function(ind,ele){
			var con = $(ele).attr('data-con');
			//console.log(con)
			con = con.split(',');
			if(con.length>=3){ //Nodo no trivial
				//$(ele).css('border', '3px solid red');
				$(ele).parent('.celda').append('<span class="glyphicon glyphicon-record" style="position:absolute;font-size:20px;color:blue;top:15px;left:15px;" title="Nodo no trivial"></span>');
			} else { //Nodo trivial
				//$(ele).css('border', '3px solid green');
			}
		});
	},
	'limpiar':function(){
		$('.glyphicon-record').remove();
		$('.celda>img').css('border','');
	}
}




escucharEventos();