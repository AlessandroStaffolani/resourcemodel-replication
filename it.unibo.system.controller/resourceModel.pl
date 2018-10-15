/*
===============================================================
resourceModel.pl
===============================================================
*/
model( type(temperature), value(0) ). 

getModelItem( TYPE, VALUE ) :-
		model( type(TYPE), value(VALUE) ).

changeModelItem( TYPE, VALUE ) :-
 		replaceRule( 
			model( type(TYPE), value(_) ),  
			model( type(TYPE), value(VALUE) ) 		
		),!,
		%%output( changedModelAction(CATEG, NAME, VALUE) ),
		( changedModelAction(TYPE, VALUE) %%to be defined by the appl designer
		  ; true ).	
		  
changedModelAction( temperature, V) :- 
		sendMsg( controller, updateResourceMsg, resource( temperature, V ) ). 
		
%%%  initialize
initResourceTheory :- output("initializing the initResourceTheory ...").
:- initialization(initResourceTheory).