/* Generated by AN DISI Unibo */ 
package it.unibo.worldobserver;
import it.unibo.qactors.PlanRepeat;
import it.unibo.qactors.QActorContext;
import it.unibo.qactors.StateExecMessage;
import it.unibo.qactors.QActorUtils;
import it.unibo.is.interfaces.IOutputEnvView;
import it.unibo.qactors.action.AsynchActionResult;
import it.unibo.qactors.action.IActorAction;
import it.unibo.qactors.action.IActorAction.ActionExecMode;
import it.unibo.qactors.action.IMsgQueue;
import it.unibo.qactors.akka.QActor;
import it.unibo.qactors.StateFun;
import java.util.Stack;
import java.util.Hashtable;
import java.util.concurrent.Callable;
import alice.tuprolog.Struct;
import alice.tuprolog.Term;
import it.unibo.qactors.action.ActorTimedAction;
public abstract class AbstractWorldobserver extends QActor { 
	protected AsynchActionResult aar = null;
	protected boolean actionResult = true;
	protected alice.tuprolog.SolveInfo sol;
	protected String planFilePath    = null;
	protected String terminationEvId = "default";
	protected String parg="";
	protected boolean bres=false;
	protected IActorAction action;
	 
	
		protected static IOutputEnvView setTheEnv(IOutputEnvView outEnvView ){
			return outEnvView;
		}
		public AbstractWorldobserver(String actorId, QActorContext myCtx, IOutputEnvView outEnvView )  throws Exception{
			super(actorId, myCtx,  
			"./srcMore/it/unibo/worldobserver/WorldTheory.pl",
			setTheEnv( outEnvView )  , "init");
			this.planFilePath = "./srcMore/it/unibo/worldobserver/plans.txt";
	  	}
		@Override
		protected void doJob() throws Exception {
			String name  = getName().replace("_ctrl", "");
			mysupport = (IMsgQueue) QActorUtils.getQActor( name ); 
			initStateTable(); 
	 		initSensorSystem();
	 		history.push(stateTab.get( "init" ));
	  	 	autoSendStateExecMsg();
	  		//QActorContext.terminateQActorSystem(this);//todo
		} 	
		/* 
		* ------------------------------------------------------------
		* PLANS
		* ------------------------------------------------------------
		*/    
	    //genAkkaMshHandleStructure
	    protected void initStateTable(){  	
	    	stateTab.put("handleToutBuiltIn",handleToutBuiltIn);
	    	stateTab.put("init",init);
	    	stateTab.put("waitForResourceChange",waitForResourceChange);
	    	stateTab.put("handleResourceChange",handleResourceChange);
	    }
	    StateFun handleToutBuiltIn = () -> {	
	    	try{	
	    		PlanRepeat pr = PlanRepeat.setUp("handleTout",-1);
	    		String myselfName = "handleToutBuiltIn";  
	    		println( "worldobserver tout : stops");  
	    		repeatPlanNoTransition(pr,myselfName,"application_"+myselfName,false,false);
	    	}catch(Exception e_handleToutBuiltIn){  
	    		println( getName() + " plan=handleToutBuiltIn WARNING:" + e_handleToutBuiltIn.getMessage() );
	    		QActorContext.terminateQActorSystem(this); 
	    	}
	    };//handleToutBuiltIn
	    
	    StateFun init = () -> {	
	    try{	
	     PlanRepeat pr = PlanRepeat.setUp("init",-1);
	    	String myselfName = "init";  
	    	parg = "consult(\"./resourceModel.pl\")";
	    	//QActorUtils.solveGoal(myself,parg,pengine );  //sets currentActionResult		
	    	solveGoal( parg ); //sept2017
	    	temporaryStr = "\"Init World Observer\"";
	    	println( temporaryStr );  
	    	//switchTo waitForResourceChange
	        switchToPlanAsNextState(pr, myselfName, "worldobserver_"+myselfName, 
	              "waitForResourceChange",false, false, null); 
	    }catch(Exception e_init){  
	    	 println( getName() + " plan=init WARNING:" + e_init.getMessage() );
	    	 QActorContext.terminateQActorSystem(this); 
	    }
	    };//init
	    
	    StateFun waitForResourceChange = () -> {	
	    try{	
	     PlanRepeat pr = PlanRepeat.setUp(getName()+"_waitForResourceChange",0);
	     pr.incNumIter(); 	
	    	String myselfName = "waitForResourceChange";  
	    	//bbb
	     msgTransition( pr,myselfName,"worldobserver_"+myselfName,false,
	          new StateFun[]{stateTab.get("handleResourceChange") }, 
	          new String[]{"true","E","resourceChangeEvt" },
	          3600000, "handleToutBuiltIn" );//msgTransition
	    }catch(Exception e_waitForResourceChange){  
	    	 println( getName() + " plan=waitForResourceChange WARNING:" + e_waitForResourceChange.getMessage() );
	    	 QActorContext.terminateQActorSystem(this); 
	    }
	    };//waitForResourceChange
	    
	    StateFun handleResourceChange = () -> {	
	    try{	
	     PlanRepeat pr = PlanRepeat.setUp("handleResourceChange",-1);
	    	String myselfName = "handleResourceChange";  
	    	printCurrentEvent(false);
	    	//onEvent 
	    	setCurrentMsgFromStore(); 
	    	curT = Term.createTerm("resource(TYPE,CATEG,NAME,VALUE)");
	    	if( currentEvent != null && currentEvent.getEventId().equals("resourceChangeEvt") && 
	    		pengine.unify(curT, Term.createTerm("resource(TYPE,CATEG,NAME,VALUE)")) && 
	    		pengine.unify(curT, Term.createTerm( currentEvent.getMsg() ) )){ 
	    			String parg="changeModelItem(CATEG,NAME,VALUE)";
	    			/* PHead */
	    			parg =  updateVars( Term.createTerm("resource(TYPE,CATEG,NAME,VALUE)"), 
	    			                    Term.createTerm("resource(TYPE,CATEG,NAME,VALUE)"), 
	    				    		  	Term.createTerm(currentEvent.getMsg()), parg);
	    				if( parg != null ) {
	    				    aar = QActorUtils.solveGoal(this,myCtx,pengine,parg,"",outEnvView,86400000);
	    					//println(getName() + " plan " + curPlanInExec  +  " interrupted=" + aar.getInterrupted() + " action goon="+aar.getGoon());
	    					if( aar.getInterrupted() ){
	    						curPlanInExec   = "handleResourceChange";
	    						if( aar.getTimeRemained() <= 0 ) addRule("tout(demo,"+getName()+")");
	    						if( ! aar.getGoon() ) return ;
	    					} 			
	    					if( aar.getResult().equals("failure")){
	    						if( ! aar.getGoon() ) return ;
	    					}else if( ! aar.getGoon() ) return ;
	    				}
	    	}
	    	repeatPlanNoTransition(pr,myselfName,"worldobserver_"+myselfName,false,true);
	    }catch(Exception e_handleResourceChange){  
	    	 println( getName() + " plan=handleResourceChange WARNING:" + e_handleResourceChange.getMessage() );
	    	 QActorContext.terminateQActorSystem(this); 
	    }
	    };//handleResourceChange
	    
	    protected void initSensorSystem(){
	    	//doing nothing in a QActor
	    }
	
	}
