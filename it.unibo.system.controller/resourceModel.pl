/*
===============================================================
resourceModel.pl
===============================================================
*/
model( type(sensor, temperature), name(cityTemperature), value(0) ). 

getModelItem( TYPE, CATEG, NAME, VALUE ) :-
		model( type(TYPE, CATEG), name(NAME), value(VALUE) ).

changeModelItem( CATEG, NAME, VALUE ) :-
 		replaceRule( 
			model( type(TYPE, CATEG), name(NAME), value(_) ),  
			model( type(TYPE, CATEG), name(NAME), value(VALUE) ) 		
		),!,
		%%output( changedModelAction(CATEG, NAME, VALUE) ),
		( changedModelAction(CATEG, NAME, VALUE) %%to be defined by the appl designer
		  ; true ).	
		  
changedModelAction( temperature, NAME, V) :- 
		sendMsg( controller, updateResourceMsg, resource( sensor, temperature, NAME, V ) ). 
		
%%%  initialize
initResourceTheory :- output("initializing the initResourceTheory ...").
:- initialization(initResourceTheory).